import { Player } from "../../src/sdk/Player";
import { Region } from "../../src/sdk/Region";

export class TestRegion extends Region {
    constructor(private _width: number, private _height: number) {
        super();
    }

    get width(): number {
      return this._width;
    }
  
    get height(): number {
      return this._height;
    }

    initialiseRegion() {
        return null;
    }
  }