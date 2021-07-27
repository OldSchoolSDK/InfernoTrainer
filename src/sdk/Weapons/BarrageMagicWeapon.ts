import { Mob } from '../Mob'
import { Pathing } from '../Pathing'
import { World } from '../World'
import { Unit } from '../Unit'
import { XpDrop } from '../XpDrop'
import { MagicWeapon } from './MagicWeapon'
import { ProjectileOptions } from './Projectile'
import { AttackBonuses } from './Weapon'

export class BarrageMagicWeapon extends MagicWeapon {
  get name () {
    return 'Ice Barrage'
  }

  get aoe () {
    return [
      { x: 0, y: 0 }, // always freeze middles first
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ]
  }
  get attackRange () {
    return 10
  }

  get attackSpeed () {
    return 5
  }

  get maxConcurrentHits () {
    return 9
  }

  cast (world: World, from: Unit, to: Unit) {
    // calculate AoE magic effects
    if (this.aoe.length) {
      const alreadyCastedOn: Unit[] = [ to ]
      this.attack(world, from, to, { magicBaseSpellDamage: 30 })
      this.aoe.forEach((point) => {
        Pathing.mobsInAreaOfEffectOfMob(world, to, point)
          .forEach((mob: Mob) => {
            if (alreadyCastedOn.length > this.maxConcurrentHits) {
              return
            }
            if (alreadyCastedOn.indexOf(mob) > -1) {
              return
            }
            alreadyCastedOn.push(mob)
            this.attack(world, from, mob, { magicBaseSpellDamage: 30 }, {hidden: true})
          })
      })
    } else {
      this.attack(world, from, to, { magicBaseSpellDamage: 30 })
    }
  }

  attack (world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    options.forceSWTile = true;
    super.attack(world, from, to, bonuses, options)    
    if (this.damage > 0) {
      to.frozen = 32
    }
  }
}
