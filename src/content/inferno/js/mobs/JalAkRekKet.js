'use strict';

import { MeleeWeapon } from "../../../../sdk/Weapons/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";
import JalAkRekKetImage from "../../assets/images/Jal-AkRek-Ket.png";

export class JalAkRekKet extends Mob{

  get displayName(){
    return "Jal-AkRek-Ket";
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
      crush: new MeleeWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 120,
      strength: 120,
      defence: 95,
      range: 1,
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
        stab: 25,
        slash: 25,
        crush: 25,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 25,
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
    return 1;
  }

  get size() {
    return 1;
  }

  get image() {
    return JalAkRekKetImage;
  }

  get sound() {
    return null;
  }
  
  get color() {
    return "#aadd7333";
  }

  attackStyle() {
    return 'crush';
  }
  
  attackAnimation(stage, framePercent){
    stage.ctx.translate(Math.sin(framePercent * Math.PI * 4) * 2, Math.sin(framePercent * Math.PI * -2))
  }
}
