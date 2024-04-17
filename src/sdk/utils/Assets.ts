export class Assets {
  static assetCount = 0;
  static loadingAssetUrls = [];
  static onProgressFns: ((loaded: number, total: number) => void)[] = [];
  static onLoadFns: (() => void)[] = [];

  /**
   * Returns the appropriate URL for an asset and also schedules it for preloading.
   */
  static getAssetUrl(asset: string) {
    const url = `https://assets-soltrainer.netlify.app/${asset}`;
    Assets.loadingAssetUrls.push(url);
    Assets.assetCount++;
    Promise.resolve().then(async () => {
      console.log(`Preloading asset: ${url}`);
      const response = await fetch(url);
      const bytes = await response.arrayBuffer();
      console.log(`Preloaded asset: ${url}, ${response.statusText}: ${bytes.byteLength}`);
      Assets.onProgressFns.forEach((onProgressFns) =>
        onProgressFns(this.assetCount - this.loadingAssetUrls.length, this.assetCount),
      );
      Assets.loadingAssetUrls = this.loadingAssetUrls.filter((u) => u !== url);
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
