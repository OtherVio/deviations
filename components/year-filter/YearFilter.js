fetch("/components/year-filter/YearFilter.html")
  .then((stream) => stream.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = document.body.appendChild(template);

    class YearFilter extends HTMLElement {
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

        this.render();
      }

      render() {
        let to = this.#shadowRoot.querySelector("#to");
        to.onchange = this.selectTo.bind(this);

        let from = this.#shadowRoot.querySelector("#from");
        from.id = "from";
        from.onchange = this.selectFrom.bind(this);

        let years = window.years.years;
        for (let year of years) {
          for (let el of [to, from]) {
            let option = document.createElement("option");
            option.value = year;
            option.innerHTML = year;
            el.appendChild(option);
          }
        }
      }

      selectFrom() {
        let from = this.#shadowRoot.querySelector("#from");
        if (from !== "year") window.filters.from = from.value;
        else window.filters.from = undefined;
      }

      selectTo() {
        let to = this.#shadowRoot.querySelector("#to");
        if (to !== "year") window.filters.to = to.value;
        else window.filters.to = undefined;
      }
    }
    customElements.define("devi-year-filter", YearFilter);
  });
