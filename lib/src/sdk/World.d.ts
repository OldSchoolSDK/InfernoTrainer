import { Region } from "./Region";
export declare class World {
    regions: Region[];
    globalTickCounter: number;
    isPaused: boolean;
    tickPercent: number;
    clientTickPercent: number;
    getReadyTimer: number;
    deltaTimeSincePause: number;
    deltaTimeSinceLastTick: number;
    lastMenuVisible: boolean;
    fpsInterval: number;
    then: number;
    startTime: number;
    frameCount: number;
    tickTimer: number;
    clientTickTimer: number;
    clientTickHandle: ReturnType<typeof setTimeout> | null;
    addRegion(region: Region): void;
    startTicking(): void;
    stopTicking(): void;
    doClientTick(): void;
    browserLoop(now: number): void;
    tickWorld(n?: number): any;
    tickClient(tickPercent: number): void;
    tickRegion(region: Region): void;
    clientTick(region: Region, tickPercent: number): void;
}
