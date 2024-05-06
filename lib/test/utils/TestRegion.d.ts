import { Region } from "../../src/sdk/Region";
export declare class TestRegion extends Region {
    private _width;
    private _height;
    constructor(_width: number, _height: number);
    get width(): number;
    get height(): number;
    initialiseRegion(): any;
}
