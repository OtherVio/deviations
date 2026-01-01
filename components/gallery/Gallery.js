fetch("/components/gallery/Gallery.html")
    .then(stream => stream.text())
    .then(html => {
        const template = document.createElement('template');
        template.innerHTML = html;
        const element = document.body.appendChild(template);

        class Gallery extends HTMLElement {
            #deviationsByTag = {}
            #shadowRoot

            constructor() {
                super();

                let template = element;
                let templateContent = template.content;

                const shadowRoot = this.attachShadow({
                    mode: "open"
                });
                this.#shadowRoot = shadowRoot;
                shadowRoot.appendChild(templateContent.cloneNode(true));

                fetch("/deviations/index.txt")
                    .then(stream => stream.text())
                    .then(txt => {
                        let deviationNames = txt.split(/\r?\n/);
                        deviationNames.forEach(deviationName => {
                            fetch("/deviations/" + deviationName + ".md")
                                .then(stream => stream.text())
                                .then(txt => {
                                    let arr = txt.split('---');
                                    if (arr.length > 0) {
                                        let fm = arr[1];
                                        let lines = fm.split(/\r?\n/);

                                        let dict = {};

                                        for (let i = 0; i < lines.length; i++) {
                                            let idx = lines[i].indexOf(':');
                                            let variable = lines[i].substring(0, idx).replace(': ', '');
                                            let value = lines[i].substring(idx).replace(': ', '');

                                            if (variable && value) {
                                                dict[variable] = value;
                                            }
                                        }

                                        const parent = document.createElement('div');
                                        parent.className = 'item';
                                        const element = document.createElement('devi-deviation');
                                        parent.appendChild(element);
                                        element.markdown = arr[2];

                                        const title = dict["title"];
                                        const date = dict["date"];
                                        const image = dict["image"];

                                        element.title = title;
                                        element.date = date;
                                        element.image = image;

                                        delete dict["title"];
                                        delete dict["date"];
                                        delete dict["image"];

                                        const tags = dict;

                                        for (let el in tags) {
                                            const arr = tags[el].split(',');
                                            const trimmedTags = [];
                                            for (let tag of arr) {
                                                const trimmedTag = tag.trim();
                                                trimmedTags.push(trimmedTag);

                                                if (!(el in this.#deviationsByTag)) {
                                                    this.#deviationsByTag[el] = {}
                                                }

                                                if (!(tag in this.#deviationsByTag[el])) {
                                                    this.#deviationsByTag[el][tag] = [];
                                                }

                                                this.#deviationsByTag[el][tag].push(deviationName);
                                            }
                                            tags[el] = trimmedTags;
                                        }

                                        element.tags = tags;

                                        shadowRoot.querySelectorAll('.content')[0].appendChild(parent);
                                    }
                                    else {
                                        shadowRoot.querySelectorAll('.content')[0].innerHTML = "Missing deviation information."
                                    }

                                    console.log(JSON.stringify(this.#deviationsByTag));

                                    window.setTimeout(this.resizeAllGridItems.bind(this), 100);
                                    window.addEventListener("resize", this.resizeAllGridItems.bind(this));
                                }
                                );
                        });
                    });
            }

            resizeGridItem(item) {
                const grid = this.#shadowRoot.querySelectorAll(".content")[0];

                const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
                const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));

                const rowSpan = Math.ceil((item.querySelectorAll("devi-deviation")[0].getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));

                console.log(rowSpan)

                item.style.gridRowEnd = "span " + rowSpan;
            }

            resizeAllGridItems() {
                const allItems = this.#shadowRoot.querySelectorAll(".item");
                for (let x = 0; x < allItems.length; x++) {
                    this.resizeGridItem(allItems[x]);
                }
            }

            resizeInstance(instance) {
                const item = instance.elements[0];
                this.resizeGridItem(item);
            }
        }
        customElements.define('devi-gallery', Gallery);
    });