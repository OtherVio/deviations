class FiltersObserver {
  #filters;

  constructor() {
    this.observers = [];
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

  set to(to) {
    this.#filters["to"] = to;
    this.notifyObservers();
  }

  get to() {
    return this.#filters["to"];
  }

  set from(from) {
    this.#filters["from"] = from;
    this.notifyObservers();
  }

  get from() {
    return this.#filters["from"];
  }

  toggleTag(tagName, tag) {
    if (!this.#filters["tags"][tagName]) {
      this.#filters["tags"][tagName] = [];
    }

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
