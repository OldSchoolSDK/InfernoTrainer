import { Settings } from "./Settings";

const MAX_QUEUED_ACTIONS = 8;

/**
 * Controller to manage delayed inputs (due to input lag and/or tick timers)
 */
export class InputController {
  inputDelay?: ReturnType<typeof setTimeout> = null;

  queuedActions: (() => void)[] = [];

  static controller = new InputController();

  queueAction(fn: () => void) {
    /*if (this.inputDelay) {
      clearTimeout(this.inputDelay);
    }*/
    if (this.queuedActions.length >= MAX_QUEUED_ACTIONS) {
      return;
    }
    this.inputDelay = setTimeout(() => {
      this.queuedActions.push(fn);
    }, Settings.inputDelay);
  }

  onWorldTick() {
    const actions = this.flushQueuedActions();
    actions.forEach((action) => action());
  }

  private flushQueuedActions() {
    const actions = this.queuedActions;
    this.queuedActions = [];
    return actions;
  }
}
