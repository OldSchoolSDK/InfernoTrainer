"use strict";

import InventImage from "../../assets/images/equipment/Black_chinchompa.png";
import { RangedWeapon } from "../../sdk/weapons/RangedWeapon";
import { ItemName } from "../../sdk/ItemName";
import { AttackStyle, AttackStyleTypes } from "../../sdk/AttackStylesController";
import { Sound } from "../../sdk/utils/SoundCache";

import ChinThrowSound from "../../assets/sounds/thrown_axe_2706.ogg";
import ChinLandSound from "../../assets/sounds/chinchompa_explode_360.ogg";
import { ProjectileOptions } from "../../sdk/weapons/Projectile";
import { AttackBonuses } from "../../sdk/gear/Weapon";
import { Unit } from "../../sdk/Unit";
import { Pathing } from "../../sdk/Pathing";
import { Mob } from "../../sdk/Mob";
import { Assets } from "../../sdk/utils/Assets";
import { PlayerAnimationIndices } from "../../sdk/rendering/GLTFAnimationConstants";

export class BlackChinchompa extends RangedWeapon {
  maxConcurrentHits = 9;

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 80,
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
        rangedStrength: 30,
        magicDamage: 0,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  // same as toxic blowpipe and other thrown weapon
  calculateHitDelay(distance: number) {
    return Math.floor(distance / 6) + 1;
  }

  attackStyles() {
    return [AttackStyle.SHORT_FUSE, AttackStyle.MEDIUM_FUSE, AttackStyle.LONG_FUSE];
  }

  attackStyleCategory(): AttackStyleTypes {
    return AttackStyleTypes.CHINCHOMPA;
  }

  defaultStyle(): AttackStyle {
    return AttackStyle.MEDIUM_FUSE;
  }

  get attackSpeed() {
    if (this.attackStyle() === AttackStyle.RAPID) {
      return 3;
    }
    return 4;
  }

  get weight(): number {
    return 0;
  }

  get itemName(): ItemName {
    return ItemName.BLACK_CHINCHOMPA;
  }

  get isTwoHander(): boolean {
    return false;
  }

  get attackRange() {
    if (this.attackStyle() === AttackStyle.LONG_FUSE) {
      return 10;
    }
    return 9;
  }

  get inventoryImage() {
    return InventImage;
  }

  get attackSound() {
    return new Sound(ChinThrowSound, 0.1);
  }

  get attackLandingSound() {
    return new Sound(ChinLandSound, 0.1);
  }

  get aoe() {
    return [
      { x: 0, y: 0 },
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    if (this.aoe.length) {
      const alreadyCastedOn: Unit[] = [to];
      const initialResult = super.attack(from, to, bonuses, options);
      if (initialResult) {
        this.aoe.forEach((point) => {
          Pathing.mobsAtAoeOffset(from.region, to, point).forEach((mob: Mob) => {
            if (alreadyCastedOn.length > this.maxConcurrentHits) {
              return;
            }
            if (alreadyCastedOn.indexOf(mob) > -1) {
              return;
            }
            alreadyCastedOn.push(mob);
            // HACK: chin gets massive accuracy bonus if main roll hits
            from.bonuses.attack.range += 100000;
            super.attack(from, mob, bonuses, { ...options, hidden: true });
            from.bonuses.attack.range -= 100000;
          });
        });
      }
      return initialResult;
    } else {
      return super.attack(from, to, bonuses, options);
    }
  }

  Model = Assets.getAssetUrl("models/player_black_chinchompa.glb");
  override get model() {
    return this.Model;
  }

  get attackAnimationId() {
    return PlayerAnimationIndices.ThrowChinchompa;
  }
}
