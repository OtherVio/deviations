class WeatherStation {
  #filters
  
  constructor() {
    this.observers = [];
    /*
      {
        from
        to
        tags: {tagName: []}
      }
    */
    this.#filters = {}; 
  }
 
  addObserver(fn) {
    this.observers.push(fn);
  }
 
  notifyObservers() {
    this.observers.forEach(fn => fn());
  }

  get() {
    return this.#filters;
  }
 
  set(filters) {
    this.#filters = filters;
    this.notifyObservers();
  }
}

window.filters = new WeatherStation();