import { Mob } from '../Mob'
import { Pathing } from '../Pathing'
import { World } from '../World'
import { Unit, UnitTypes } from '../Unit'
import { MagicWeapon } from './MagicWeapon'
import { ProjectileOptions } from './Projectile'
import { AttackBonuses } from '../gear/Weapon';
import { XpDrop } from '../XpDrop'

export class BarrageSpell extends MagicWeapon {
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
    from.grantXp(new XpDrop('magic', 52));
    // calculate AoE magic effects
    if (this.aoe.length) {
      const alreadyCastedOn: Unit[] = [ to ]
      this.attack(world, from, to, { magicBaseSpellDamage: 30, attackStyle: 'magic' })
      this.aoe.forEach((point) => {
        Pathing.mobsAtAoeOffset(world, to, point)
          .forEach((mob: Mob) => {
            if (alreadyCastedOn.length > this.maxConcurrentHits) {
              return
            }
            if (alreadyCastedOn.indexOf(mob) > -1) {
              return
            }
            alreadyCastedOn.push(mob)
            this.attack(world, from, mob, { magicBaseSpellDamage: 30, attackStyle: 'magic' }, {hidden: true})
          })
      })
    } else {
      this.attack(world, from, to, { magicBaseSpellDamage: 30, attackStyle: 'magic' })
    }
  }
  
  attack (world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}) {
    options.forceSWTile = true;
    super.attack(world, from, to, bonuses, options)
  }
}
