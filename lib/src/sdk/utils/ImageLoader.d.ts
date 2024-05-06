/// <reference types="node" />
export declare class ImageLoader {
    static onLoadFns: (() => void)[];
    static pendingImages: number;
    static completedImages: number;
    static hasLoaded: boolean;
    static imageCache: {};
    static createImage(src: string): HTMLImageElement;
    static onAllImagesLoaded(loadFn: () => void): void;
    static checkImagesLoaded(timer: NodeJS.Timeout): void;
}
