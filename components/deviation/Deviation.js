fetch("/components/deviation/Deviation.html")
    .then(stream => stream.text())
    .then(html => {
        const template = document.createElement('template');
        template.innerHTML = html;
        const element = document.body.appendChild(template);

        class Deviation extends HTMLElement {
            #image
            #date
            #tags
            #markdown
            shadowRoot

            constructor() {
                super();

                let template = element;
                let templateContent = template.content;

                this.shadowRoot = this.attachShadow({
                    mode: "open"
                });
                this.shadowRoot.appendChild(templateContent.cloneNode(true));
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
                console.log(this.tags)
                this.render();
            }

            render() {
                this.shadowRoot.querySelectorAll('.content')[0].innerHTML = marked.parse(this.#markdown);
            }
        }
        customElements.define('devi-deviation', Deviation);
    });