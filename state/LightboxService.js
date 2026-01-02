class LightboxService {
  constructor() {}

  openLightbox(deviationId) {
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
    lightbox.shadowRoot.querySelector("#lightbox").appendChild(element);
    lightbox.open();
  }
}

window.lightboxService = new LightboxService();
