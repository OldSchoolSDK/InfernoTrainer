
'use strict'

import { MeleeWeapon } from '../../../../sdk/weapons/MeleeWeapon'
import { Mob } from '../../../../sdk/Mob'
import HurKotImage from '../../assets/images/Yt-HurKot.png'
import { Location } from "../../../../sdk/Location"
import { Unit, UnitBonuses, UnitOptions } from '../../../../sdk/Unit'
import { Weapon, AttackBonuses } from '../../../../sdk/gear/Weapon'
import { World } from '../../../../sdk/World'
import { ProjectileOptions } from '../../../../sdk/weapons/Projectile'
import { EntityName } from "../../../../sdk/EntityName"

class HealWeapon extends Weapon {

  static isMeleeAttackStyle (style: string) {
    return true;
  }

  attack(world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions) {
    this.damage = -Math.floor(Math.random() * 20);
    this.registerProjectile(from, to, bonuses, options)
  }
}


export class YtHurKot extends Mob {

  myJad: Unit;

  constructor (world: World, location: Location, options: UnitOptions) {
    super(world, location, options)
    this.myJad = this.aggro as Unit;

  }
  mobName(): EntityName { 
    return EntityName.YT_HUR_KOT;
  }

  attackStep() {
    super.attackStep();

    if (this.myJad.isDying()) {
      this.dead();
    }

  }
  get combatLevel () {
    return 141
  }

  get combatLevelColor () {
    return 'red'
  }
  
  setStats () {
    this.stunned = 1

    this.weapons = {
      heal: new HealWeapon(),
      crush: new MeleeWeapon(),
    }


    // non boosted numbers
    this.stats = {
      attack: 165,
      strength: 125,
      defence: 100,
      range: 150,
      magic: 150,
      hitpoint: 90
    }

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))
  }


  get bonuses(): UnitBonuses{ 
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 100,
        range: 80
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 130,
        range: 130
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      }
    };
  }
  get cooldown () {
    return 4
  }

  attackStyleForNewAttack () {
    return this.aggro === this.world.player ? 'crush' : 'heal';
  }


  get attackRange () {
    return 1
  }

  get size () {
    return 1
  }

  get image () {
    return HurKotImage
  }

  get sound () {
    return null
  }

  get color () {
    return '#ACFF5633'
  }

  attackAnimation (tickPercent: number) {
    this.world.region.context.transform(
      1, 
      0, 
      Math.sin(-tickPercent * Math.PI * 2) / 2, 
      1, 
      0, 
      0
    )
  }


}
