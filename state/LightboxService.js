class LightboxService {
  #deviationId

  constructor() {
    if (location.hash) {
      const id = location.hash.slice(1);
      window.setTimeout(() => this.openLightbox(id), 500);
    }

    window.navigation.addEventListener("navigate", (event) => {
      if (location.hash) {
        const id = location.hash.slice(1);
        this.openLightbox(id);
      }
      else {
        // close the actual lightbox element without changing url
      }
    })

  }

  openLightbox(deviationId) {
    this.#deviationId = deviationId;
    location.hash = deviationId;

    if (document.body.querySelector("devi-lightbox")) {
      document.body.removeChild(document.body.querySelector("devi-lightbox"));
    }

    const lightbox = document.createElement("devi-lightbox");

    const element = document.createElement("devi-deviation");

    const gallery = document.querySelector("devi-gallery");
    const deviations = gallery.getDeviations();

    let deviation;
    for (let d of deviations) {
      if (d.id === deviationId) deviation = d;
    }

    element.markdown = deviation["markdown"];
    element.title = deviation["title"];
    element.date = deviation["date"];
    element.image = deviation["image"];

    document.body.appendChild(lightbox);
    let dialog = lightbox.shadowRoot.querySelector("#lightbox");
    dialog.appendChild(element);
    lightbox.open();
  }

  closeLightbox() {
    history.pushState("", document.title, window.location.pathname
      + window.location.search);
  }

  next() {
    const gallery = document.querySelector("devi-gallery");
    const deviations = gallery.getDeviations();

    let deviation;
    for (let d of deviations) {
      if (deviation) {
        deviation = d;
        break;
      }
      if (d.id === this.#deviationId) deviation = d;
    }

    console.log(deviation.id)

    this.openLightbox(deviation.id);
  }

  previous() {
    const gallery = document.querySelector("devi-gallery");
    const deviations = gallery.getDeviations();

    let deviation;
    for (let d of deviations) {
      if (d.id === this.#deviationId) {
        break;
      }
      deviation = d;

    }

    console.log(deviation.id)

    this.openLightbox(deviation.id);
  }
}

window.lightboxService = new LightboxService();
