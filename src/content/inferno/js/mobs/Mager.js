'use strict';

import MagicWeapon from "../../../../sdk/Weapons/MagicWeapon";
import MeleeWeapon from "../../../../sdk/Weapons/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";
import MagerImage from "../../assets/images/mager.png";
import MagerSound from "../../assets/sounds/mager.ogg";

export class Mager extends Mob{


  setStats () {
    this.weapons = {
      slash: new MeleeWeapon(),
      magic: new MagicWeapon()
    };

    // non boosted numbers
    this.stats = {
      attack: 370,
      strength: 510,
      defence: 260,
      range: 510,
      magic: 300,
      hitpoint: 220
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 80,
        range: 0
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
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
    return 70;
  }
  
  get size() {
    return 4;
  }

  get image() {
    return MagerImage;
  }

  get sound() {
    return MagerSound;
  }
  
  get color() {
    return "#ffffff33";
  }

  attackStyle() {
    return 'magic';
  }
  
  canMeleeIfClose() {
    return 'stab';
  }

  magicMaxHit() {
    return 70;
  }

  attackAnimation(stage, framePercent){
    stage.ctx.rotate(framePercent * Math.PI * 2);
  }
}
