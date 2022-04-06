import { CommandKwargs } from "./CommandQueue";
import { Item } from "./Item";
import { Player } from "./Player";
import { Settings } from "./Settings";
import { Unit } from "./Unit";

type OpcodeFunctionSignature = (target: Unit, kwargs: CommandKwargs) => void;
type OpcodeToCommandMap = Record<CommandOpCodes, OpcodeFunctionSignature>;

export enum CommandOpCodes {
  MOVEMENT = 0,
  ATTACK = 1,
  PICKUP_ITEM = 2,
  DROP_ITEM = 3,
  EXAMINE_ITEM = 4
}

export const opcodeLookupTable: OpcodeToCommandMap = {
  [CommandOpCodes.MOVEMENT]: (target: Unit, kwargs: CommandKwargs) => {
    const x = kwargs.x as number;
    const y = kwargs.y as number;
    // Ideally, some validation.
    const player = target as Player; // MOVEMENT can only come from players of course.
    player.moveTo(Math.floor(x / Settings.tileSize), Math.floor(y / Settings.tileSize))
  },
  [CommandOpCodes.ATTACK]: (attacker: Unit, kwargs: CommandKwargs) => {
    const target = kwargs.target as Unit;
    attacker.setAggro(target);
  },
  [CommandOpCodes.PICKUP_ITEM]: (target: Unit, kwargs: CommandKwargs) => {
    const item = kwargs.item as Item;
    const player = target as Player; // PICKUP_ITEM can only come from players of course.
    player.setSeekingItem(item);
  },
  [CommandOpCodes.DROP_ITEM]: (target: Unit, kwargs: CommandKwargs) => {
    //
  },
  [CommandOpCodes.EXAMINE_ITEM]: (target: Unit, kwargs: CommandKwargs) => {
    //
  },
};
