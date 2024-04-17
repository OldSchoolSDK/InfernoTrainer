"use strict";

import InventImage from "../../assets/images/equipment/Bow_of_faerdhinen.png";
import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { ItemName } from "../../sdk/ItemName";
import { Unit } from "../../sdk/Unit";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
import { Assets } from "../../sdk/utils/Assets";
import { Sound } from "../../sdk/utils/SoundCache";

import BofaAttackSound from "../../assets/sounds/crystal_bow_1352.ogg";


export class BowOfFaerdhinen extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 128,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 106, // TODO: This will stack with dragon arrows if both equipped
        magicDamage: 0,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  attackStyles() {
    return [AttackStyle.ACCURATE, AttackStyle.RAPID, AttackStyle.LONGRANGE];
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.BOW;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.RAPID;
  }


  get attackSound() {
    return new Sound(BofaAttackSound, 0.1);
  }

  get attackSpeed() {
    if (this.attackStyle() === AttackStyle.LONGRANGE) {
      return 5;
    }
    return 4;
  }

  get weight(): number {
    return 1.5;
  }

  get itemName(): ItemName {
    return ItemName.BOWFA;
  }

  get isTwoHander(): boolean {
    return true;
  }

  get attackRange() {
    return 10;
  }

  get inventoryImage() {
    return InventImage;
  }

  _accuracyMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return from.bonuses.other.crystalAccuracy || 1;
  }

  _damageMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return from.bonuses.other.crystalDamage || 1;
  }
  
  Model = Assets.getAssetUrl("models/player_bow_of_faerdhinen.glb");
  override get model() {
    return this.Model;
  }

  get attackAnimationId() {
    return PlayerAnimationIndices.FireBow;
  }
}
