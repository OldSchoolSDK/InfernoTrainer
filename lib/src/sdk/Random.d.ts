export declare class Random {
    static memory: number;
    static callCount: number;
    static randomFn: () => number;
    static setRandom(fn: () => number): void;
    static reset(): void;
    static get(): number;
}
