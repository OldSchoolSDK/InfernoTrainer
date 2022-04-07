import { BasePrayer } from "./BasePrayer";
import { CommandKwargs } from "./CommandQueue";
import { Item } from "./Item";
import { MapController } from "./MapController";
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
  ACTIVATE_QUICK_PRAYERS = 4,
  DISABLE_QUICK_PRAYERS = 5,
  TOGGLE_PRAYER = 6,
  INVENTORY_LEFT_CLICK = 7,
  INVENTORY_SWAP_ITEMS_POSITIONS = 8,
  INVENTORY_MOVE_ITEM = 9,

}

export const opcodeLookupTable: OpcodeToCommandMap = {
  [CommandOpCodes.MOVEMENT]: (target: Unit, kwargs: CommandKwargs) => {
    const x = kwargs.x as number;
    const y = kwargs.y as number;
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
    const player = target as Player;
    const item = kwargs.item as Item;
    target.region.addGroundItem(player, this, target.location.x, target.location.y)
    item.consumeItem(player);
  },
  [CommandOpCodes.ACTIVATE_QUICK_PRAYERS]: (target: Unit, kwargs: CommandKwargs) => {
    // 
    const player = target as Player;
    
    player.prayerController.prayers.forEach((prayer) => {
      prayer.deactivate();
      if (prayer.name === 'Protect from Magic'){
        prayer.activate(player);
      }
      if (prayer.name === 'Rigour'){
        prayer.activate(player);
      }
    });


  },
  [CommandOpCodes.DISABLE_QUICK_PRAYERS]: (target: Unit, kwargs: CommandKwargs) => {
    // 
    const player = target as Player;
    player.prayerController.activePrayers().forEach((prayer) => prayer.deactivate());


  },
  [CommandOpCodes.TOGGLE_PRAYER]: (target: Unit, kwargs: CommandKwargs) => {
    // 
    const player = target as Player;
    const prayer = kwargs.prayer as BasePrayer;
    prayer.toggle(player)

    
    // Deactivate any incompatible prayers
    const conflictingPrayers = {};
    player.prayerController.prayers.forEach((activePrayer) => {
      activePrayer.groups.forEach((group) => {
        if (!conflictingPrayers[group]){
          conflictingPrayers[group] = [];
        }
        conflictingPrayers[group].push(activePrayer);
      });
    })

    for (const feature in conflictingPrayers) {
      conflictingPrayers[feature].sort((p1: BasePrayer, p2: BasePrayer) => p2.lastActivated - p1.lastActivated);
      conflictingPrayers[feature].shift();
      conflictingPrayers[feature].forEach((prayer: BasePrayer) => {
        prayer.isActive = false;
      })
    }

    
  },
  [CommandOpCodes.INVENTORY_LEFT_CLICK]: (target: Unit, kwargs: CommandKwargs) => {
    // How to prevent multiple queued events from duplicating items? 
    const item = kwargs.item as Item;
    const player = target as Player;
    if (player.inventory.indexOf(item) !== -1) {
      item.inventoryLeftClick(player);
      // This really ought to be on the "client" side, i believe.
      MapController.controller.updateOrbsMask(null, null)
    }
  },
  [CommandOpCodes.INVENTORY_SWAP_ITEMS_POSITIONS]: (target: Unit, kwargs: CommandKwargs) => {
    
    const player = target as Player;
    const clickedItem = kwargs.item1 as Item;
    const clickedDownItem = kwargs.item2 as Item;
    
    const theItemWereReplacing = clickedItem;
    const theItemWereReplacingPosition = clickedItem.inventoryPosition(player);
    const thisPosition = clickedDownItem.inventoryPosition(player);
    player.inventory[theItemWereReplacingPosition] = clickedDownItem;
    player.inventory[thisPosition] = theItemWereReplacing;

  },
  [CommandOpCodes.INVENTORY_MOVE_ITEM]: (target: Unit, kwargs: CommandKwargs) => {
    
    const player = target as Player;
    const clickedDownItem = kwargs.item as Item;
    const itemsNewInventoryPosition = kwargs.newPosition as number;
    
    const thisPosition = clickedDownItem.inventoryPosition(player);
    player.inventory[itemsNewInventoryPosition] = clickedDownItem;
    player.inventory[thisPosition] = null;


  }

};
