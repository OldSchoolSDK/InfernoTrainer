//import { TileMarker } from "../content";
import { ClickController } from "./ClickController";
import { Player } from "./Player";
import { Viewport } from "./Viewport";

// container for globals to prevent circular dependencies. Do NOT import Viewport into this class.
export class Trainer {
    static _player: Player;
    static _clickController: ClickController;

    static setClickController(clickController: ClickController) {
        this._clickController = clickController;
    }

    static setPlayer(player: Player) {
        this._player = player;
    }

    static get player() {
        return this._player;
    }

    static get clickController() {
        return this._clickController;
    }

    static reset() {
        Trainer._player.region.reset();
    }
}