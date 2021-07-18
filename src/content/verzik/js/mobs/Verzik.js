'use strict';

import { Mob } from "../../../../sdk/Mob";
import { MeleeWeapon } from "../../../../sdk/Weapons/MeleeWeapon";
import VerzikImage from "../../assets/images/verzik.png";

import VerzikRange1 from "../../assets/images/verzik-range0000.png";
import VerzikRange2 from "../../assets/images/verzik-range0001.png";
import VerzikRange3 from "../../assets/images/verzik-range0002.png";
import VerzikRange4 from "../../assets/images/verzik-range0003.png";
import VerzikRange5 from "../../assets/images/verzik-range0004.png";
import VerzikRange6 from "../../assets/images/verzik-range0005.png";
import VerzikRange7 from "../../assets/images/verzik-range0006.png";
import VerzikRange8 from "../../assets/images/verzik-range0007.png";

import BatSound from "../../assets/sounds/bat.ogg";
import { AoeRangedWeapon } from "../../../../sdk/Weapons/AoeRangedWeapon";

export class Verzik extends Mob{

  constructor(region, location, aggro) {
    super(region, location, aggro);
    this.wasPlayerInMeleeRange = false;
  }

  get displayName(){
    return "Verzik";
  }

  get combatLevel() {
    return 1520
  }

  get combatLevelColor() {
    return 'red';
  }

  setStats () {
    this.frozen = 1;

    this.weapons = {
      melee: new MeleeWeapon(),
      range: new AoeRangedWeapon(),
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
    return (this.currentStats.hitpoint <= this.stats.hitpoint * 0.2) ? 5 : 7;
  }

  get attackRange() {
    return 20;
  }

  get size() {
    return 7;
  }

  get image() {
    return VerzikImage;
  }

  get rangeAttackAnimation() {
    return [
      VerzikRange1,
      VerzikRange2,
      VerzikRange3,
      VerzikRange4,
      VerzikRange5,
      VerzikRange6,
      VerzikRange7,
      VerzikRange8,
    ];
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

  // Verzik can always move towards its target, even if it has LOS.
  // Verzik does not move if does a range attack on top of the target.
  canMove() {
    return !this.isWithinMeleeRange()
      && !this.isDying()
      && (this.attackCooldownTicks !== 1 || !this.isOnTile(this.aggro.location.x, this.aggro.location.y));
  }

  canMeleeIfClose() {
    return 'melee';
  }

  get attackStyle() {
    return 'range';
  }
  
  attackAnimation(framePercent){
    this.region.ctx.transform(1, 0, Math.sin(-framePercent * Math.PI * 2) / 2, 1, 0, 0)
  }
}
