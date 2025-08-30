"use strict";

import { Assets, Weapon, Unit, AttackBonuses, ProjectileOptions, Random, Projectile, Entity, Region, GLTFModel, Location, CollisionType, LineOfSightMask, Pathing, Viewport, SoundCache, Sound, Collision, Settings, Trainer } from "@supalosa/oldschool-trainer-sdk";

import FireWaveHit from "../assets/sounds/firewave_hit_163.ogg";

const Splat = Assets.getAssetUrl("models/tekton_meteor_splat.glb");

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

  age = 0;

  constructor(region: Region, location: Location, from: Unit, to: Unit) {
    super(region, location);
    this.from = from;
    this.to = to;
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, Splat, { verticalOffset: -1 });
  }

  get animationIndex() {
    return 0;
  }

  get color() {
    return "#FFFF00";
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

  visible() {
    return this.dying < 0 && this.age >= 1;
  }

  tick() {
    ++this.age;
    if (this.age == 1) {
      let attemptedVolume =
        1 /
        Pathing.dist(
          Trainer.player.location.x,
          Trainer.player.location.y,
          this.location.x,
          this.location.y,
        );
      attemptedVolume = Math.min(1, Math.max(0, Math.sqrt(attemptedVolume)));
      SoundCache.play(new Sound(FireWaveHit, 0.025 * attemptedVolume), true);
      if (
        Collision.collisionMath(this.location.x - 1, this.location.y + 1, 3, this.to.location.x, this.to.location.y, 1)
      ) {
        this.weapon.attack(this.from, this.to as Unit, {});
      }
    } else if (this.age == 3) {
      this.playAnimation(0).then(() => {
        this.dying = 0;
      })
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
