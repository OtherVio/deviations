fetch("/components/lightbox/Lightbox.html")
  .then((stream) => stream.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = document.body.appendChild(template);

    class Lightbox extends HTMLElement {
      #shadowRoot;
      #deviation;

      constructor() {
        super();

        let template = element;
        let templateContent = template.content;

        this.#shadowRoot = this.attachShadow({
          mode: "open",
        });
        this.#shadowRoot.appendChild(templateContent.cloneNode(true));
      }

      get deviation() {
        return this.#deviation;
      }

      set deviation(deviationName) {
        this.#deviation = deviationName;
      }

      open() {
        this.#shadowRoot.querySelector("dialog").showModal();
        this.#shadowRoot.querySelector("#close").onclick = () => {
          location.hash = '';
        };
      }

    }
    customElements.define("devi-lightbox", Lightbox);
  });
