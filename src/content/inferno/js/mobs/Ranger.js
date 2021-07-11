'use strict';

import _ from "lodash";
import Constants from "../../../../sdk/Constants";
import MeleeWeapon from "../../../../sdk/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";
import RangedWeapon from "../../../../sdk/RangedWeapon";
import RangeImage from "../../assets/images/ranger.png";
import RangerSound from "../../assets/sounds/ranger.ogg";

export class Ranger extends Mob {


  setStats () {
    this.rangedWeapon = new RangedWeapon();
    this.meleeWeapon = new MeleeWeapon();

    // non boosted numbers
    this.stats = {
      attack: 140,
      strength: 180,
      defence: 60,
      ranged: 250,
      magic: 90,
      hitpoint: 125
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        ranged: 40
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        ranged: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 50,
        magicDamage: 0,
        prayer: 0
      }
    }
  }
  
  get cooldown() {
    return 4;
  }

  get attackRange() {
    return 15;
  }

  get maxHit() {
    return 46;
  }

  get size() {
    return 3;
  }

  get image() {
    return RangeImage;
  }

  get sound() {
    return RangerSound;
  }

  get color() {
    return "#AC88B933";
  }


  attackStyle() {
    return 'range';
  }

  canMeleeIfClose() {
    return true;
  }
  
  playAttackSound (){
    if (Constants.playsAudio){
      setTimeout(() => new Audio(this.sound).play(), 1.75 * Constants.tickMs)
    }
  }

  attackAnimation(stage, framePercent){
    stage.ctx.rotate(Math.sin(-framePercent * Math.PI))
  }
}
