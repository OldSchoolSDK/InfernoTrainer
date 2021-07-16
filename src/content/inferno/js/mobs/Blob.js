'use strict';

import { MagicWeapon } from "../../../../sdk/Weapons/MagicWeapon";
import { MeleeWeapon } from "../../../../sdk/Weapons/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";
import { RangedWeapon } from "../../../../sdk/Weapons/RangedWeapon";
import BlobImage from "../../assets/images/blob.png";
import BlobSound from "../../assets/sounds/blob.ogg";

import { JalAkRekKet } from "../../js/mobs/JalAkRekKet";
import { JalAkRekMej } from "../../js/mobs/JalAkRekMej";
import { JalAkRekXil } from "../../js/mobs/JalAkRekXil";

export class Blob extends Mob{


  get displayName(){
    return "Jal-Ak";
  }

  get combatLevel() {
    return 165
  }

  get combatLevelColor() {
    return 'red';
  }
  
  setStats () {
    this.frozen = 1;

    this.weapons = {
      crush: new MeleeWeapon(),
      magic: new MagicWeapon(),
      range: new RangedWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 160,
      strength: 160,
      defence: 95,
      range: 160,
      magic: 160,
      hitpoint: 40
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 45,
        range: 40
      },
      defence: {
        stab: 25,
        slash: 25,
        crush: 25,
        magic: 25,
        range: 25
      },
      other: {
        meleeStrength: 45,
        rangedStrength: 45,
        magicDamage: 1.0,
        prayer: 0
      }
    }
  }


  // Since blobs attack on a 6 tick cycle, but these mechanics are odd, i set the 
  // attack speed to 3. The attack code exits early during a scan, so it always is 
  // double the cooldown between actual attacks.
  get cooldown() {
    return 3;
  }

  get attackRange() {
    return 15;
  }

  get size() {
    return 3;
  }

  get image() {
    return BlobImage;
  }

  get sound() {
    return BlobSound;
  }
  
  get color() {
    return "#7300FF33";
  }

  attackAnimation(framePercent){
    this.region.ctx.scale(1 + Math.sin(framePercent * Math.PI) / 4, 1 - Math.sin(framePercent * Math.PI) / 4)
  }

  shouldShowAttackAnimation() {
    return this.attackCooldownTicks === this.cooldown && this.playerPrayerScan === null;
  }

  get attackStyle() {
    if (this.playerPrayerScan !== 'magic' && this.playerPrayerScan != 'range'){
      return (Math.random() < 0.5) ? 'magic' : 'range';
    }
    return (this.playerPrayerScan === 'magic') ? 'range' : 'magic';
  }

  canMeleeIfClose() {
    return 'crush';
  }

  magicMaxHit() {
    return 29;
  }
   
  attackIfPossible(){
    this.attackFeedback = Mob.attackIndicators.NONE;
    // Scan when appropriate
    if (this.hasLOS && (!this.hadLOS || (!this.playerPrayerScan && this.attackCooldownTicks <= 0))) {
      // we JUST gained LoS, or we are properly queued up for the next scan
      const overhead = _.find(this.region.player.prayers, prayer => prayer.isOverhead() && prayer.isActive);
      this.playerPrayerScan = overhead ? overhead.feature() : 'none'; 
      this.attackFeedback = Mob.attackIndicators.SCAN;
      this.attackCooldownTicks = this.cooldown;
      return;
    }
    
    // Perform attack. Blobs can hit through LoS if they got a scan.
    if (this.playerPrayerScan && this.attackCooldownTicks <=0) {
      this.attack();
      this.attackCooldownTicks = this.cooldown;
      this.playerPrayerScan = null;
    }
  }
  
  removedFromRegion(){

    const xil = new JalAkRekXil({ x: this.location.x+1, y: this.location.y - 1}, this.aggro);
    this.region.addMob(xil);

    const ket = new JalAkRekKet(this.location, this.aggro);
    this.region.addMob(ket);

    const mej = new JalAkRekMej({ x: this.location.x+2, y: this.location.y - 2}, this.aggro);
    this.region.addMob(mej);
  }

}
