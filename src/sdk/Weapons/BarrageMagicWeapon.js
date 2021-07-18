import { Pathing } from '../Pathing'
import { Unit } from '../Unit'
import { XpDrop } from '../XpDrop'
import { MagicWeapon } from './MagicWeapon'

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

  cast (region, from, to) {
    // calculate AoE magic effects
    if (this.aoe.length) {
      let castsAllowed = this.maxConcurrentHits
      const alreadyCastedOn = []
      this.aoe.forEach((point) => {
        Pathing.mobsAroundMob(region, to, point)
          .forEach((mob) => {
            if (castsAllowed <= 0) {
              return
            }
            if (alreadyCastedOn.indexOf(mob) > -1) {
              return
            }
            alreadyCastedOn.push(mob)
            castsAllowed--
            this.attack(region, from, mob, { magicBaseSpellDamage: 30 })
          })
      })
    } else {
      this.attack(region, from, to, { magicBaseSpellDamage: 30 })
    }
  }

  attack (region, from, to, bonuses = {}) {
    super.attack(region, from, to, bonuses, true)    
    if (this.damage > 0) {
      to.frozen = 32
    }
  }
}
