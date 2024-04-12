export class ImageLoader {
  static onLoadFns: (() => void)[] = [];
  static pendingImages = 0;
  static completedImages = 0;
  static hasLoaded = false;

  static imageCache = {};

  static createImage(src: string): HTMLImageElement {
    if (!src) {
      return null;
    }

    if (this.imageCache[src]) {
      return this.imageCache[src];
    }

    ImageLoader.pendingImages++;
    const img = new Image();
    img.src = src;
    img.addEventListener("load", () => {
      ImageLoader.completedImages++;
    });
    img.addEventListener("error", () => {
      img.src = "";
      img.src = src + "?retry=" + String(Math.random());
      ImageLoader.completedImages++;
    });
    this.imageCache[src] = img;
    return img;
  }

  static onAllImagesLoaded(loadFn: () => void) {
    ImageLoader.onLoadFns.push(loadFn);
  }

  static checkImagesLoaded(timer: NodeJS.Timeout) {
    if (ImageLoader.pendingImages === ImageLoader.completedImages) {
      ImageLoader.onLoadFns.forEach((onLoadFunction) => onLoadFunction());
      clearInterval(timer);
    }
  }
}
