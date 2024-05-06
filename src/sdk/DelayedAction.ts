import { remove } from "lodash";

export class DelayedAction {
  // actions to be played after npc action (before players)
  static delayedNpcActions: DelayedAction[] = [];
  // actions to be played after player action
  static delayedActions: DelayedAction[] = [];
  action: () => void;
  delay: number;
  identifier: number;
  constructor(action: () => void, delay: number) {
    this.action = action;
    this.delay = delay + 1;
    this.identifier = Math.random() * 1000000;
  }

  static reset() {
    this.delayedActions = [];
    this.delayedNpcActions = [];
  }

  /**
   * Register a delayed action to be called in the middle of a tick (after npc actions, before player actions).
   * Use this if you need an action that reads from an NPC and writes to a player in the same tick.
   */
  static registerDelayedNpcAction(delayedAction: DelayedAction): number {
    DelayedAction.delayedNpcActions.push(delayedAction);
    return delayedAction.identifier;
  }

  /**
   * Register a delayed action to be called at the end of the tick (after player action)
   */
  static registerDelayedAction(delayedAction: DelayedAction): number {
    DelayedAction.delayedActions.push(delayedAction);
    return delayedAction.identifier;
  }

  static afterNpcTick() {
    const executedActions: DelayedAction[] = [];
    DelayedAction.delayedNpcActions.forEach((delayedAction) => {
      delayedAction.delay--;
      if (delayedAction.delay === 0) {
        delayedAction.action();
        executedActions.push(delayedAction);
      }
    });

    executedActions.forEach((executedActions: DelayedAction) => {
      remove(DelayedAction.delayedNpcActions, executedActions);
    });
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
