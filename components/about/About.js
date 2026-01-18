fetch("/components/about/About.html")
  .then((stream) => stream.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = document.body.appendChild(template);

    class About extends HTMLElement {
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
        window.themeService.addObserver(this.render.bind(this));
        this.render();
      }

      render() {
        console.log(window.themeService.about);
        let about = this.#shadowRoot.querySelector(".about");
        about.innerHTML = window.themeService.about;
      }
    }
    customElements.define("devi-about", About);
  });
