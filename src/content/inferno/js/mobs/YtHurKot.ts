"use strict";

import { Weapon, Unit, AttackBonuses, ProjectileOptions, Random, Mob, Location, Region, UnitOptions, Projectile, MeleeWeapon, UnitBonuses, UnitTypes, EntityNames } from "@supalosa/oldschool-trainer-sdk";

import HurKotImage from "../../assets/images/Yt-HurKot.png";

class HealWeapon extends Weapon {
  calculateHitDelay(distance: number) {
    return 3;
  }
  static isMeleeAttackStyle(style: string) {
    return true;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions): boolean {
    this.damage = -Math.floor(Random.get() * 20);
    this.registerProjectile(from, to, bonuses, options);
    return true;
  }
}

export class YtHurKot extends Mob {
  myJad: Unit;

  constructor(region: Region, location: Location, options: UnitOptions) {
    super(region, location, options);
    this.myJad = this.aggro as Unit;
  }
  mobName() {
    return EntityNames.YT_HUR_KOT;
  }

  attackStep() {
    super.attackStep();

    if (this.myJad.isDying()) {
      this.dead();
    }
  }

  shouldChangeAggro(projectile: Projectile) {
    return this.aggro != projectile.from && this.autoRetaliate;
  }

  get combatLevel() {
    return 141;
  }

  setStats() {
    this.stunned = 1;

    this.weapons = {
      heal: new HealWeapon(),
      crush: new MeleeWeapon(),
    };

    // non boosted numbers
    this.stats = {
      attack: 165,
      strength: 125,
      defence: 100,
      range: 150,
      magic: 150,
      hitpoint: 90,
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
        magic: 100,
        range: 80,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 130,
        range: 130,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0,
      },
    };
  }
  get attackSpeed() {
    return 4;
  }

  attackStyleForNewAttack() {
    return this.aggro?.type === UnitTypes.PLAYER ? "crush" : "heal";
  }

  get attackRange() {
    return 1;
  }

  get size() {
    return 1;
  }

  get image() {
    return HurKotImage;
  }

  get color() {
    return "#ACFF5633";
  }

  attackAnimation(tickPercent: number, context) {
    context.transform(1, 0, Math.sin(-tickPercent * Math.PI * 2) / 2, 1, 0, 0);
  }
}
