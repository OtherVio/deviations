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
        this.render();
      }

      get date() {
        return this.#date;
      }

      set date(value) {
        this.#date = structuredClone(value);
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

        const content = this.shadowRoot.querySelectorAll(".content")[0];
        content.innerHTML = `<img src="/deviations/images/${this.image}"/>`;

        if (!this.#thumbnail) {
          this.onclick = undefined;
          this.shadowRoot.querySelectorAll(".box")[0].classList.remove("scale");
          content.innerHTML += marked.parse(this.#markdown);
        } else {
          this.onclick = () => window.lightboxService.openLightbox(this.id);
          this.shadowRoot.querySelectorAll(".box")[0].classList.add("scale");
        }
      }

      open() {
        this.onclick();
      }
    }
    customElements.define("devi-deviation", Deviation);
  });
