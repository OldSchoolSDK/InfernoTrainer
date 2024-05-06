interface ClickAnimationFrames {
    red: HTMLImageElement[];
    yellow: HTMLImageElement[];
}
export declare class ClickAnimation {
    color: string;
    x: number;
    y: number;
    ttl: number;
    constructor(color: string, x: number, y: number);
    static frames: ClickAnimationFrames;
    draw(): void;
}
export {};
