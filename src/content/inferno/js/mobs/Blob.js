'use strict';

import Constants from "../../../../sdk/Constants";
import LineOfSight from "../../../../sdk/LineOfSight";
import MagicWeapon from "../../../../sdk/MagicWeapon";
import { Mob } from "../../../../sdk/Mob";
import RangedWeapon from "../../../../sdk/RangedWeapon";
import BlobImage from "../../assets/images/blob.png";
import BlobSound from "../../assets/sounds/blob.ogg";

export class Blob extends Mob{


  setStats () {

    this.rangedWeapon = new RangedWeapon();
    this.magicWeapon = new MagicWeapon();
    // non boosted numbers
    this.stats = {
      attack: 160,
      strength: 160,
      defence: 95,
      ranged: 160,
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
        ranged: 40
      },
      defence: {
        stab: 25,
        slash: 25,
        crush: 25,
        magic: 25,
        ranged: 25
      },
      other: {
        meleeStrength: 45,
        rangedStrength: 45,
        magicDamage: 45,
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

  get maxHit() {
    return 29;
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

  attackAnimation(stage, framePercent){
    stage.ctx.scale(1 + Math.sin(framePercent * Math.PI) / 4, 1 - Math.sin(framePercent * Math.PI) / 4)
  }

  shouldShowAttackAnimation() {
    return this.cd === this.cooldown && this.playerPrayerScan === null;
  }

  attackStyle() {
    if (this.playerPrayerScan !== 'mage' && this.playerPrayerScan != 'range'){
      return (Math.random() < 0.5) ? 'mage' : 'range';
    }
    return (this.playerPrayerScan === 'mage') ? 'range' : 'mage';
  }

  canMeleeIfClose() {
    return true;
  }
   
  attackIfPossible(stage){

    // Scan when appropriate
    if (this.hasLOS && (!this.hadLOS || (!this.playerPrayerScan && this.cd <= 0))) {
      // we JUST gained LoS, or we are properly queued up for the next scan
      const overhead = _.find(stage.player.prayers, prayer => prayer.isOverhead() && prayer.isActive);
      this.playerPrayerScan = overhead ? overhead.feature() : 'none'; 
      this.attackFeedback = Mob.attackIndicators.SCAN;
      this.cd = this.cooldown;
      return;
    }
    
    // Perform attack
    if (this.playerPrayerScan && this.cd <=0) {
      this.attack(stage);
      this.cd = this.cooldown;
      this.playerPrayerScan = null;
    }
  }

}
