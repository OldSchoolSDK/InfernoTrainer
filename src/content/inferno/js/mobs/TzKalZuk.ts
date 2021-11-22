'use strict'

import { Mob } from '../../../../sdk/Mob'
import ZukImage from '../../assets/images/TzKal-Zuk.png'
import { Unit, UnitBonuses } from '../../../../sdk/Unit'
import { MagicWeapon } from '../../../../sdk/weapons/MagicWeapon'
import { World } from '../../../../sdk/World'
import { UnitOptions } from '../../../../sdk/Unit'
import { Location } from "../../../../sdk/Location"
import { ZukShield } from '../ZukShield'
import { find } from 'lodash'
import { Entity } from '../../../../sdk/Entity'
import { EntityName } from "../../../../sdk/EntityName"
import { AttackBonuses, Weapon } from '../../../../sdk/gear/Weapon'
import { ImageLoader } from '../../../../sdk/utils/ImageLoader'
import ZukAttackImage from '../../assets/images/zuk_attack.png';
import { Projectile, ProjectileOptions } from '../../../../sdk/weapons/Projectile'
import { JalZek } from './JalZek'
import { JalXil } from './JalXil'
import { JalMejJak } from './JalMejJak'
import { JalTokJad } from './JalTokJad'
import { JalImKot } from './JalImKot'

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

    this.shield = find(world.region.mobs, (mob: Unit) => {
      return mob.mobName() === EntityName.INFERNO_SHIELD;
    }) as ZukShield;
  }
  

  contextActions (world: World, x: number, y: number) {
    return super.contextActions(world, x, y).concat([

      {
        text: [{ text: 'Spawn ', fillStyle: 'white' }, { text: ` Jad`, fillStyle: 'yellow' }],
        action: () => {
          this.world.viewport.clickController.redClick()
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
          this.world.viewport.clickController.redClick()
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
  
        const mager = new JalZek(this.world, { x: 20, y: 21}, {aggro: this.shield, spawnDelay: 7})
        this.world.region.addMob(mager);
        const ranger = new JalXil(this.world, { x: 29, y: 21}, {aggro: this.shield, spawnDelay: 9})
        this.world.region.addMob(ranger);
        const meleer = new JalImKot(this.world, { x: 25, y: 20}, {aggro: this.world.player, spawnDelay: 5})
        this.world.region.addMob(meleer);
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
        this.setTimer += 175 * 6;
        this.timerPaused = false;
        // Spawn Jad
        const jad = new JalTokJad(this.world, { x: 24, y: 25}, { aggro: this.shield, attackSpeed: 9, stun: 1, healers: 6, isZukWave: true, spawnDelay: 7 });
        this.world.region.addMob(jad)


        const jad2 = new JalTokJad(this.world, { x: 15, y: 25}, { aggro: this.shield, attackSpeed: 9, stun: 1, healers: 6, isZukWave: true, spawnDelay: 10 });
        this.world.region.addMob(jad2)


        const jad3 = new JalTokJad(this.world, { x: 32, y: 25}, { aggro: this.shield, attackSpeed: 9, stun: 1, healers: 6, isZukWave: true, spawnDelay: 13 });
        this.world.region.addMob(jad3)
      }  
    }

    if (this.currentStats.hitpoint < 240 && this.enraged === false) {
      this.enraged = true;

      const healer1 = new JalMejJak(this.world, {x: 16, y: 9}, { aggro: this, spawnDelay: 2 });
      this.world.region.addMob(healer1);

      const healer12 = new JalMejJak(this.world, {x: 18, y: 9}, { aggro: this, spawnDelay: 2 });
      this.world.region.addMob(healer12);

      const healer2 = new JalMejJak(this.world, {x: 20, y: 9}, { aggro: this, spawnDelay: 2 });
      this.world.region.addMob(healer2);

      const healer3 = new JalMejJak(this.world, {x: 30, y: 9}, { aggro: this, spawnDelay: 2 });
      this.world.region.addMob(healer3);

      const healer34 = new JalMejJak(this.world, {x: 32, y: 9}, { aggro: this, spawnDelay: 2 });
      this.world.region.addMob(healer34);

      const healer4 = new JalMejJak(this.world, {x: 34, y: 9}, { aggro: this, spawnDelay: 2 });
      this.world.region.addMob(healer4);

    }

    if (this.currentStats.hitpoint <= 0){
      this.world.region.mobs.forEach((mob: Mob) => {
        if (mob !== this) {
          this.world.region.removeMob(mob);
        }
      })
  
    }
    
  }

  attack () {
    let shieldOrPlayer: Unit = this.shield;

    if (this.world.player.location.x < this.shield.location.x || this.world.player.location.x >= this.shield.location.x + 5) {
      shieldOrPlayer = this.world.player;
    }
    if (this.world.player.location.y > 16){
      shieldOrPlayer = this.world.player;
    }
    this.weapons['typeless'].attack(this.world, this, shieldOrPlayer, { attackStyle: 'typeless', magicBaseSpellDamage: shieldOrPlayer === this.world.player ? this.magicMaxHit() : 0 });

    this.attackCooldownTicks = this.cooldown
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
    return 1000
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
      hitpoint: 2400
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
        range: 150
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
      return 3;
    }
    return 5
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
    this.world.region.context.transform(1, 0, Math.sin(-tickPercent * Math.PI * 2) / 2, 1, 0, 0)
  }


  drawOverTile(tickPercent: number) {
    super.drawOverTile(tickPercent);
    // Draw mob

    this.world.region.context.fillStyle = '#FFFF00'
    this.world.region.context.font = '16px OSRS'

    this.world.region.context.fillText(
      String(this.currentStats.hitpoint),
      0,
      0
    )
  }
}
