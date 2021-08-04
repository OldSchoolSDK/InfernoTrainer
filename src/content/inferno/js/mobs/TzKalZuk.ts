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
import { AttackBonuses, Weapon } from '../../../../sdk/gear/Weapon'
import { ImageLoader } from '../../../../sdk/utils/ImageLoader'
import ZukAttackImage from '../../assets/images/zuk_attack.png';
import { Projectile, ProjectileOptions } from '../../../../sdk/weapons/Projectile'
import { JalZek } from './JalZek'
import { JalXil } from './JalXil'
import { JalMejJak } from './JalMejJak'
import { JalTokJad } from './JalTokJad'
import { Settings } from '../../../../sdk/Settings'

const zukWeaponImage = ImageLoader.createImage(ZukAttackImage)

class ZukWeapon extends MagicWeapon {

  get image(): HTMLImageElement {
    return zukWeaponImage; 
  }

  isBlockable (from: Unit, to: Unit, bonuses: AttackBonuses) {
    return false;
  }
  registerProjectile(from: Unit, to: Unit, bonuses: AttackBonuses, options: ProjectileOptions = {}) {
    to.addProjectile(new Projectile(this, this.damage, from, to, 'range', { reduceDelay: 2 }))
  }

}

export class TzKalZuk extends Mob {

  shield: ZukShield;
  enraged: boolean = false;

  setTimer: number = 72;
  timerPaused: boolean = false;
  hasPaused: boolean = false;

  constructor (world: World, location: Location, options: UnitOptions) {
    super(world, location, options)
    this.attackCooldownTicks = 14;

    // this.currentStats.hitpoint = 80;

    this.shield = find(world.mobs, (mob: Unit) => {
      return mob.mobName() === EntityName.INFERNO_SHIELD;
    }) as ZukShield;
  }
  

  mobName(): EntityName {
    return EntityName.TZ_KAL_ZUK;
  }

  attackIfPossible () {
    this.attackCooldownTicks--

    this.attackStyle = this.attackStyleForNewAttack()

    if (this.timerPaused === false) {
      this.setTimer--;

      if (this.setTimer === 0) {
        this.setTimer = 350;
  
        const mager = new JalZek(this.world, { x: 20, y: 21}, {aggro: this.shield, spawnDelay: 5})
        this.world.addMob(mager);
        const ranger = new JalXil(this.world, { x: 29, y: 21}, {aggro: this.shield, spawnDelay: 5})
        this.world.addMob(ranger);
      }  
    }

    if (this.canAttack() && this.attackCooldownTicks <= 0) {
      this.attack()
    }
  }
  damageTaken() {
    if (this.timerPaused === false) {
      if (this.currentStats.hitpoint < 600 && this.hasPaused === false) {
        this.timerPaused = true;
        this.hasPaused = true;
      }
    }else{
      if (this.currentStats.hitpoint < 480) {
        this.setTimer += 175;
        this.timerPaused = false;
        // Spawn Jad
        const jad = new JalTokJad(this.world, { x: 24, y: 25}, { aggro: this.shield, attackSpeed: 8, stun: 1, healers: 3, isZukWave: true });
        this.world.addMob(jad)
      }  
    }

    if (this.currentStats.hitpoint < 240 && this.enraged === false) {
      this.enraged = true;

      const healer1 = new JalMejJak(this.world, {x: 16, y: 9}, { aggro: this });
      this.world.addMob(healer1);

      const healer2 = new JalMejJak(this.world, {x: 20, y: 9}, { aggro: this });
      this.world.addMob(healer2);

      const healer3 = new JalMejJak(this.world, {x: 30, y: 9}, { aggro: this });
      this.world.addMob(healer3);

      const healer4 = new JalMejJak(this.world, {x: 34, y: 9}, { aggro: this });
      this.world.addMob(healer4);

    }

    if (this.currentStats.hitpoint <= 0){
      this.world.mobs.forEach((mob: Mob) => {
        if (mob !== this) {
          this.world.removeMob(mob);
        }
      })
  
    }
    
  }

  attack () {
    let shieldOrPlayer: Unit = this.shield;
    const shieldLocation = this.shield.location;

    if (this.world.player.location.x < this.shield.location.x || this.world.player.location.x >= this.shield.location.x + 5) {
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

  attackStyleForNewAttack () {
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


  drawOverTile(tickPercent: number) {
    super.drawOverTile(tickPercent);
    // Draw mob

    this.world.worldCtx.fillStyle = '#FFFF00'
    this.world.worldCtx.font = '16px OSRS'

    this.world.worldCtx.fillText(
      String(this.currentStats.hitpoint),
      0,
      0
    )
  }
}
