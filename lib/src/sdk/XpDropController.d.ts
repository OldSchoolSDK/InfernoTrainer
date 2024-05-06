/// <reference types="node" />
import { XpDrop } from "./XpDrop";
interface SkillTypes {
    type: string;
    imgSrc: string;
    image?: HTMLImageElement;
}
interface Empty {
}
export declare class XpDropController {
    static controller: XpDropController;
    static outlineColor: string;
    static inlineColor: string;
    static fillColor: string;
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;
    drops: XpDrop[] | Empty[];
    lastDropSkill?: string;
    timeout: NodeJS.Timeout;
    static skills: SkillTypes[];
    constructor();
    startupTimeout(): void;
    registerXpDrop(drop: XpDrop): void;
    tick(): void;
    draw(destinationCanvas: CanvasRenderingContext2D, x: number, y: number, tickPercent: number): void;
}
export {};
