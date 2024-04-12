"use strict";

import { Settings } from "../../../sdk/Settings";
import { Unit } from "../../../sdk/Unit";
import { Projectile, ProjectileOptions } from "../../../sdk/weapons/Projectile";
import { Location } from "../../../sdk/Location";
import { Entity } from "../../../sdk/Entity";
import { Collision, CollisionType } from "../../../sdk/Collision";
import { Weapon, AttackBonuses } from "../../../sdk/gear/Weapon";
import { LineOfSightMask } from "../../../sdk/LineOfSight";
import { Random } from "../../../sdk/Random";
import { Region } from "../../../sdk/Region";

class InfernoSparkWeapon extends Weapon {
  calculateHitDelay(distance: number) {
    return 1;
  }

  static isMeleeAttackStyle(style: string) {
    // fun way to make the attack instantaneous
    return true;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    this.damage = 5 + Math.floor(Random.get() * 6);
    to.addProjectile(new Projectile(this, this.damage, from, to, bonuses.attackStyle, options));
    return true;
  }
}

export class InfernoHealerSpark extends Entity {
  from: Unit;
  to: Unit;
  weapon: InfernoSparkWeapon = new InfernoSparkWeapon();

  hasSparked = false;

  constructor(region: Region, location: Location, from: Unit, to: Unit) {
    super(region, location);
    this.from = from;
    this.to = to;
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  tick() {
    if (this.dying === -1) {
      this.dying = 0;
    }
    if (
      !this.hasSparked &&
      Collision.collisionMath(this.location.x - 1, this.location.y + 1, 3, this.to.location.x, this.to.location.y, 1)
    ) {
      this.weapon.attack(this.from, this.from.aggro as Unit, {});
      this.hasSparked = true;
    }
  }

  draw() {
    this.region.context.fillStyle = "#FF0000";

    this.region.context.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize,
    );
  }

  get size() {
    return 1;
  }
}
