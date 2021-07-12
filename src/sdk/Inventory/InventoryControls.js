import _ from "lodash";
import InventoryPanel from "../../assets/images/panels/inventory.png";
import InventoryTab from "../../assets/images/tabs/inventory.png";
import Pathing from "../Pathing";
import BaseControls from "./../ControlPanels/BaseControls";

import { TwistedBow } from "../../content/weapons/TwistedBow";
import { Blowpipe } from "../../content/weapons/Blowpipe";
import BrowserUtils from "../BrowserUtils";


export default class InventoryControls extends BaseControls{

  constructor() {
    super();

    InventoryControls.inventory[0] = new Blowpipe();

  }

  static inventory = new Array(28).fill(null);

  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return InventoryTab;
  }

  get keyBinding() {
    return BrowserUtils.getQueryVar("inv_key") || "4";
  }

  
  clickedPanel(stage, x, y){

    let itemX, itemY;
    const clickedItem = _.first(_.filter(InventoryControls.inventory, (inventoryItem, index) => {
      if (!inventoryItem){
        return;
      }
      const x2 = index % 4;
      const y2 = Math.floor(index / 4);
      inventoryItem.inventoryPosition = index;
      itemX = 16 + (x2) * 43;
      itemY = 16 + (y2 + 1) * 35;
      return Pathing.collisionMath(x, y, 1, itemX, itemY, 35);
    }));


    InventoryControls.inventory.forEach((inventoryItem) => inventoryItem && (inventoryItem.selected = false));

    if (clickedItem) {
      if (true) { // "Is this something with a left click action"
        const currentWeapon = stage.player.weapon;
        InventoryControls.inventory[clickedItem.inventoryPosition] = currentWeapon;
        stage.player.weapon = clickedItem;
        stage.player.seeking = null;
        stage.player.bonuses = clickedItem.bonuses; // temp code 
      }else{
        clickedItem.selected = true;
      }
    }
  }

  draw(ctx, x, y) {

    super.draw(ctx, x, y);

    InventoryControls.inventory.forEach((inventoryItem, index) => {

      const x2 = index % 4;
      const y2 = Math.floor(index / 4);
      
      const itemX = 21 + x + (x2) * 43;
      const itemY = 17 + y + (y2) * 35;

      if (inventoryItem != null) {
        ctx.drawImage(
          inventoryItem.inventorySprite,
          itemX,
          itemY,
          32,
          32
        )

        if (inventoryItem.selected) {

          ctx.beginPath();
          ctx.fillStyle = "#D1BB7773";
          ctx.arc(itemX + 15, itemY + 17,  16, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    });
    
  }
}
