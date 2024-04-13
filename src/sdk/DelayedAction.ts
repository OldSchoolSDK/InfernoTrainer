import { remove } from "lodash";

export class DelayedAction {
  static delayedActions: DelayedAction[] = [];
  action: () => void;
  delay: number;
  identifier: number;
  constructor(action: () => void, delay: number) {
    this.action = action;
    this.delay = delay + 1;
    this.identifier = Math.random() * 1000000;
  }

  static registerDelayedAction(delayedAction: DelayedAction): number {
    DelayedAction.delayedActions.push(delayedAction);
    return delayedAction.identifier;
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
    });
  }
}
