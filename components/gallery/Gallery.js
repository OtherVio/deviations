fetch("/components/gallery/Gallery.html")
  .then((stream) => stream.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = document.body.appendChild(template);

    class Gallery extends HTMLElement {
      #deviationsByTag = {};
      #deviationsByYear = {};
      #shadowRoot;

      constructor() {
        super();

        let template = element;
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({
          mode: "open",
        });
        this.#shadowRoot = shadowRoot;
        shadowRoot.appendChild(templateContent.cloneNode(true));

        fetch("/deviations/index.txt")
          .then((stream) => stream.text())
          .then((txt) => {
            let deviationNames = txt.split(/\r?\n/);
            window.deviationLoading.deviationsToLoad = deviationNames;
            window.imageLoading.deviationsToLoad = deviationNames;
            deviationNames.forEach((deviationName) => {
              fetch("/deviations/" + deviationName + ".dev")
                .then((stream) => stream.text())
                .then((txt) => {
                  let arr = txt.split("---");
                  if (arr.length > 0) {
                    let fm = arr[1];
                    let lines = fm.split(/\r?\n/);

                    let dict = {};

                    for (let i = 0; i < lines.length; i++) {
                      let idx = lines[i].indexOf(":");
                      let variable = lines[i]
                        .substring(0, idx)
                        .replace(": ", "");
                      let value = lines[i].substring(idx).replace(": ", "");

                      if (variable && value) {
                        dict[variable] = value;
                      }
                    }

                    const parent = document.createElement("div");
                    parent.className = "item";
                    const element = document.createElement("devi-deviation");
                    parent.appendChild(element);
                    element.markdown = arr[2];

                    const title = dict["title"];
                    const date = dict["date"];
                    const image = dict["image"];

                    element.title = title;
                    element.date = new Date(date);
                    element.image = image;
                    element.thumbnail = true;
                    element.deviationName = deviationName;
                    parent.id = "item-" + deviationName;

                    delete dict["title"];
                    delete dict["date"];
                    delete dict["image"];

                    const tags = dict;

                    const year = element.date.getFullYear();
                    if (!(year in this.#deviationsByYear))
                      this.#deviationsByYear[year] = [];
                    this.#deviationsByYear[year].push(deviationName);

                    if (!window.years.years.includes(year))
                      window.years.years = [...window.years.years, year];

                    for (let el in tags) {
                      const arr = tags[el].split(",");
                      const trimmedTags = [];
                      for (let tag of arr) {
                        const trimmedTag = tag.trim();
                        trimmedTags.push(trimmedTag);

                        if (!(el in this.#deviationsByTag)) {
                          this.#deviationsByTag[el] = {};
                        }

                        if (!(trimmedTag in this.#deviationsByTag[el])) {
                          this.#deviationsByTag[el][trimmedTag] = [];
                        }

                        this.#deviationsByTag[el][trimmedTag].push(
                          deviationName
                        );

                        const tags = { ...window.tags.tags };

                        if (!(el in tags)) {
                          tags[el] = [];
                        }

                        if (!tags[el].includes(trimmedTag))
                          tags[el].push(trimmedTag);

                        window.tags.tags = tags;
                      }
                      tags[el] = trimmedTags;
                    }

                    element.tags = tags;

                    let existing =
                      shadowRoot.querySelectorAll(".content .item");
                    let referenceNode;
                    if (existing.length !== 0) {
                      for (let d of existing) {
                        referenceNode = d;
                        if (d.childNodes[0].date <= element.date) {
                          break;
                        }
                      }
                    }

                    // if none is found, we'll have iterated
                    // over the whole list
                    if (
                      !referenceNode ||
                      referenceNode.childNodes[0].date > element.date
                    ) {
                      shadowRoot
                        .querySelectorAll(".content")[0]
                        .appendChild(parent);
                    } else {
                      shadowRoot
                        .querySelectorAll(".content")[0]
                        .insertBefore(parent, referenceNode);
                    }
                  } else {
                    shadowRoot.querySelectorAll(".content")[0].innerHTML =
                      "Missing deviation information.";
                  }
                });
            });

            window.addEventListener(
              "resize",
              this.resizeAllGridItems.bind(this)
            );
            window.filters.addObserver(this.filter.bind(this));
            window.imageLoading.addObserver(this.resizeAllGridItems.bind(this));
          });
      }

      getDeviations() {
        return this.#shadowRoot.querySelectorAll(
          ".item:not(.hidden) devi-deviation"
        );
      }

      filter(filters) {
        const deviations = this.#shadowRoot.querySelectorAll(".item");
        let deviationIds = [];

        if (
          !Object.keys(filters["tags"]).length &&
          !filters["from"] &&
          !filters["to"]
        ) {
          for (let deviation of deviations) {
            deviation.classList.remove("hidden");
          }
          return;
        }

        for (let deviation of deviations) {
          deviation.classList.add("hidden");
          deviationIds.push(deviation.id);
        }

        if (filters["from"]) {
          // iterate over each key in deviations by year
          // append that year's list if that year is >= from
          let fromYearDeviations = [];
          for (let year in this.#deviationsByYear) {
            if (year >= filters["from"]) {
              fromYearDeviations.push(...this.#deviationsByYear[year]);
            }
          }

          deviationIds = deviationIds.filter((d) =>
            fromYearDeviations.includes(d.split("item-")[1])
          );
        }

        if (filters["to"]) {
          // iterate over each key in deviations by year
          // append that year's list if that year is <= to
          let fromYearDeviations = [];
          for (let year in this.#deviationsByYear) {
            if (year <= filters["to"]) {
              fromYearDeviations.push(...this.#deviationsByYear[year]);
            }
          }

          deviationIds = deviationIds.filter((d) =>
            fromYearDeviations.includes(d.split("item-")[1])
          );
        }

        for (let tagName in this.#deviationsByTag) {
          if (tagName in filters["tags"]) {
            for (let tag in this.#deviationsByTag[tagName]) {
              if (filters["tags"][tagName].includes(tag)) {
                deviationIds = deviationIds.filter((d) =>
                  this.#deviationsByTag[tagName][tag].includes(
                    d.split("item-")[1]
                  )
                );
              }
            }
          }
        }

        for (let id of deviationIds) {
          this.#shadowRoot
            .querySelectorAll(`#${id}`)[0]
            .classList.remove("hidden");
        }
      }

      // Approach from Andy Barefoot
      // https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
      resizeGridItem(item) {
        const grid = this.#shadowRoot.querySelectorAll(".content")[0];

        const rowHeight = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
        );
        const rowGap = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
        );

        const rowSpan = Math.ceil(
          (item.querySelectorAll("devi-deviation")[0].getBoundingClientRect()
            .height +
            rowGap) /
            (rowHeight + rowGap)
        );

        item.style.gridRowEnd = "span " + rowSpan;
      }

      resizeAllGridItems() {
        const allItems = this.#shadowRoot.querySelectorAll(".item");
        for (let x = 0; x < allItems.length; x++) {
          this.resizeGridItem(allItems[x]);
        }
      }

      resizeInstance(instance) {
        const item = instance.elements[0];
        this.resizeGridItem(item);
      }
    }
    customElements.define("devi-gallery", Gallery);
  });
