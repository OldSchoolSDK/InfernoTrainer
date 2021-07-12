'use strict';

import MeleeWeapon from "../../../../sdk/Weapons/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";

import NibblerImage from "../../assets/images/nib.png";
import NibblerSound from "../../assets/sounds/meleer.ogg";
import Pathing from "../../../../sdk/Pathing";
import LineOfSight from "../../../../sdk/LineOfSight";

export class Nibbler extends Mob{


  setStats () {
    this.weapon = {
      attackRange: 1
    }
    this.weapons = {
      crush: new MeleeWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 1,
      strength: 30, // This isn't true w/r/t the Monster Examine feature, but those stats are obviously wrong.
      defence: 15,
      range: 1,
      magic: 15,
      hitpoint: 10
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      defence: {
        stab: -20,
        slash: -20,
        crush: -20,
        magic: -20,
        range: -20
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      }
    }
  }
  
  get consumesSpace() {
    return false;
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
    return NibblerImage;
  }

  get sound() {
    return NibblerSound;
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

  attackIfPossible(stage){
    if (this.aggro.isDead) {
      this.dead(stage); // cheat way for now. pillar should AOE 
    }
    let isUnderAggro = Pathing.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1);
    this.attackFeedback = Mob.attackIndicators.NONE;

    const aggroPoint = LineOfSight.closestPointTo(this.location.x, this.location.y, this.aggro);

    if (!isUnderAggro && Pathing.dist(this.location.x, this.location.y, aggroPoint.x, aggroPoint.y) <= this.attackRange && this.cd <= 0){
      this.attack(stage);
    }
  }
}
