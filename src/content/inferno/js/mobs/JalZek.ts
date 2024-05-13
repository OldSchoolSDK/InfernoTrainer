"use strict";

import { Assets, Mob, Projectile, MeleeWeapon, MagicWeapon, Sound, UnitBonuses, Collision, AttackIndicators, Random, Viewport, GLTFModel, EntityNames, Trainer } from "@supalosa/oldschool-trainer-sdk";

import { InfernoMobDeathStore } from "../InfernoMobDeathStore";
import { InfernoRegion } from "../InfernoRegion";

import MagerImage from "../../assets/images/mager.png";
import MagerSound from "../../assets/sounds/mage_ranger_598.ogg";

const HitSound = Assets.getAssetUrl("assets/sounds/dragon_hit_410.ogg");

export const MagerModel = Assets.getAssetUrl("models/7699_33000.glb");
export const MageProjectileModel = Assets.getAssetUrl("models/mage_projectile.glb");

export class JalZek extends Mob {
  shouldRespawnMobs: boolean;

  mobName() {
    return EntityNames.JAL_ZEK;
  }

  shouldChangeAggro(projectile: Projectile) {
    return this.aggro != projectile.from && this.autoRetaliate;
  }

  get combatLevel() {
    return 490;
  }

  dead() {
    super.dead();
    InfernoMobDeathStore.npcDied(this);
  }

  setStats() {
    const region = this.region as InfernoRegion;
    this.shouldRespawnMobs = region.wave >= 69;

    this.stunned = 1;

    this.weapons = {
      stab: new MeleeWeapon(),
      magic: new MagicWeapon({
        model: MageProjectileModel,
        modelScale: 1 / 128,
        visualDelayTicks: 2,
        visualHitEarlyTicks: -1, // hits after landing
        sound: new Sound(MagerSound, 0.1),
      }),
    };

    // non boosted numbers
    this.stats = {
      attack: 370,
      strength: 510,
      defence: 260,
      range: 510,
      magic: 300,
      hitpoint: 220,
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats));
  }

  get bonuses(): UnitBonuses {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 80,
        range: 0,
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
        rangedStrength: 0,
        magicDamage: 1.0,
        prayer: 0,
      },
    };
  }

  get attackSpeed() {
    return 4;
  }

  get attackRange() {
    return 15;
  }

  get size() {
    return 4;
  }

  get image() {
    return MagerImage;
  }

  hitSound(damaged) {
    return new Sound(HitSound, 0.1);
  }

  attackStyleForNewAttack() {
    return "magic";
  }

  canMeleeIfClose() {
    return "stab" as const;
  }

  magicMaxHit() {
    return 70;
  }

  get maxHit() {
    return 70;
  }

  attackAnimation(tickPercent: number, context) {
    context.rotate(tickPercent * Math.PI * 2);
  }

  respawnLocation(mobToResurrect: Mob) {
    for (let x = 15 + 11; x < 22 + 11; x++) {
      for (let y = 10 + 14; y < 23 + 14; y++) {
        if (!Collision.collidesWithAnyMobs(this.region, x, y, mobToResurrect.size)) {
          if (!Collision.collidesWithAnyEntities(this.region, x, y, mobToResurrect.size)) {
            return { x, y };
          }
        }
      }
    }

    return { x: 21, y: 22 };
  }

  attackIfPossible() {
    this.attackStyle = this.attackStyleForNewAttack();

    this.attackFeedback = AttackIndicators.NONE;

    this.hadLOS = this.hasLOS;
    this.setHasLOS();

    if (!this.aggro || this.canAttack() === false) {
      return;
    }

    const isUnderAggro = Collision.collisionMath(
      this.location.x,
      this.location.y,
      this.size,
      this.aggro.location.x,
      this.aggro.location.y,
      1,
    );

    if (!isUnderAggro && this.hasLOS && this.attackDelay <= 0) {
      if (Random.get() < 0.1 && !this.shouldRespawnMobs) {
        const mobToResurrect = InfernoMobDeathStore.selectMobToResurect(this.region);
        if (!mobToResurrect) {
          this.attack() && this.didAttack();
        } else {
          // Set to 50% health
          mobToResurrect.currentStats.hitpoint = Math.floor(mobToResurrect.stats.hitpoint / 2);
          mobToResurrect.dying = -1;
          mobToResurrect.attackDelay = mobToResurrect.attackSpeed;

          mobToResurrect.setLocation(this.respawnLocation(mobToResurrect));
          mobToResurrect.playAnimation(mobToResurrect.idlePoseId);
          mobToResurrect.cancelDeath();
          mobToResurrect.aggro = Trainer.player;

          mobToResurrect.perceivedLocation = mobToResurrect.location;
          this.region.addMob(mobToResurrect);
          // (15, 10) to  (21 , 22
          this.attackDelay = 8;
          this.playAnimation(3);
        }
      } else {
        this.attack() && this.didAttack();
      }
    }
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, MagerModel);
  }

  override get attackAnimationId() {
    return 2;
  }

  override get deathAnimationId() {
    return 5;
  }
}
