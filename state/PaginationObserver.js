class PageObserver {
    #page;
    #items;
    #pageCount;

    constructor() {
        this.observers = [];

        this.#page = 1;
        this.#items = 10;
        this.pageCount = 1;

        window.filters.addObserver(this.reset.bind(this));
    }

    reset() {
        this.#page = 1;
        this.notifyObservers();
    }

    addObserver(fn) {
        this.observers.push(fn);
    }

    notifyObservers() {
        this.observers.forEach((fn) => fn({
            page: this.page,
            itemsPerPage: this.itemsPerPage,
            pageCount: this.pageCount
        }));
    }

    get page() {
        return this.#page;
    }

    set page(p) {
        this.#page = p;
        this.notifyObservers();
    }

    get itemsPerPage() {
        return this.#items;
    }

    set itemsPerPage(items) {
        this.#items = items;
        this.notifyObservers();
    }

    set pageCount(count) {
        this.#pageCount = count;
        this.notifyObservers();
    }

    get pageCount() {
        return this.#pageCount;
    }
}

window.page = new PageObserver();
