fetch("/components/tag-filter/TagFilter.html")
  .then((stream) => stream.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = document.body.appendChild(template);

    class TagFilter extends HTMLElement {
      #shadowRoot;
      #tag;

      constructor() {
        super();

        let template = element;
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({
          mode: "open",
        });
        this.#shadowRoot = shadowRoot;
        shadowRoot.appendChild(templateContent.cloneNode(true));
      }

      get tag() {
        return this.#tag;
      }

      set tag(tag) {
        this.#tag = tag;
        this.render();
      }

      render() {
        this.#shadowRoot.querySelectorAll(
          ".panel details summary"
        )[0].innerHTML = Object.keys(this.#tag)[0];

        const content =
          this.#shadowRoot.querySelectorAll(".panel details div")[0];

        const tagName = Object.keys(this.#tag)[0];

        for (let i = 0; i < this.#tag[Object.keys(this.#tag)[0]].length; i++) {
          // check if this checkbox has been initialized

          const tag = this.#tag[Object.keys(this.#tag)[0]][i];

          if (
            !this.#shadowRoot.querySelectorAll(
              `#${tagName + "-" + tag + "-checkbox"}`
            ).length
          ) {
            let label = document.createElement("label");
            let input = document.createElement("input");

            input.type = "checkbox";
            input.name = tag;
            input.id = tagName + "-" + tag + "-checkbox";
            input.onchange = this.select.bind(this, i);

            label.innerHTML = tag;

            content.appendChild(label);
            label.appendChild(input);
          }
        }
      }

      select(tagIdx) {
        const tag = this.#tag[Object.keys(this.#tag)[0]][tagIdx];
        window.filters.toggleTag(Object.keys(this.#tag)[0], tag);
      }
    }
    customElements.define("devi-tag-filter", TagFilter);
  });
