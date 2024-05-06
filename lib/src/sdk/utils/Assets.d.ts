/// <reference types="node" />
export declare class Assets {
    static assetCount: number;
    static loadingAssetUrls: any[];
    static onProgressFns: ((loaded: number, total: number) => void)[];
    static onLoadFns: (() => void)[];
    static loadedAssets: {};
    /**
     * Returns the appropriate URL for an asset and also schedules it for preloading.
     */
    static getAssetUrl(asset: string): string;
    static onAssetProgress(progressFn: (loaded: number, total: number) => void): void;
    static onAllAssetsLoaded(loadFn: () => void): void;
    static checkAssetsLoaded(timer: NodeJS.Timeout): void;
}
