export declare class DelayedAction {
    static delayedNpcActions: DelayedAction[];
    static delayedActions: DelayedAction[];
    action: () => void;
    delay: number;
    identifier: number;
    constructor(action: () => void, delay: number);
    static reset(): void;
    /**
     * Register a delayed action to be called in the middle of a tick (after npc actions, before player actions).
     * Use this if you need an action that reads from an NPC and writes to a player in the same tick.
     */
    static registerDelayedNpcAction(delayedAction: DelayedAction): number;
    /**
     * Register a delayed action to be called at the end of the tick (after player action)
     */
    static registerDelayedAction(delayedAction: DelayedAction): number;
    static afterNpcTick(): void;
    static tick(): void;
}
