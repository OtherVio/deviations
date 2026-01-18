fetch("/components/paginator/Paginator.html")
  .then((stream) => stream.text())
  .then((html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    const element = document.body.appendChild(template);

    class Paginator extends HTMLElement {
      #shadowRoot;
      #pageCount;

      constructor() {
        super();

        let template = element;
        let templateContent = template.content;

        this.#shadowRoot = this.attachShadow({
          mode: "open",
        });
        this.#shadowRoot.appendChild(templateContent.cloneNode(true));

        window.page.addObserver(this.render.bind(this));
      }

      render(pageInfo) {
        let back = this.#shadowRoot.querySelector("#backPage");
        back.onclick = this.back;
        let forward = this.#shadowRoot.querySelector("#forwardPage");
        forward.onclick = this.forward;
        let page = this.#shadowRoot.querySelector("#page");

        if (pageInfo.page == 1) {
          back.classList.add("hidden");
        }
        else {
          back.classList.remove("hidden");
        }

        if (pageInfo.page == pageInfo.pageCount) {
          forward.classList.add("hidden");
        }
        else {
          forward.classList.remove("hidden");
        }

        if (pageInfo) {
          if (this.#pageCount != pageInfo.pageCount) {
            this.#pageCount = pageInfo.pageCount;


            page.innerHTML = '';
            page.onchange = this.selectPage.bind(this);

            for (let i = 1; i <= window.page.pageCount; i++) {
              let option = document.createElement("option");
              option.value = i;
              option.innerHTML = i;
              page.appendChild(option);
            }
          }
        }

        let options = this.shadowRoot.querySelectorAll("option");
        for (let option of options) {
          // I'm pretty sure these are strings, lol
          if (option.innerHTML == window.page.page) option.selected = 'selected';
        }
      }

      forward() {
        window.page.page = window.page.page + 1;
      }

      back() {
        window.page.page = window.page.page - 1;
      }

      selectPage() {
        let page = this.#shadowRoot.querySelector("#page");
        window.page.page = page.value;
      }
    }
    customElements.define("devi-paginator", Paginator);
  });
