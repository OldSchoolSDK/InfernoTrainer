'use strict';

import Constants from "../../../../sdk/Constants";
import LineOfSight from "../../../../sdk/LineOfSight";
import { Mob } from "../../../../sdk/Mob";
import BlobImage from "../../assets/images/blob.png";
import BlobSound from "../../assets/sounds/blob.ogg";

export class Blob extends Mob{

  // Since blobs attack on a 6 tick cycle, but these mechanics are odd, i set the 
  // attack speed to 3. The attack code exits early during a scan, so it always is 
  // double the cooldown between actual attacks.
  get cooldown() {
    return 3;
  }

  get attackRange() {
    return 15;
  }

  get maxHealth() {
    return 40;
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
    if (this.hasLOS && this.playerPrayerScan && this.cd <=0) {
      this.attack(stage);
      this.cd = this.cooldown;
      this.playerPrayerScan = null;
    }
  }

}
