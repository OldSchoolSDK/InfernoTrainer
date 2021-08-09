import { filter } from "lodash";
import { InventoryControls } from "./controlpanels/InventoryControls";
import { ItemName } from "./ItemName";
import { Player } from "./Player";
import { World } from "./World";

export class Item {
  
  inventorySprite: HTMLImageElement;
  selected: boolean;
  _serialNumber: string;
  defaultAction: string = 'Use';

  get serialNumber(): string {
    if (!this._serialNumber) {
      this._serialNumber = String(Math.random())
    }
    return this._serialNumber;
  }

  get hasInventoryLeftClick(): boolean {
    return false;
  }

  inventoryLeftClick(player: Player) {
    
  }
  
  contextActions (world: World) {
    // use
    // drop
    // examine
    let options = [
      {
        text: [
          { text: 'Drop ', fillStyle: 'white' }, { text: this.itemName, fillStyle: '#FF911F' },
        ],
        action: () => 
        {
          console.log('drop')
        }
      },
      {
        text: [
          { text: 'Examine ', fillStyle: 'white' }, { text: this.itemName, fillStyle: '#FF911F' },
        ],
        action: () => 
        {
          console.log('examine')
        }
      },
    ]

    if (this.defaultAction) {
      options.unshift(
        {
          text: [
            { text: this.defaultAction + ' ', fillStyle: 'white' }, { text: this.itemName, fillStyle: '#FF911F' },
          ],
          action: () => 
          {
            this.inventoryLeftClick(world.player);
          }
        }
      )
    }

    return options;
  }

  get itemName(): ItemName {
    return null
  }

  get weight(): number {
    return 0;
  }

  inventoryPosition(player: Player): number {
    return player.inventory.map((item: Item) => {
      if (!item) {
        return null;
      }
      return item.serialNumber;
    }).indexOf(this.serialNumber);
  }
  
  
  consumeItem(player: Player) {
    player.inventory[this.inventoryPosition(player)] = null;
  }

  get inventoryImage (): string {
    return ''
  }
}