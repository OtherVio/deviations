class TagsObserver {
  #tags;

  constructor() {
    this.observers = [];
    /*
      {tagName: [tag]}
    */
    this.#tags = {};
  }

  addObserver(fn) {
    this.observers.push(fn);
  }

  notifyObservers() {
    this.observers.forEach((fn) => fn(this.#tags));
  }

  get tags() {
    return this.#tags;
  }

  set tags(tags) {
    this.#tags = tags;
    this.notifyObservers();
  }
}

window.tags = new TagsObserver();
