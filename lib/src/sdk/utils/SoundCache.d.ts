export declare class Sound {
    src: any;
    volume: number;
    constructor(src: any, volume?: number);
}
export declare class SoundCache {
    static soundCache: {};
    static context: AudioContext;
    static cachedSounds: {
        [src: string]: AudioBuffer;
    };
    static getCachedSound(src: string): HTMLAudioElement;
    static preload(src: string): Promise<AudioBuffer>;
    static play({ src, volume }: Sound, isAreaSound?: boolean): any;
}
