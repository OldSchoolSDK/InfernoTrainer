import _, { filter, find } from "lodash";
import { Unit } from "./Unit";
import { CommandOpCodes, opcodeLookupTable } from "./OpcodeBindings";


export enum CommandStrength {
  WEAK = 0,
  NORMAL = 1,
  STRONG = 1,
}

export interface CommandKwargs {
  [keyword: string]: string | number
}

export class QueueableCommand {
  opcode: CommandOpCodes;
  delay: number = 0;
  strength: CommandStrength
  kwargs: CommandKwargs

  static create(opcode: CommandOpCodes, strength: CommandStrength, delay: number = 0, kwargs: CommandKwargs = {}) {
    const queueableCommand = new QueueableCommand();
    queueableCommand.opcode = opcode;
    queueableCommand.delay = delay;
    queueableCommand.strength = strength;
    queueableCommand.kwargs = kwargs;
    return queueableCommand;
  }

  evaluate(target: Unit): void {
    opcodeLookupTable[this.opcode](target, this.kwargs || {});
  }
}

export class CommandQueue {
  queue: QueueableCommand[] = [];
  owner: Unit;

  constructor(owner: Unit) {
    this.owner = owner;
  }

  addCommand(command: QueueableCommand) {
    this.queue.push(command);
    this._overpowerWeakCommands();
  }

  evaluateQueue() {
    this._overpowerWeakCommands();
    for (let command of filter(this.queue, (cmd: QueueableCommand) => cmd.delay === 0).slice(0, 10)) {
      command.evaluate(this.owner)
    }
    for (let command of this.queue) {
      command.delay--;
    }
    this.queue = filter(this.queue, (command: QueueableCommand) => command.delay === 0);
  }

  clearQueue() {
    this.queue = [];
  }

  _overpowerWeakCommands() {
    if (find(this.queue, (command: QueueableCommand) => command.strength === CommandStrength.STRONG)) {
      this.queue = filter(this.queue, (command: QueueableCommand) => command.strength !== CommandStrength.WEAK);
    }
  }

}