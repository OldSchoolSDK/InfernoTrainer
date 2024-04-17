"use strict";

import TbowInventImage from "../../assets/images/weapons/twistedBow.png";
import { Unit } from "../../sdk/Unit";
import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { AttackBonuses } from "../../sdk/gear/Weapon";

import TwistedBowAttackSound from "../../assets/sounds/shortbow_2702.ogg";
import { Sound, SoundCache } from "../../sdk/utils/SoundCache";

import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
import { Assets } from "../../sdk/utils/Assets";

export class TwistedBow extends RangedWeapon {
  constructor(geno = false) {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: geno ? 10000 : 70,
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
        rangedStrength: geno ? 80 : 20,
        magicDamage: 0,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
    SoundCache.preload(this.attackSound.src);
  }

  compatibleAmmo(): ItemName[] {
    return [ItemName.DRAGON_ARROWS];
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

  get attackSpeed() {
    if (this.attackStyle() === AttackStyle.LONGRANGE) {
      return 6;
    }
    return 5;
  }

  get attackSound() {
    return new Sound(TwistedBowAttackSound, 0.1);
  }

  get weight(): number {
    return 1.814;
  }

  get itemName(): ItemName {
    return ItemName.TWISTED_BOW;
  }

  get isTwoHander(): boolean {
    return true;
  }

  get attackRange() {
    return 10;
  }

  get inventoryImage() {
    return TbowInventImage;
  }

  _accuracyMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses) {
    const magic = Math.min(Math.max(to.currentStats.magic, to.bonuses.attack.magic), 250);
    const multiplier = (140 + ((10 * 3 * magic) / 10 - 10) / 100 - Math.pow((3 * magic) / 10 - 100, 2) / 100) / 100;
    return Math.min(1.4, Math.max(0, multiplier));
  }

  _damageMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses) {
    const magic = Math.min(Math.max(to.currentStats.magic, to.bonuses.attack.magic), 250);
    const multiplier = (250 + ((10 * 3 * magic) / 10 - 14) / 100 - Math.pow((3 * magic) / 10 - 140, 2) / 100) / 100;
    return Math.min(2.5, Math.max(0, multiplier));
  }

  Model = Assets.getAssetUrl("models/player_twisted_bow.glb");
  override get model() {
    return this.Model;
  }

  get attackAnimationId() {
    return PlayerAnimationIndices.FireBow;
  }
}
