'use strict'

import { Mob } from '../../../../sdk/Mob'
import ZukImage from '../../assets/images/TzKal-Zuk.png'
import { Unit, UnitBonuses } from '../../../../sdk/Unit'
import { MagicWeapon } from '../../../../sdk/weapons/MagicWeapon'
import { World } from '../../../../sdk/World'
import { UnitOptions } from '../../../../sdk/Unit'
import { Location } from '../../../../sdk/GameObject'
import { ZukShield } from '../ZukShield'
import { find } from 'lodash'
import { Entity, EntityName } from '../../../../sdk/Entity'
import { Weapon } from '../../../../sdk/gear/Weapon'
import { ImageLoader } from '../../../../sdk/utils/ImageLoader'
import ZukAttackImage from '../../assets/images/zuk_attack.png';
import { Projectile } from '../../../../sdk/weapons/Projectile'
import { JalZek } from './JalZek'
import { JalXil } from './JalXil'

class ZukWeapon extends MagicWeapon {

  get image(): string {
    return ZukAttackImage; 
  }

  registerProjectile(from: Unit, to: Unit) {
    to.addProjectile(new Projectile(this, this.damage, from, to, 'range', { reduceDelay: 2 }))
  }

}

export class TzKalZuk extends Mob {

  shield: ZukShield;
  enraged: boolean = false;

  setTimer: number = 5;

  constructor (world: World, location: Location, options: UnitOptions) {
    super(world, location, options)
    this.attackCooldownTicks = 14;

    this.shield = find(world.mobs, (mob: Unit) => {
      return mob.mobName() === EntityName.INFERNO_SHIELD;
    }) as ZukShield;
  }
  

  attackIfPossible () {
    this.attackCooldownTicks--
    this.setTimer--;

    if (this.setTimer === 0) {
      this.setTimer = 150;

      const mager = new JalZek(this.world, { x: 20, y: 21}, {aggro: this.shield})
      this.world.addMob(mager);
      const ranger = new JalXil(this.world, { x: 29, y: 21}, {aggro: this.shield})
      this.world.addMob(ranger);
    }

    if (this.canAttack() && this.attackCooldownTicks <= 0) {
      this.attack()
    }
  }


  attack () {
    let shieldOrPlayer: Unit = this.shield;
    const shieldLocation = this.shield.location;

    if (this.world.player.location.x < this.shield.location.x - 1 || this.world.player.location.x >= this.shield.location.x + 4) {
      shieldOrPlayer = this.world.player;
    }
    if (this.world.player.location.y > 16){
      shieldOrPlayer = this.world.player;
    }
    this.weapons['typeless'].attack(this.world, this, shieldOrPlayer, { attackStyle: 'typeless', magicBaseSpellDamage: shieldOrPlayer === this.world.player ? this.magicMaxHit() : 0 });

    this.attackCooldownTicks = this.cooldown
  }


  get displayName () {
    return 'TzKal-Zuk'
  }

  get combatLevel () {
    return 1400
  }

  get combatLevelColor () {
    return 'red'
  }

  canMove() {
    return false;
  }

  magicMaxHit () {
    return 251
  }
  
  setStats () {
    this.stunned = 8

    this.weapons = {
      typeless: new ZukWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 350,
      strength: 600,
      defence: 260,
      range: 400,
      magic: 150,
      hitpoint: 1200
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
        magic: 550,
        range: 550
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 350,
        range: 100
      },
      other: {
        meleeStrength: 200,
        rangedStrength: 200,
        magicDamage: 4.5,
        prayer: 0
      }
    };
  }
  get cooldown () {
    if (this.enraged) {
      return 7;
    }
    return 10
  }

  get attackStyle () {
    return 'magic'
  }

  get attackRange () {
    return 1000
  }

  get size () {
    return 7
  }

  get image () {
    return ZukImage
  }

  get sound () {
    return null
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.transform(1, 0, Math.sin(-tickPercent * Math.PI * 2) / 2, 1, 0, 0)
  }
}
