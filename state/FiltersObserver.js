class FiltersObserver {
  #filters;

  constructor() {
    this.observers = [];
    /*
      {
        all: {
          years: []
          tags: {tagName: [tag]}
        }
        active: {
          from
          to
          tags: {tagName: [tag]}
        }
      }
    */
    this.#filters = { tags: {} };
  }

  addObserver(fn) {
    this.observers.push(fn);
  }

  notifyObservers() {
    this.observers.forEach((fn) => fn(this.#filters));
  }

  get filters() {
    return this.#filters;
  }

  set filters(filters) {
    this.#filters = filters;
    this.notifyObservers();
  }

  toggleTag(tagName, tag) {
    if (!this.#filters["tags"][tagName]) {
      this.#filters["tags"][tagName] = [];
    }

    // note: does not clean up tag names. this is a tiny leak
    if (!this.#filters["tags"][tagName].includes(tag)) {
      this.#filters["tags"][tagName].push(tag);
    } else {
      let index = this.#filters["tags"][tagName].indexOf(tag);
      this.#filters["tags"][tagName].splice(index, 1);
      if (this.#filters["tags"][tagName].length === 0) {
        delete this.#filters["tags"][tagName];
      }
    }

    this.notifyObservers();
  }
}

window.filters = new FiltersObserver();
