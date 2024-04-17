import EquipmentPanel from "../../assets/images/panels/equipment.png";
import EquipmentTab from "../../assets/images/tabs/equipment.png";
import { BaseControls } from "./BaseControls";
import UsedSpotBackground from "../../assets/images/interface/equipment_spot_used.png";
import { Settings } from "../Settings";
import { ControlPanelController } from "../ControlPanelController";
import { ImageLoader } from "../utils/ImageLoader";
import { Viewport } from "../Viewport";

export class EquipmentControls extends BaseControls {
  usedSpotBackground: HTMLImageElement = ImageLoader.createImage(UsedSpotBackground);

  get panelImageReference() {
    return EquipmentPanel;
  }

  get tabImageReference() {
    return EquipmentTab;
  }

  get keyBinding() {
    return Settings.equipment_key;
  }

  panelClickDown(x: number, y: number) {
    const scale = Settings.controlPanelScale;

    x = x / scale;
    y = y / scale;
    if (x > 84 && y > 11 && x < 84 + 36 && y < 11 + 36) {
      // helmet
      Viewport.viewport.player.equipment.helmet.unequip(Viewport.viewport.player);
    } else if (x > 43 && y > 50 && x < 43 + 36 && y < 50 + 36) {
      // cape
      Viewport.viewport.player.equipment.cape.unequip(Viewport.viewport.player);
    } else if (x > 84 && y > 50 && x < 84 + 36 && y < 50 + 36) {
      // necklace
      Viewport.viewport.player.equipment.necklace.unequip(Viewport.viewport.player);
    } else if (x > 124 && y > 50 && x < 124 + 36 && y < 50 + 36) {
      // ammo
      Viewport.viewport.player.equipment.ammo.unequip(Viewport.viewport.player);
    } else if (x > 28 && y > 89 && x < 28 + 36 && y < 89 + 36) {
      // weapon
      Viewport.viewport.player.equipment.weapon.unequip(Viewport.viewport.player);
    } else if (x > 84 && y > 89 && x < 84 + 36 && y < 89 + 36) {
      // chest
      Viewport.viewport.player.equipment.chest.unequip(Viewport.viewport.player);
    } else if (x > 140 && y > 89 && x < 140 + 36 && y < 89 + 36) {
      // offhand
      Viewport.viewport.player.equipment.offhand.unequip(Viewport.viewport.player);
    } else if (x > 84 && y > 129 && x < 84 + 36 && y < 129 + 36) {
      // legs
      Viewport.viewport.player.equipment.legs.unequip(Viewport.viewport.player);
    } else if (x > 28 && y > 169 && x < 28 + 36 && y < 169 + 36) {
      // gloves
      Viewport.viewport.player.equipment.gloves.unequip(Viewport.viewport.player);
    } else if (x > 84 && y > 169 && x < 84 + 36 && y < 169 + 36) {
      // feet
      Viewport.viewport.player.equipment.feet.unequip(Viewport.viewport.player);
    } else if (x > 140 && y > 169 && x < 140 + 36 && y < 169 + 36) {
      // ring
      Viewport.viewport.player.equipment.ring.unequip(Viewport.viewport.player);
    }
  }

  get isAvailable(): boolean {
    return true;
  }

  get appearsOnLeftInMobile(): boolean {
    return false;
  }

  draw(context, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(context, ctrl, x, y);
    const scale = Settings.controlPanelScale;

    if (Viewport.viewport.player.equipment.helmet) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 84 * scale,
        y + 11 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const helmetSprite = Viewport.viewport.player.equipment.helmet.inventorySprite;
      Viewport.viewport.context.drawImage(
        helmetSprite,
        x + (102 - Math.floor(helmetSprite.width / 2)) * scale,
        y + (29 - Math.floor(helmetSprite.height / 2)) * scale,
        helmetSprite.width * scale,
        helmetSprite.height * scale,
      );
    }
    if (Viewport.viewport.player.equipment.cape) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 43 * scale,
        y + 50 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const capeSprite = Viewport.viewport.player.equipment.cape.inventorySprite;
      Viewport.viewport.context.drawImage(
        capeSprite,
        x + (61 - Math.floor(capeSprite.width / 2)) * scale,
        y + (69 - Math.floor(capeSprite.height / 2)) * scale,
        capeSprite.width * scale,
        capeSprite.height * scale,
      );
    }
    if (Viewport.viewport.player.equipment.necklace) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 84 * scale,
        y + 50 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const necklaceSprite = Viewport.viewport.player.equipment.necklace.inventorySprite;
      Viewport.viewport.context.drawImage(
        necklaceSprite,
        x + (102 - Math.floor(necklaceSprite.width / 2)) * scale,
        y + (69 - Math.floor(necklaceSprite.height / 2)) * scale,
        necklaceSprite.width * scale,
        necklaceSprite.height * scale,
      );
    }
    if (Viewport.viewport.player.equipment.ammo) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 124 * scale,
        y + 50 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const ammoSprite = Viewport.viewport.player.equipment.ammo.inventorySprite;
      Viewport.viewport.context.drawImage(
        ammoSprite,
        x + (142 - Math.floor(ammoSprite.width / 2)) * scale,
        y + (69 - Math.floor(ammoSprite.height / 2)) * scale,
        ammoSprite.width * scale,
        ammoSprite.height * scale,
      );
    }
    if (Viewport.viewport.player.equipment.weapon) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 28 * scale,
        y + 89 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const weaponSprite = Viewport.viewport.player.equipment.weapon.inventorySprite;
      Viewport.viewport.context.drawImage(
        weaponSprite,
        x + (46 - Math.floor(weaponSprite.width / 2)) * scale,
        y + (107 - Math.floor(weaponSprite.height / 2)) * scale,
        weaponSprite.width * scale,
        weaponSprite.height * scale,
      );
    }
    if (Viewport.viewport.player.equipment.chest) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 84 * scale,
        y + 89 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const chestSprite = Viewport.viewport.player.equipment.chest.inventorySprite;
      Viewport.viewport.context.drawImage(
        chestSprite,
        x + (102 - Math.floor(chestSprite.width / 2)) * scale,
        y + (107 - Math.floor(chestSprite.height / 2)) * scale,
        chestSprite.width * scale,
        chestSprite.height * scale,
      );
    }
    if (Viewport.viewport.player.equipment.offhand) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 140 * scale,
        y + 89 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const offhandSprite = Viewport.viewport.player.equipment.offhand.inventorySprite;
      Viewport.viewport.context.drawImage(
        offhandSprite,
        x + (158 - Math.floor(offhandSprite.width / 2)) * scale,
        y + (107 - Math.floor(offhandSprite.height / 2)) * scale,
        offhandSprite.width * scale,
        offhandSprite.height * scale,
      );
    }
    if (Viewport.viewport.player.equipment.legs) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 84 * scale,
        y + 129 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const legsSprite = Viewport.viewport.player.equipment.legs.inventorySprite;
      Viewport.viewport.context.drawImage(
        legsSprite,
        x + (102 - Math.floor(legsSprite.width / 2)) * scale,
        y + (147 - Math.floor(legsSprite.height / 2)) * scale,
        legsSprite.width * scale,
        legsSprite.height * scale,
      );
    }
    if (Viewport.viewport.player.equipment.gloves) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 28 * scale,
        y + 169 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const glovesSprite = Viewport.viewport.player.equipment.gloves.inventorySprite;
      Viewport.viewport.context.drawImage(
        glovesSprite,
        x + (46 - Math.floor(glovesSprite.width / 2)) * scale,
        y + (186 - Math.floor(glovesSprite.height / 2)) * scale,
        glovesSprite.width * scale,
        glovesSprite.height * scale,
      );
    }

    if (Viewport.viewport.player.equipment.feet) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 84 * scale,
        y + 169 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const feetSprite = Viewport.viewport.player.equipment.feet.inventorySprite;
      Viewport.viewport.context.drawImage(
        feetSprite,
        x + (102 - Math.floor(feetSprite.width / 2)) * scale,
        y + (186 - Math.floor(feetSprite.height / 2)) * scale,
        feetSprite.width * scale,
        feetSprite.height * scale,
      );
    }

    if (Viewport.viewport.player.equipment.ring) {
      Viewport.viewport.context.drawImage(
        this.usedSpotBackground,
        x + 140 * scale,
        y + 169 * scale,
        this.usedSpotBackground.width * scale,
        this.usedSpotBackground.height * scale,
      );
      const ringSprite = Viewport.viewport.player.equipment.ring.inventorySprite;
      Viewport.viewport.context.drawImage(
        ringSprite,
        x + (158 - ringSprite.width / 2) * scale,
        y + (186 - ringSprite.height / 2) * scale,
        ringSprite.width * scale,
        ringSprite.height * scale,
      );
    }
  }
}
