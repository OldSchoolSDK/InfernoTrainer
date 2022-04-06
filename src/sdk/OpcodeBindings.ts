import { CommandKwargs } from "./CommandQueue";
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
  [CommandOpCodes.MOVEMENT]: (target: Unit, kwargs: CommandKwargs) => {},
  [CommandOpCodes.ATTACK]: (target: Unit, kwargs: CommandKwargs) => {},
  [CommandOpCodes.PICKUP_ITEM]: (target: Unit, kwargs: CommandKwargs) => {},
  [CommandOpCodes.DROP_ITEM]: (target: Unit, kwargs: CommandKwargs) => {},
  [CommandOpCodes.EXAMINE_ITEM]: (target: Unit, kwargs: CommandKwargs) => {},
};
