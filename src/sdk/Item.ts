import { Location } from "./Location";
import { ItemName } from "./ItemName";
import { Player } from "./Player";
import { World } from "./World";
import { Region } from "./Region";
import { Viewport } from "./Viewport";

export class Item {
  
  groundLocation: Location;
  inventorySprite: HTMLImageElement;
  selected: boolean;
  defaultAction = 'Use';
  _serialNumber: string;

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
    // Override me
    player;
  }
  
  contextActions (region: Region) {
    
    // use
    // drop
    // examine
    const options = [
      {
        text: [
          { text: 'Drop ', fillStyle: 'white' }, { text: this.itemName, fillStyle: '#FF911F' },
        ],
        action: () => 
        {
          region.addGroundItem(this, Viewport.viewport.player.location.x, Viewport.viewport.player.location.y)
          this.consumeItem(Viewport.viewport.player);
        }
      },
      {
        text: [
          { text: 'Examine ', fillStyle: 'white' }, { text: this.itemName, fillStyle: '#FF911F' },
        ],
        action: () => {
          // TODO: Examine feature
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
            this.inventoryLeftClick(Viewport.viewport.player);
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