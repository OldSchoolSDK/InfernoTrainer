"use strict";

import { Weapon, Unit, AttackBonuses, ProjectileOptions, Random, Projectile, Entity, Region, CollisionType, LineOfSightMask, Location } from "@supalosa/oldschool-trainer-sdk";

import { GroundSlamModel } from "../rendering/GroundSlamModel";

class SolGroundSlamWeapon extends Weapon {
  calculateHitDelay(distance: number) {
    return 1;
  }

  static isMeleeAttackStyle(style: string) {
    return true;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    // up to 45? not sure what min hit is
    this.damage = 20 + Math.floor(Random.get() * 25);
    to.addProjectile(new Projectile(this, this.damage, from, to, bonuses.attackStyle, options));
    return true;
  }
}

export class SolGroundSlam extends Entity {
  from: Unit;
  to: Unit;
  weapon = new SolGroundSlamWeapon();

  age = 0;

  constructor(
    region: Region,
    location: Location,
    from: Unit,
    to: Unit,
    // number from 0-1 to delay the visual effect in ticks
    private delay: number | null = 0,
    private creationTick: number
  ) {
    super(region, location);
    this.from = from;
    this.to = to;
  }

  create3dModel() {
    return GroundSlamModel.forGroundSlam(this, this.creationTick);
  }

  get color() {
    return "#583927";
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  shouldDestroy() {
    return this.dying === 0;
  }

  get drawOutline() {
    return false;
  }

  visible(tickPercent) {
    // makes the sparks appear to shoot forward
    return this.age + tickPercent >= 1 + this.delay / 3;
  }

  getScale(tickPercent) {
    return this.visible(tickPercent) ? 1 - Math.min(1, (this.age - 1 + tickPercent - (this.delay / 3)) / 3): 0;
  }

  // note: is only called on the first one, should NOT consider delay as the first one is on the top left
  getAlpha(tickPercent) {
    return 0.5 - Math.min(1, (this.age - 1 + tickPercent) / 3) * 0.5;
  }

  tick() {
    --this.dying; // wait what, why isn't this in entity?
    ++this.age;
    if (this.age == 1) {
      if (this.location.x === this.to.location.x && this.location.y === this.to.location.y) {
        this.weapon.attack(this.from, this.to as Unit, {});
      }
      this.dying = 2;
    }
  }

  get size() {
    return 1;
  }
}
