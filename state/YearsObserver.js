class YearsObserver {
  #years;

  constructor() {
    this.#years = [];
  }

  get years() {
    return this.#years;
  }

  set years(years) {
    years.sort((a, b) => a - b);
    let smallest = years[0];
    let largest = years[years.length - 1];
    for (let i = smallest; i < largest; i++) {
      if (!years.includes(i)) years.push(i);
    }
    years.sort((a, b) => a - b);
    this.#years = years;
  }
}

window.years = new YearsObserver();
