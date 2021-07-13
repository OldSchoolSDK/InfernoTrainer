'use strict';

import { Mob } from "../../../../sdk/Mob";
import JalAkRekMejImage from "../../assets/images/Jal-AkRek-Mej.png";
import MagicWeapon from "../../../../sdk/Weapons/MagicWeapon";

export default class JalAkRekMej extends Mob{


  setStats () {
    this.frozen = 0;

    this.weapons = {
      magic: new MagicWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 1,
      strength: 1,
      defence: 95,
      range: 1,
      magic: 120,
      hitpoint: 15
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 25,
        range: 0
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 25,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 1.25,
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
    return 'magic';
  }
  
  attackAnimation(stage, framePercent){
    stage.ctx.translate(Math.sin(framePercent * Math.PI * 4) * 2, Math.sin(framePercent * Math.PI * -2))
  }
}