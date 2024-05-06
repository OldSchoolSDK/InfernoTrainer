/**
 * Controller to manage delayed inputs (due to input lag and/or tick timers)
 */
export declare class InputController {
    inputDelay?: ReturnType<typeof setTimeout>;
    queuedActions: (() => void)[];
    static controller: InputController;
    queueAction(fn: () => void): void;
    onWorldTick(): void;
    private flushQueuedActions;
}
