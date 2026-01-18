fetch("/components/deviation/Deviation.html")
  .then((stream) => stream.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = document.body.appendChild(template);

    class Deviation extends HTMLElement {
      #image;
      #date;
      #tags;
      #markdown;
      #thumbnail;
      #deviationName;
      shadowRoot;

      constructor() {
        super();

        let template = element;
        let templateContent = template.content;

        this.shadowRoot = this.attachShadow({
          mode: "open",
        });
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
      }

      get thumbnail() {
        return this.#thumbnail;
      }

      set thumbnail(isThumb) {
        this.#thumbnail = isThumb;
        this.render();
      }

      get markdown() {
        return this.#markdown;
      }

      set markdown(value) {
        this.#markdown = structuredClone(value);
        this.render();
      }

      get image() {
        return this.#image;
      }

      set image(value) {
        this.#image = structuredClone(value);
        this.render();
      }

      get deviationName() {
        return this.#deviationName;
      }

      set deviationName(value) {
        this.#deviationName = structuredClone(value);
        this.id = this.#deviationName;
        window.deviationLoading.loaded(this.#deviationName);
        this.render();
      }

      get date() {
        return this.#date;
      }

      set date(value) {
        this.#date = value;
        this.render();
      }

      get tags() {
        return this.#tags;
      }

      set tags(value) {
        this.#tags = structuredClone(value);
        this.render();
      }

      render() {
        if (!this.image) return;

        const content = this.shadowRoot.querySelector(".content");
        content.innerHTML = `<a href="#${this.deviationName ? this.deviationName : ""
          }"><img loading="lazy" src="/deviations/images/${this.image
          }" onload="window.imageLoading.loaded('${this.deviationName}')"/></a>`;

        if (!this.#thumbnail) {
          const description = this.shadowRoot.querySelector(".description");
          description.innerHTML += marked.parse(this.#markdown);
          this.shadowRoot.querySelector(".additional").classList.remove("hidden");
          this.shadowRoot.querySelector(".box").classList.remove("scale");
        } else {
          this.shadowRoot.querySelector(".additional").classList.add("hidden");
          this.shadowRoot.querySelector(".box").classList.add("scale");
        }

        let nextButton = this.shadowRoot.querySelector(".next");
        let prevButton = this.shadowRoot.querySelector(".previous");

        nextButton.onclick = () => {
          window.lightboxService.next();
          this.render.bind(this)();
        };
        prevButton.onclick = () => {
          window.lightboxService.previous();
          this.render.bind(this)();
        };

        if (window.lightboxService.hasNext()) {
          nextButton.classList.remove("hidden");
        } else {
          nextButton.classList.add("hidden");
        }

        if (window.lightboxService.hasPrevious()) {
          prevButton.classList.remove("hidden");
        } else {
          prevButton.classList.add("hidden");
        }
      }
    }
    customElements.define("devi-deviation", Deviation);
  });
