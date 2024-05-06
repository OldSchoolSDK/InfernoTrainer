import { Location } from "./Location";
export interface MultiColorTextBlock {
    text: string;
    fillStyle?: string;
    font?: string;
}
export interface MenuOption {
    text: MultiColorTextBlock[];
    action: () => void;
}
export declare class ContextMenu {
    isActive: boolean;
    location: Location;
    cursorPosition: Location;
    activatedPosition: Location;
    width: number;
    height: number;
    menuOptions: MenuOption[];
    linesOfText: MenuOption[];
    destinationLocation: Location;
    setPosition(position: Location): void;
    setActive(): void;
    setInactive(): void;
    setMenuOptions(menuOptions: MenuOption[]): void;
    cursorMovedTo(x: number, y: number): void;
    draw(): void;
    fillMixedText(ctx: CanvasRenderingContext2D, text: MultiColorTextBlock[], x: number, y: number, inputColor: string): void;
    fillMixedTextWidth(ctx: CanvasRenderingContext2D, text: MultiColorTextBlock[]): number;
    drawLineOfText(ctx: CanvasRenderingContext2D, text: MultiColorTextBlock[], width: number, y: number): void;
    clicked(x: number, y: number): void;
}
