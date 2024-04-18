import { Settings } from "./Settings";

/**
 * Controller to manage delayed inputs (due to input lag and/or tick timers)
 */
export class InputController {
    inputDelay?: NodeJS.Timeout = null;

    static controller = new InputController();

    sendToServer(fn: () => void) {
        if (this.inputDelay) {
        clearTimeout(this.inputDelay);
        }
        this.inputDelay = setTimeout(fn, Settings.inputDelay);
    }
}