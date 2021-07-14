'use strict';

import { Mob } from "../../../../sdk/Mob";
import RangedWeapon from "../../../../sdk/Weapons/RangedWeapon";
import JalAkRekMejImage from "../../assets/images/Jal-AkRek-Mej.png";

export default class JalAkRekXil extends Mob{

  get displayName(){
    return "Jal-AkRek-Xil";
  }

  get combatLevel() {
    return 70
  }

  get combatLevelColor() {
    return 'lime';
  }

  setStats () {
    this.frozen = 0;

    this.weapons = {
      range: new RangedWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 1,
      strength: 1,
      defence: 95,
      range: 120,
      magic: 1,
      hitpoint: 15
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
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 25
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 25,
        magicDamage: 0,
        prayer: 0
      }
    }
  }
  
  get cooldown() {
    return 4;
  }

  get attackRange() {
    return 5;
  }

  get size() {
    return 1;
  }

  get image() {
    return JalAkRekMejImage;
  }

  get sound() {
    return null;
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
