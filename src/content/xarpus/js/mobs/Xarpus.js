'use strict';

import { Mob } from "../../../../sdk/Mob";
import XarpusImage from "../../assets/images/xarpus.png";
import BatSound from "../../assets/sounds/bat.ogg";
import { XarpusWeapon } from "./XarpusWeapon";

export class Xarpus extends Mob{

  constructor(region, location, aggro) {
    super(region, location, aggro);
    this.wasPlayerInMeleeRange = false;
  }

  get displayName(){
    return "Xarpus";
  }

  get combatLevel() {
    return 331
  }

  get combatLevelColor() {
    return 'red';
  }

  setStats () {
    this.frozen = 1;

    this.weapons = {
      range: new XarpusWeapon(),
    }

    // non boosted numbers
    this.stats = {
      attack: 0,
      strength: 0,
      defence: 55,
      range: 120,
      magic: 120,
      hitpoint: 2000
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
    return 4;
  }

  get attackRange() {
    return 20;
  }

  get size() {
    return 5;
  }

  get image() {
    return XarpusImage;
  }

  get sound() {
    return BatSound;
  }
  
  get color() {
    return "#aadd7333";
  }
  // Verzik always has line-of-sight.
  setHasLOS() {
    this.hasLOS = true;
  }

  // Xarpus can never move.
  canMove() {
    return false;
  }

  get attackStyle() {
    return 'range';
  }
  
  attackAnimation(framePercent){
    this.region.ctx.transform(1, 0, Math.sin(-framePercent * Math.PI * 2) / 2, 1, 0, 0)
  }
}
