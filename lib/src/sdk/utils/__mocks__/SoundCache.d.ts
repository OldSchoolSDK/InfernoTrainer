export declare class Sound {
    src: any;
    volume: number;
    constructor(src: any, volume?: number);
}
export declare class SoundCache {
    static preload(): void;
    static play(): void;
}
