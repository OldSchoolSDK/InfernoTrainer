import { ClickController } from "./ClickController";
import { Player } from "./Player";

// container for globals to prevent circular dependencies
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
}