export interface Component {

    draw(context: CanvasRenderingContext2D, scale: number, panelX: number, panelY: number);

    /**
     * 
     * @param x scaled X relative to the top left of the panel
     * @param y scaled Y relative to the top left of the panel
     * @returns true if intercepted
     */
    onPanelClick(x: number, y: number): boolean;

    /**
     * 
     * @param x scaled X relative to the top left of the panel
     * @param y scaled Y relative to the top left of the panel
     * @returns true if intercepted
     */
    onMouseMove(x: number, y: number): boolean;
}