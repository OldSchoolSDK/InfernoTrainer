"use strict";

import BPInventImage from "../../assets/images/equipment/Kodai_wand.png";
import { MeleeWeapon } from "../../sdk/weapons/MeleeWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { BarrageSpell } from "../../sdk/weapons/BarrageSpell";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { Unit } from "../../sdk/Unit";
import { Player } from "../../sdk/Player";
import { BloodBarrageSpell } from "../../sdk/weapons/BloodBarrageSpell";

export class KodaiWand extends MeleeWeapon {
  autocastSpell: BarrageSpell = new BloodBarrageSpell();

  constructor() {
    super();

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 28,
        range: 0,
      },
      defence: {
        stab: 0,
        slash: 3,
        crush: 3,
        magic: 20,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0.15,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}): boolean {
    if (this.attackStyle() === AttackStyle.AUTOCAST) {
      if (from.isPlayer) {
        const player: Player = from as Player;
        if (player.autocastDelay === 0) {
          this.autocastSpell.cast(from, to);
          return true;
        }
        if (player.autocastDelay > 0) {
          player.autocastDelay--;
        }
        return false;
      }
    }

    return super.attack(from, to, bonuses);
  }

  attackStyles() {
    return [AttackStyle.ACCURATE, AttackStyle.AGGRESSIVECRUSH, AttackStyle.DEFENSIVE, AttackStyle.AUTOCAST];
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.STAFF;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.AUTOCAST;
  }

  get weight(): number {
    return 0.198;
  }

  get itemName(): ItemName {
    return ItemName.KODAI_WAND;
  }

  get isTwoHander(): boolean {
    return false;
  }

  hasSpecialAttack(): boolean {
    return false;
  }

  get attackRange() {
    if (this.attackStyle() === AttackStyle.AUTOCAST) {
      return 10;
    }
    return 1;
  }

  get attackSpeed() {
    if (this.attackStyle() === AttackStyle.AUTOCAST) {
      return 5;
    }
    return 4;
  }

  get inventoryImage() {
    return BPInventImage;
  }
}
