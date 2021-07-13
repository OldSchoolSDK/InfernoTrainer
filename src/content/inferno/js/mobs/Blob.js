'use strict';

import MagicWeapon from "../../../../sdk/Weapons/MagicWeapon";
import MeleeWeapon from "../../../../sdk/Weapons/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";
import RangedWeapon from "../../../../sdk/Weapons/RangedWeapon";
import BlobImage from "../../assets/images/blob.png";
import BlobSound from "../../assets/sounds/blob.ogg";

import JalAkRekKet from "../../js/mobs/JalAkRekKet";
import JalAkRekMej from "../../js/mobs/JalAkRekMej";
import JalAkRekXil from "../../js/mobs/JalAkRekXil";
import Point from "../../../../sdk/Utils/Point";

export class Blob extends Mob{


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


  dead(stage) {
    super.dead(stage);
    

    stage.addMob(new JalAkRekKet(this.location, this.aggro));

    const xil = new Point(this.location.x+1, this.location.y - 1);
    stage.addMob(new JalAkRekXil(xil, this.aggro));

    const mej = new Point(this.location.x+2, this.location.y - 2);
    stage.addMob(new JalAkRekMej(mej, this.aggro));
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

  attackAnimation(stage, framePercent){
    stage.ctx.scale(1 + Math.sin(framePercent * Math.PI) / 4, 1 - Math.sin(framePercent * Math.PI) / 4)
  }

  shouldShowAttackAnimation() {
    return this.cd === this.cooldown && this.playerPrayerScan === null;
  }

  attackStyle() {
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
   
  attackIfPossible(stage){
    this.attackFeedback = Mob.attackIndicators.NONE;
    // Scan when appropriate
    if (this.hasLOS && (!this.hadLOS || (!this.playerPrayerScan && this.cd <= 0))) {
      // we JUST gained LoS, or we are properly queued up for the next scan
      const overhead = _.find(stage.player.prayers, prayer => prayer.isOverhead() && prayer.isActive);
      this.playerPrayerScan = overhead ? overhead.feature() : 'none'; 
      this.attackFeedback = Mob.attackIndicators.SCAN;
      this.cd = this.cooldown;
      return;
    }
    
    // Perform attack. Blobs can hit through LoS if they got a scan.
    if (this.playerPrayerScan && this.cd <=0) {
      this.attack(stage);
      this.cd = this.cooldown;
      this.playerPrayerScan = null;
    }
  }

}
