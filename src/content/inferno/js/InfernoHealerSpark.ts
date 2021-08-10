
'use strict'
import { filter, remove } from 'lodash'
import { Settings } from '../../../sdk/Settings'

import { World } from '../../../sdk/World'
import { Unit, UnitBonuses, UnitStats } from '../../../sdk/Unit'
import { Projectile, ProjectileOptions } from '../../../sdk/weapons/Projectile'
import { Location } from "../../../sdk/Location"



import { Entity } from "../../../sdk/Entity";
import { Collision, CollisionType } from '../../../sdk/Collision'
import { Weapon, AttackBonuses } from '../../../sdk/gear/Weapon'
import { JalMejJak } from './mobs/JalMejJak'
import { LineOfSightMask } from '../../../sdk/LineOfSight'

class InfernoSparkWeapon extends Weapon{

  static isMeleeAttackStyle (style: string) {
    // fun way to make the attack instantaneous
    return true;
  }

  attack(world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    this.damage = 5 + Math.floor(Math.random() * 6);
    to.addProjectile(new Projectile(this, this.damage, from, to, bonuses.attackStyle, options))
  }
}

export class InfernoHealerSpark extends Entity {

  from: Unit;
  weapon: InfernoSparkWeapon = new InfernoSparkWeapon();

  hasSparked: boolean = false;

  constructor (world: World, location: Location, from: Unit) {
    super(world, location);
    this.from = from;
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  tick () {
    if (this.dying === -1) {
      this.dying = 0;
    }
    if (!this.hasSparked && Collision.collisionMath(this.location.x - 1, this.location.y + 1, 3, this.world.player.location.x, this.world.player.location.y, 1)){
      this.weapon.attack(this.world, this.from, this.world.player, {});
      this.hasSparked = true;
    }
  }

  draw () {
    this.world.worldCtx.fillStyle = '#FF0000'

    this.world.worldCtx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }

  get size() {
    return 1;
  }

}
