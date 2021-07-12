'use strict';

import Constants from "../../../../sdk/Constants";
import MeleeWeapon from "../../../../sdk/Weapons/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";
import RangedWeapon from "../../../../sdk/Weapons/RangedWeapon";
import BatImage from "../../assets/images/bat.png";
import BatSound from "../../assets/sounds/bat.ogg";

export class Bat extends Mob{


  setStats () {

    this.weapons = {
      range: new RangedWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 0,
      strength: 0,
      defence: 55,
      range: 120,
      magic: 120,
      hitpoint: 25
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 25
      },
      defence: {
        stab: 30,
        slash: 30,
        crush: 30,
        magic: -20,
        range: 45
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 30,
        magicDamage: 0,
        prayer: 0
      }
    }
  }
  
  get cooldown() {
    return 3;
  }

  get attackRange() {
    return 4;
  }

  get maxHit() {
    return 19;
  }

  get size() {
    return 2;
  }

  get image() {
    return BatImage;
  }

  get sound() {
    return BatSound;
  }
  
  get color() {
    return "#aadd7333";
  }

  attackStyle() {
    return 'range';
  }
  
  attackAnimation(stage, framePercent){
    stage.ctx.translate(Math.sin(framePercent * Math.PI * 4) * 2, Math.sin(framePercent * Math.PI * -2))
  }
}
