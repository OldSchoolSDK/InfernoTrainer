"use strict";

import InventoryImage from "../../assets/images/equipment/Ancient_staff.png";
import { MeleeWeapon } from "../../sdk/weapons/MeleeWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";

export class AncientStaff extends MeleeWeapon {
  constructor() {
    super();

    this.bonuses = {
      attack: {
        stab: 10,
        slash: -1,
        crush: 40,
        magic: 15,
        range: 0,
      },
      defence: {
        stab: 2,
        slash: 3,
        crush: 1,
        magic: 15,
        range: 0,
      },
      other: {
        meleeStrength: 50,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: -1,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  attackStyles() {
    return [AttackStyle.ACCURATE, AttackStyle.AGGRESSIVECRUSH, AttackStyle.DEFENSIVE];
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.STAFF;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.AGGRESSIVECRUSH;
  }

  get itemName(): ItemName {
    return ItemName.ANCIENT_STAFF;
  }

  get isTwoHander(): boolean {
    return false;
  }

  hasSpecialAttack(): boolean {
    return false;
  }

  get attackRange() {
    // TODO: Override with spell selection
    return 1;
  }

  get attackSpeed() {
    return 4;
  }

  get inventoryImage() {
    return InventoryImage;
  }
}
