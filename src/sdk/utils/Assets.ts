export class Assets {
  static assetCount = 0;
  static loadingAssetUrls = [];
  static onProgressFns: ((loaded: number, total: number) => void)[] = [];
  static onLoadFns: (() => void)[] = [];

  static loadedAssets = {};
  /**
   * Returns the appropriate URL for an asset and also schedules it for preloading.
   */
  static getAssetUrl(asset: string) {
    // TODO switch CDN based on build variable 
    const url = `https://assets-soltrainer.netlify.app/${asset}`;
    //const url = `https://oldschool-cdn.com/${asset}`;
    if (Assets.loadedAssets[url]) {
      return url;
    }
    Assets.loadingAssetUrls.push(url);
    Assets.assetCount++;
    Promise.resolve().then(async () => {
      console.debug(`Preloading asset: ${url}`);
      const response = await fetch(url);
      const bytes = await response.arrayBuffer();
      console.debug(`Preloaded asset: ${url}, ${response.statusText}: ${bytes.byteLength}`);
      Assets.onProgressFns.forEach((onProgressFns) =>
        onProgressFns(this.assetCount - this.loadingAssetUrls.length, this.assetCount),
      );
      Assets.loadingAssetUrls = this.loadingAssetUrls.filter((u) => u !== url);
      Assets.loadedAssets[url] = true;
    });
    return url;
  }

  static onAssetProgress(progressFn: (loaded: number, total: number) => void) {
    Assets.onProgressFns.push(progressFn);
  }

  static onAllAssetsLoaded(loadFn: () => void) {
    Assets.onLoadFns.push(loadFn);
  }

  static checkAssetsLoaded(timer: NodeJS.Timeout) {
    if (Assets.loadingAssetUrls.length === 0) {
      Assets.onLoadFns.forEach((onLoadFunction) => onLoadFunction());
      clearInterval(timer);
    }
  }
}
