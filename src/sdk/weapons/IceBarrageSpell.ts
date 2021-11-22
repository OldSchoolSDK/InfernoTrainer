import { World } from '../World'
import { Unit, UnitTypes } from '../Unit'
import { BarrageSpell } from './BarrageSpell'
import { ProjectileOptions } from './Projectile'
import { AttackBonuses } from '../gear/Weapon';
import { ItemName } from '../ItemName'

export class IceBarrageSpell extends BarrageSpell {

  get itemName(): ItemName {
    return ItemName.ICE_BARRAGE
  }
  
  attack (world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    super.attack(world, from, to, bonuses, options)    
    if (this.lastHitHit) {
      to.frozen = 32
    }
    return true;
  }
}
