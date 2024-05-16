"use strict";

import { Assets, ProjectileOptions, Weapon, Unit, AttackBonuses, Random, ArcProjectileMotionInterpolator, Projectile, DelayedAction, Mob, UnitBonuses, UnitTypes, Model, GLTFModel, EntityNames } from "@supalosa/oldschool-trainer-sdk";

import JalMejJakImage from "../../assets/images/Jal-MejJak.png";
import { InfernoHealerSpark } from "../InfernoHealerSpark";

const HealerModel = Assets.getAssetUrl("models/zuk_healer.glb");
const Spark = Assets.getAssetUrl("models/tekton_meteor.glb");

const HEAL_PROJECTILE_SETTINGS: ProjectileOptions = {
  model: Spark,
  modelScale: 1 / 128,
  setDelay: 3,
}
class HealWeapon extends Weapon {
  calculateHitDelay(distance: number) {
    return 3;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions): boolean {
    this.damage = -Math.floor(Random.get() * 25);
    this.registerProjectile(from, to, bonuses, HEAL_PROJECTILE_SETTINGS);
    return true;
  }
}

class InfernoSparkWeapon extends Weapon {
  // dummy weapon for the projectile (that this needs to exist means we need to fix the Projectile api)
}

const AOE_PROJECTILE_SETTINGS: ProjectileOptions = {
  model: Spark,
  modelScale: 1 / 128,
  motionInterpolator: new ArcProjectileMotionInterpolator(3),
  setDelay: 4,
  visualDelayTicks: 0,
}

class AoeWeapon extends Weapon {
  calculateHitDelay(distance: number) {
    return 1;
  }

  attack(from: Unit, to: Unit): boolean {
    const playerLocation = from.aggro.location;
    // make splat in 2 random spots and where the player is
    const limitedPlayerLocation = {
      x: Math.min(Math.max(from.location.x - 5, playerLocation.x), from.location.x + 4),
      y: playerLocation.y,
      z: 0,
    };
    const spark2Location = {
      x: from.location.x + (Math.floor(Random.get() * 11) - 5),
      y: 14 + Math.floor(Random.get() * 4),
      z: 0,
    };
    const spark3Location = {
      x: from.location.x + (Math.floor(Random.get() * 11) - 5),
      y: 14 + Math.floor(Random.get() * 4),
      z: 0,
    };
    from.region.addProjectile(new Projectile(new InfernoSparkWeapon(), 0, from, limitedPlayerLocation, "magic", AOE_PROJECTILE_SETTINGS))
    from.region.addProjectile(new Projectile(new InfernoSparkWeapon(), 0, from, spark2Location, "magic", AOE_PROJECTILE_SETTINGS))
    from.region.addProjectile(new Projectile(new InfernoSparkWeapon(), 0, from, spark3Location, "magic", AOE_PROJECTILE_SETTINGS))

    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        const spark1 = new InfernoHealerSpark(from.region, limitedPlayerLocation, from, to);
        from.region.addEntity(spark1);
        const spark2 = new InfernoHealerSpark(from.region, spark2Location, from, to);
        from.region.addEntity(spark2);
        const spark3 = new InfernoHealerSpark(from.region, spark3Location, from, to);
        from.region.addEntity(spark3);
      }, 2),
        );
    return true;
  }

  get isAreaAttack() {
    return true;
  }
}

const SPAWN_DELAY = 1;
export class JalMejJak extends Mob {
  private lastAggro: Unit = null;

  mobName() {
    return EntityNames.JAL_MEJ_JAK;
  }

  get combatLevel() {
    return 250;
  }

  setHasLOS() {
    this.hasLOS = true;
  }

  setStats() {
    this.stunned = SPAWN_DELAY;
    this.weapons = {
      heal: new HealWeapon(),
      aoe: new AoeWeapon(),
    };

    // non boosted numbers
    this.stats = {
      attack: 1,
      strength: 1,
      defence: 100,
      range: 1,
      magic: 1,
      hitpoint: 75,
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats));
  }

  override addedToWorld() {
    this.playAnimation(2);
  }

  get bonuses(): UnitBonuses {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 40,
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
    return 3;
  }

  get attackRange() {
    return 0;
  }

  get size() {
    return 1;
  }

  get image() {
    return JalMejJakImage;
  }

  shouldChangeAggro(projectile: Projectile) {
    return this.aggro != projectile.from && this.autoRetaliate;
  }

  attackStyleForNewAttack() {
    return this.aggro.type === UnitTypes.PLAYER ? "aoe" : "heal";
  }

  canMove() {
    return false;
  }

  create3dModel(): Model {
    return GLTFModel.forRenderable(this, HealerModel, { scale: 1 / 128, verticalOffset: 1.0 });
  }

  get outlineRenderOrder() {
    // to allow it to draw in front of the shield
    return 999;
  }

  get idlePoseId() {
    return 0;
  }

  get attackAnimationId() {
    return 1;
  }

  get deathAnimationId() {
    return 3;
  }
  
  override attackStep() {
    super.attackStep();
    if (this.lastAggro && this.lastAggro != this.aggro) {
      this.nulledTicks = 2;
    }
    this.lastAggro = this.aggro;
  }
}
