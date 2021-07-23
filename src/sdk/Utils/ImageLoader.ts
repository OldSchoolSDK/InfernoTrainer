
export class ImageLoader {

  static onLoadFns: (() => void)[] = [];
  static pendingImages: number = 0;
  static completedImages: number = 0;
  static hasLoaded: boolean = false;
  
  static createImage (src: string): HTMLImageElement {
    ImageLoader.pendingImages++;
    const img = new Image();
    img.src = src;
    img.addEventListener('load', () => {
      ImageLoader.completedImages++;
    });
    img.addEventListener('error', () => {
      ImageLoader.completedImages++;
    })
    return img;
  }

  static onLoad(loadFn: () => void) {
    ImageLoader.onLoadFns.push(loadFn);
  }
  
  static checkImagesLoaded(timer: NodeJS.Timeout) {
    if (ImageLoader.pendingImages === ImageLoader.completedImages){
      ImageLoader.onLoadFns.forEach((onLoadFunction) => onLoadFunction())
      clearInterval(timer)
    }
  }

}