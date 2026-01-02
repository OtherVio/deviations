fetch("/components/filters/Filters.html")
  .then((stream) => stream.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = document.body.appendChild(template);

    class Filters extends HTMLElement {
      #tags;
      #shadowRoot;

      constructor() {
        super();

        window.tags.addObserver(this.updatetags.bind(this));
        this.#tags = window.tags;

        let template = element;
        let templateContent = template.content;

        this.#shadowRoot = this.attachShadow({
          mode: "open",
        });
        this.#shadowRoot.appendChild(templateContent.cloneNode(true));
      }

      updatetags(tags) {
        this.#tags = tags;
        this.render();
      }

      render() {
        const content = this.#shadowRoot.querySelectorAll(".content")[0];
        content.innerHTML = "";
        for (let tagName in this.#tags) {
          const tagDict = {};
          for (let tag of this.#tags[tagName]) {
            if (!(tagName in tagDict)) {
              tagDict[tagName] = [];
            }

            tagDict[tagName].push(tag);
          }

          let tagEl;
          tagEl = document.createElement("devi-tag-filter");
          tagEl.id = tagName;
          content.appendChild(tagEl);
          tagEl.tag = tagDict;
        }
      }
    }
    customElements.define("devi-filters", Filters);
  });
