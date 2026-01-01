fetch("/components/header/Header.html")
    .then(stream => stream.text())
    .then(html => {
        const template = document.createElement('template');
        template.innerHTML = html;
        const element = document.body.appendChild(template);

        class Header extends HTMLElement {
            #shadowRoot

            constructor() {
                super();

                let template = element;
                let templateContent = template.content;

                this.#shadowRoot = this.attachShadow({
                    mode: "open"
                });
                this.#shadowRoot.appendChild(templateContent.cloneNode(true));
            }
        }
        customElements.define('devi-header', Header);
    });