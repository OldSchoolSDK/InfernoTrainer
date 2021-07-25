import { remove } from "lodash";

export class DelayedAction {
  static delayedActions: DelayedAction[] = [];
  action: () => void;
  delay: number;
  constructor(action: () => void, delay: number){
    this.action = action;
    this.delay = delay + 1;
  }

  static registerDelayedAction(delayedAction: DelayedAction) {
    DelayedAction.delayedActions.push(delayedAction);
  }

  static tick() {
    const executedActions: DelayedAction[] = [];
    DelayedAction.delayedActions.forEach((delayedAction) => {
      delayedAction.delay--;
      if (delayedAction.delay === 0) {
        delayedAction.action();
        executedActions.push(delayedAction);
      }
    });

    executedActions.forEach((executedActions: DelayedAction) => {
      remove(DelayedAction.delayedActions, executedActions);
    })
  }
}