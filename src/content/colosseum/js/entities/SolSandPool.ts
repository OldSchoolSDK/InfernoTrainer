"use strict";

import {
  Entity,
  Region,
  CollisionType,
  LineOfSightMask,
  Viewport,
  ProjectileOptions,
  AttackBonuses,
  Projectile,
  Weapon,
  Unit,
  Random,
  Location,
  Trainer,
} from "@supalosa/oldschool-trainer-sdk";

import { SandPoolModel } from "../rendering/SandPoolModel";

class SolPoolBurnWeapon extends Weapon {
  calculateHitDelay(distance: number) {
    return 1;
  }

  static isMeleeAttackStyle(style: string) {
    return true;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    // up to 45? not sure what min hit is
    this.damage = 5 + Math.floor(Random.get() * 3);
    to.addProjectile(new Projectile(this, this.damage, from, to, bonuses.attackStyle, options));
    return true;
  }
}

export class SolSandPool extends Entity {
  weapon = new SolPoolBurnWeapon();

  age = 0;

  constructor(region: Region, location: Location) {
    super(region, location);
  }

  create3dModel() {
    return SandPoolModel.forSandPool(this);
  }

  opacity(tickPercent) {
    return this.age > 2 ? 1 : this.age + tickPercent / 2;
  }

  get color() {
    if (this.age < 5) {
      return "#FFFFFF";
    } else {
      return "#FFBB00";
    }
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  get drawOutline() {
    return true;
  }

  tick() {
    ++this.age;
    // sand pools can damage after 3 ticks
    const player = Trainer.player;
    if (player.dying >= 0) {
      return;
    }
    if (this.age >= 2 && player.location.x === this.location.x && player.location.y === this.location.y) {
      const damage = 5 + Math.floor(Random.get() * 5);
      player.addProjectile(new Projectile(null, damage, player, player, "typeless", { setDelay: 0 }));
    }
  }

  get size() {
    return 1;
  }
}
