'use strict'

import { Mob } from '../../../../sdk/Mob'
import ZukImage from '../../assets/images/TzKal-Zuk.png'
import { Unit, UnitBonuses, UnitTypes } from '../../../../sdk/Unit'
import { MagicWeapon } from '../../../../sdk/weapons/MagicWeapon'
import { UnitOptions } from '../../../../sdk/Unit'
import { Location } from "../../../../sdk/Location"
import { ZukShield } from '../ZukShield'
import { find } from 'lodash'
import { EntityName } from "../../../../sdk/EntityName"
import { ImageLoader } from '../../../../sdk/utils/ImageLoader'
import ZukAttackImage from '../../assets/images/zuk_attack.png';
import { Projectile } from '../../../../sdk/weapons/Projectile'
import { JalZek } from './JalZek'
import { JalXil } from './JalXil'
import { JalMejJak } from './JalMejJak'
import { JalTokJad } from './JalTokJad'
import { Viewport } from '../../../../sdk/Viewport'
import { Region } from '../../../../sdk/Region'
/* eslint-disable @typescript-eslint/no-explicit-any */

const zukWeaponImage = ImageLoader.createImage(ZukAttackImage)

class ZukWeapon extends MagicWeapon {

  get image(): HTMLImageElement {
    return zukWeaponImage; 
  }

  isBlockable () {
    return false;
  }
  registerProjectile(from: Unit, to: Unit) {
    to.addProjectile(new Projectile(this, this.damage, from, to, 'range', { reduceDelay: 2 }))
  }

}

export class TzKalZuk extends Mob {

  shield: ZukShield;
  enraged = false;

  setTimer = 72;
  timerPaused = false;
  hasPaused = false;

  constructor (region: Region, location: Location, options: UnitOptions) {
    super(region, location, options)
    this.attackCooldownTicks = 14;

    // this.currentStats.hitpoint = 80;

    this.shield = find(region.mobs.concat(region.newMobs), (mob: Unit) => {
      return mob.mobName() === EntityName.INFERNO_SHIELD;
    }) as ZukShield;
  }
  

  contextActions (region: Region, x: number, y: number) {
    return super.contextActions(region, x, y).concat([

      {
        text: [{ text: 'Spawn ', fillStyle: 'white' }, { text: ` Jad`, fillStyle: 'yellow' }],
        action: () => {
          Viewport.viewport.clickController.redClick()
          this.setTimer = 400;

          this.currentStats.hitpoint = 479;
          this.timerPaused = true;
          this.hasPaused = true;
          this.damageTaken();

          
        }
      },
      {
        text: [{ text: 'Spawn ', fillStyle: 'white' },  { text: ` Healers`, fillStyle: 'yellow' }],
        action: () => {
          Viewport.viewport.clickController.redClick()
          this.setTimer = 400;

          this.currentStats.hitpoint = 239;
          this.damageTaken();
          this.timerPaused = false;
          this.hasPaused = true;

          
        }
      }
    ]);
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
  
        const mager = new JalZek(this.region, { x: 20, y: 21}, {aggro: this.shield, spawnDelay: 7})
        this.region.addMob(mager);
        const ranger = new JalXil(this.region, { x: 29, y: 21}, {aggro: this.shield, spawnDelay: 9})
        this.region.addMob(ranger);
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
        const jad = new JalTokJad(this.region, { x: 24, y: 25}, { aggro: this.shield, attackSpeed: 8, stun: 1, healers: 3, isZukWave: true, spawnDelay: 7 });
        this.region.addMob(jad)
      }  
    }

    if (this.currentStats.hitpoint < 240 && this.enraged === false) {
      this.enraged = true;

      const healer1 = new JalMejJak(this.region, {x: 16, y: 9}, { aggro: this, spawnDelay: 2 });
      this.region.addMob(healer1);

      const healer2 = new JalMejJak(this.region, {x: 20, y: 9}, { aggro: this, spawnDelay: 2 });
      this.region.addMob(healer2);

      const healer3 = new JalMejJak(this.region, {x: 30, y: 9}, { aggro: this, spawnDelay: 2 });
      this.region.addMob(healer3);

      const healer4 = new JalMejJak(this.region, {x: 34, y: 9}, { aggro: this, spawnDelay: 2 });
      this.region.addMob(healer4);

    }

    if (this.currentStats.hitpoint <= 0){
      this.region.mobs.forEach((mob: Mob) => {
        if (mob as any !== this) {
          this.region.removeMob(mob);
        }
      })
  
    }
    
  }

  attack () {
    let shieldOrPlayer: Unit = this.shield;

    if (this.aggro.location.x < this.shield.location.x || this.aggro.location.x >= this.shield.location.x + 5) {
      shieldOrPlayer = this.aggro as Unit;
    }
    if (this.aggro.location.y > 16){
      shieldOrPlayer = this.aggro as Unit;
    }
    this.weapons['typeless'].attack(this, shieldOrPlayer, { attackStyle: 'typeless', magicBaseSpellDamage: shieldOrPlayer.type === UnitTypes.PLAYER ? this.magicMaxHit() : 0 });

    this.attackCooldownTicks = this.cooldown
  }

  get combatLevel () {
    return 1400
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
    return 0
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
    this.region.context.transform(1, 0, Math.sin(-tickPercent * Math.PI * 2) / 2, 1, 0, 0)
  }


  drawOverTile(tickPercent: number) {
    super.drawOverTile(tickPercent);
    // Draw mob

    this.region.context.fillStyle = '#FFFF00'
    this.region.context.font = '16px OSRS'

    this.region.context.fillText(
      String(this.currentStats.hitpoint),
      0,
      0
    )
  }
}
