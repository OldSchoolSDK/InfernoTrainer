"use strict";

import { Mob } from "../../../../sdk/Mob";
import JalMejJakImage from "../../assets/images/Jal-MejJak.png";
import { Unit, UnitBonuses, UnitTypes } from "../../../../sdk/Unit";
import { Weapon, AttackBonuses } from "../../../../sdk/gear/Weapon";
import { DelayedAction } from "../../../../sdk/DelayedAction";
import { InfernoHealerSpark } from "../InfernoHealerSpark";
import { Projectile, ProjectileOptions } from "../../../../sdk/weapons/Projectile";
import { EntityName } from "../../../../sdk/EntityName";
import { Random } from "../../../../sdk/Random";

class HealWeapon extends Weapon {
  calculateHitDelay(distance: number) {
    return 3;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions): boolean {
    this.damage = -Math.floor(Random.get() * 25);
    this.registerProjectile(from, to, bonuses, options);
    return true;
  }
}

class AoeWeapon extends Weapon {
  calculateHitDelay(distance: number) {
    return 1;
  }

  attack(from: Unit, to: Unit): boolean {
    const playerLocation = from.aggro.location;
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        // make splat in 2 random spots and where the player is
        const limitedPlayerLocation = {
          x: Math.min(Math.max(from.location.x - 5, playerLocation.x), from.location.x + 5),
          y: playerLocation.y,
        };
        const spark1 = new InfernoHealerSpark(from.region, limitedPlayerLocation, from, to);
        from.region.addEntity(spark1);
        const spark2Location = {
          x: from.location.x + (Math.floor(Random.get() * 11) - 5),
          y: 16 + Math.floor(Random.get() * 5),
        };
        const spark2 = new InfernoHealerSpark(from.region, spark2Location, from, to);
        from.region.addEntity(spark2);

        const spark3Location = {
          x: from.location.x + (Math.floor(Random.get() * 11) - 5),
          y: 16 + Math.floor(Random.get() * 5),
        };
        const spark3 = new InfernoHealerSpark(from.region, spark3Location, from, to);
        from.region.addEntity(spark3);
      }, 3),
    );
    return true;
  }

  get isAreaAttack() {
    return true;
  }
}

export class JalMejJak extends Mob {
  playerPrayerScan?: string = null;

  mobName(): EntityName {
    return EntityName.JAL_MEJ_JAK;
  }

  get combatLevel() {
    return 250;
  }

  setHasLOS() {
    this.hasLOS = true;
  }

  setStats() {
    this.stunned = 1;

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

  get sound() {
    return null;
  }
  // attackAnimation (tickPercent: number) {
  //   this.region.context.scale(1 + Math.sin(tickPercent * Math.PI) / 4, 1 - Math.sin(tickPercent * Math.PI) / 4)
  // }

  // shouldShowAttackAnimation () {
  //   return this.attackCooldownTicks === this.cooldown && this.playerPrayerScan === null
  // }

  shouldChangeAggro(projectile: Projectile) {
    return this.aggro != projectile.from && this.autoRetaliate;
  }

  attackStyleForNewAttack() {
    return this.aggro.type === UnitTypes.PLAYER ? "aoe" : "heal";
  }

  canMove() {
    return false;
  }

  // attackIfPossible() {

  // }
}
