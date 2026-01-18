class ThemeService {
  title;
  description;
  footer;
  about;

  constructor() {
    this.observers = [];

    fetch("/theme/theme.txt")
      .then((stream) => stream.text())
      .then((txt) => {
        let lines = txt.split(/\r?\n/);

        let dict = {};

        for (let i = 0; i < lines.length; i++) {
          let idx = lines[i].indexOf(":");
          let variable = lines[i].substring(0, idx).replace(": ", "");
          let value = lines[i].substring(idx).replace(": ", "");

          if (variable && value) {
            dict[variable] = value;
          }
        }

        this.title = dict["title"];
        document.title = this.title;

        document.documentElement.style.cssText =
          "--gallery-background-color: " +
          dict["gallery-background-color"] +
          ";";
        document.documentElement.style.cssText +=
          "--panel-background-color: " + dict["panel-background-color"] + ";";
        document.documentElement.style.cssText +=
          "--text-color: " + dict["text-color"] + ";";

        document.documentElement.style.cssText +=
          "--filter-button-border-color: " +
          dict["filter-button-border-color"] +
          ";";
        document.documentElement.style.cssText +=
          "--filter-button-text-color: " +
          dict["filter-button-text-color"] +
          ";";
        document.documentElement.style.cssText +=
          "--filter-button-color: " + dict["filter-button-color"] + ";";

        this.notifyObservers();
      })


    fetch("/theme/description.txt")
      .then((stream) => stream.text())
      .then((txt) => {
        this.description = marked.parse(txt);;
        this.notifyObservers();
      })


    fetch("/theme/footer.txt")
      .then((stream) => stream.text())
      .then((txt) => {
        this.footer = marked.parse(txt);;
        this.notifyObservers();
      })

    fetch("/theme/about.txt")
      .then((stream) => stream.text())
      .then((txt) => {
        this.about = marked.parse(txt);;
        this.notifyObservers();
      })
  }

  addObserver(fn) {
    this.observers.push(fn);
  }

  notifyObservers() {
    this.observers.forEach((fn) => fn());
  }
}

window.themeService = new ThemeService();
