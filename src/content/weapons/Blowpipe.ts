"use strict";

import BPInventImage from "../../assets/images/weapons/blowpipe.png";
import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { ItemName } from "../../sdk/ItemName";
import { Unit } from "../../sdk/Unit";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { Projectile, ProjectileOptions } from "../../sdk/weapons/Projectile";

import BPAttackSound from "../../assets/sounds/dart_2696.ogg";
import BPSpecSound from "../../assets/sounds/snake_hit_800.ogg";
import { Sound, SoundCache } from "../../sdk/utils/SoundCache";

import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";
import { Assets } from "../../sdk/utils/Assets";

export class Blowpipe extends RangedWeapon {
  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 30,
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
        rangedStrength: 20 + 35, // simulating dragon darts atm
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

  calculateHitDelay(distance: number) {
    return Math.floor(distance / 6) + 1;
  }

  attackStyles() {
    return [AttackStyle.ACCURATE, AttackStyle.RAPID, AttackStyle.LONGRANGE];
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.THROWN;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.RAPID;
  }

  get attackRange() {
    if (this.attackStyle() === AttackStyle.LONGRANGE) {
      return 7;
    }
    return 5;
  }

  get attackSpeed() {
    if (this.attackStyle() === AttackStyle.LONGRANGE) {
      return 3;
    }
    return 2;
  }

  get weight(): number {
    return 0.5;
  }

  specialAttack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    super.specialAttack(from, to, bonuses, options);
    bonuses.isSpecialAttack = true;
    // BP special attack takes an extra tick to land
    options.reduceDelay = -1;
    super.attack(from, to, bonuses);

    const healAttackerBy = Math.floor(this.damageRoll / 2);
    from.currentStats.hitpoint += healAttackerBy;
    from.currentStats.hitpoint = Math.min(from.currentStats.hitpoint, from.stats.hitpoint);
  }

  _damageMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses) {
    if (bonuses.isSpecialAttack) {
      return 1.5;
    }
    return 1;
  }
  _accuracyMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses) {
    if (bonuses.isSpecialAttack) {
      return 2;
    }
    return 1;
  }

  get itemName(): ItemName {
    return ItemName.TOXIC_BLOWPIPE;
  }

  get isTwoHander(): boolean {
    return true;
  }

  hasSpecialAttack(): boolean {
    return true;
  }
  get inventoryImage() {
    return BPInventImage;
  }

  get attackSound() {
    return new Sound(BPAttackSound, 0.1);
  }

  get specialAttackSound() {
    return new Sound(BPSpecSound, 0.5);
  }

  registerProjectile(from: Unit, to: Unit) {
    to.addProjectile(
      new Projectile(this, this.damage, from, to, "range", {
        visualDelayTicks: 1,
        sound: this.attackSound,
      }),
    );
  }

  Model = Assets.getAssetUrl("models/player_toxic_blowpipe.glb");
  override get model() {
    return this.Model;
  }

  get attackAnimationId() {
    return PlayerAnimationIndices.FireBlowpipe;
  }
}
