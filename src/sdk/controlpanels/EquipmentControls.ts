import EquipmentPanel from "../../assets/images/panels/equipment.png";
import EquipmentTab from "../../assets/images/tabs/equipment.png";
import { BaseControls } from "./BaseControls";
import UsedSpotBackground from "../../assets/images/interface/equipment_spot_used.png";
import { Settings } from "../Settings";
import { ControlPanelController } from "../ControlPanelController";
import { ImageLoader } from "../utils/ImageLoader";
import { EQUIPMENT_TYPE_TO_SLOT, EquipmentTypes } from "../Equipment";
import { InputController } from "../Input";
import { Trainer } from "../Trainer";

export class EquipmentControls extends BaseControls {
  static instance: EquipmentControls | null = null;

  constructor() {
    super();
    EquipmentControls.instance = this;
  }

  usedSpotBackground: HTMLImageElement = ImageLoader.createImage(UsedSpotBackground);

  private DEFAULT_EQUIPMENT_INTERACTIONS = [(slot) => this.unequipItem(slot)];

  equipmentInteractions: ((slot: EquipmentTypes) => void)[] = [...this.DEFAULT_EQUIPMENT_INTERACTIONS];

  private clickedSlot: EquipmentTypes = null;

  resetEquipmentInteractions() {
    this.equipmentInteractions = [...this.DEFAULT_EQUIPMENT_INTERACTIONS];
  }

  addEquipmentInteraction(interaction: (slot: EquipmentTypes) => void) {
    this.equipmentInteractions.unshift(interaction);
  }

  get panelImageReference() {
    return EquipmentPanel;
  }

  get tabImageReference() {
    return EquipmentTab;
  }

  get keyBinding() {
    return Settings.equipment_key;
  }

  override panelClickDown(x: number, y: number) {
    const scale = Settings.controlPanelScale;
    x = x / scale;
    y = y / scale;
    let clicked: EquipmentTypes | null = null;

    if (x > 84 && y > 11 && x < 84 + 36 && y < 11 + 36) {
      // helmet
      clicked = EquipmentTypes.HELMET;
    } else if (x > 43 && y > 50 && x < 43 + 36 && y < 50 + 36) {
      // cape
      clicked = EquipmentTypes.BACK;
    } else if (x > 84 && y > 50 && x < 84 + 36 && y < 50 + 36) {
      // necklace
      clicked = EquipmentTypes.NECK;
    } else if (x > 124 && y > 50 && x < 124 + 36 && y < 50 + 36) {
      // ammo
      clicked = EquipmentTypes.AMMO;
    } else if (x > 28 && y > 89 && x < 28 + 36 && y < 89 + 36) {
      // weapon
      clicked = EquipmentTypes.WEAPON;
    } else if (x > 84 && y > 89 && x < 84 + 36 && y < 89 + 36) {
      // chest
      clicked = EquipmentTypes.CHEST;
    } else if (x > 140 && y > 89 && x < 140 + 36 && y < 89 + 36) {
      // offhand
      clicked = EquipmentTypes.OFFHAND;
    } else if (x > 84 && y > 129 && x < 84 + 36 && y < 129 + 36) {
      // legs
      clicked = EquipmentTypes.LEGS;
    } else if (x > 28 && y > 169 && x < 28 + 36 && y < 169 + 36) {
      // gloves
      clicked = EquipmentTypes.GLOVES;
    } else if (x > 84 && y > 169 && x < 84 + 36 && y < 169 + 36) {
      // feet
      clicked = EquipmentTypes.FEET;
    } else if (x > 140 && y > 169 && x < 140 + 36 && y < 169 + 36) {
      // ring
      clicked = EquipmentTypes.RING;
    }
    this.clickedSlot = clicked;
    if (clicked) {
      InputController.controller.queueAction(() => {
        this.equipmentInteractions[0](clicked);
      });
    }
  }

  override panelClickUp() {
    this.clickedSlot = null;
  }

  private unequipItem(clicked: EquipmentTypes) {
    const equipmentSlot = EQUIPMENT_TYPE_TO_SLOT[clicked];
    Trainer.player.equipment[equipmentSlot]?.unequip(Trainer.player);
  }

  get isAvailable(): boolean {
    return true;
  }

  get appearsOnLeftInMobile(): boolean {
    return false;
  }

  drawEquipment(
    context: OffscreenCanvasRenderingContext2D,
    x: number,
    y: number,
    slotX: number,
    slotY: number,
    scale: number,
    slot: EquipmentTypes,
  ) {
    const equipmentSlot = EQUIPMENT_TYPE_TO_SLOT[slot];
    if (Trainer.player.equipment[equipmentSlot]) {
      context.drawImage(
        this.usedSpotBackground,
        x + slotX * scale,
        y + slotY * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      if (this.clickedSlot === slot) {
        context.globalAlpha = 0.5;
      } else {
        context.globalAlpha = 1.0;
      }
      const sprite = Trainer.player.equipment[equipmentSlot].inventorySprite;
      context.drawImage(
        sprite,
        x + (slotX + 18 - Math.floor(sprite.width / 2)) * scale,
        y + (slotY + 18 - Math.floor(sprite.height / 2)) * scale,
        sprite.width * scale,
        sprite.height * scale,
      );
      context.globalAlpha = 1.0;
    }
  }

  draw(context, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(context, ctrl, x, y);
    const scale = Settings.controlPanelScale;

    this.drawEquipment(context, x, y, 84, 11, scale, EquipmentTypes.HELMET);
    this.drawEquipment(context, x, y, 43, 50, scale, EquipmentTypes.BACK);
    this.drawEquipment(context, x, y, 84, 50, scale, EquipmentTypes.NECK);
    this.drawEquipment(context, x, y, 124, 50, scale, EquipmentTypes.AMMO);
    this.drawEquipment(context, x, y, 28, 89, scale, EquipmentTypes.WEAPON);
    this.drawEquipment(context, x, y, 84, 89, scale, EquipmentTypes.CHEST);
    this.drawEquipment(context, x, y, 140, 89, scale, EquipmentTypes.OFFHAND);
    this.drawEquipment(context, x, y, 84, 129, scale, EquipmentTypes.LEGS);
    this.drawEquipment(context, x, y, 28, 169, scale, EquipmentTypes.GLOVES);
    this.drawEquipment(context, x, y, 84, 169, scale, EquipmentTypes.FEET);
    this.drawEquipment(context, x, y, 140, 169, scale, EquipmentTypes.RING);
  }
}
