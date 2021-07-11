'use strict';

import MeleeWeapon from "../../../../sdk/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";
import Pathing from "../../../../sdk/Pathing";
import MeleerImage from "../../assets/images/meleer.png";
import MeleerSound from "../../assets/sounds/meleer.ogg";

export class Meleer extends Mob{


  setStats () {
    this.weapons = {
      slash: new MeleeWeapon()
    };

    // non boosted numbers
    this.stats = {
      attack: 210,
      strength: 290,
      defence: 120,
      range: 220,
      magic: 120,
      hitpoint: 75
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
        stab: 65,
        slash: 65,
        crush: 65,
        magic: 30,
        range: 5
      },
      other: {
        meleeStrength: 40,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      }
    }
  }
  get cooldown() {
    return 4;
  }

  attackStyle() {
    return 'slash';
  }

  get attackRange() {
    return 1;
  }

  get maxHit() {
    return 49;
  }

  get size() {
    return 4;
  }

  get image() {
    return MeleerImage;
  }

  get sound() {
    return MeleerSound;
  }

  get color() {
    return "#ACFF5633";
  }

  attackAnimation(stage, framePercent){
    stage.ctx.transform(1, 0, Math.sin(-framePercent * Math.PI * 2) / 2, 1, 0, 0)
  }

  movementStep(stage) {
    super.movementStep(stage);
    if (!this.hasLOS){
      if (((this.cd <= -38) & (Math.random() < 0.1)) | (this.cd <= -50)) {
          this.dig(stage);
          this.cd = 8;
      }
    }
  }

  dig(stage) {
    if (!Pathing.collidesWithAnyEntities(stage, stage.player.location.x - 3, stage.player.location.y + 3, this.size)) {
      this.location.x = stage.player.location.x - this.size + 1
      this.location.y = stage.player.location.y + this.size - 1
    } else if (!Pathing.collidesWithAnyEntities(stage, stage.player.location.x, stage.player.location.y, this.size)) {
      this.location.x = stage.player.location.x
      this.location.y = stage.player.location.y
    } else if (!Pathing.collidesWithAnyEntities(stage, stage.player.location.x - 3, stage.player.location.y, this.size)) {
      this.location.x = stage.player.location.x - this.size + 1
      this.location.y = stage.player.location.y
    } else if (!Pathing.collidesWithAnyEntities(stage, stage.player.location.x, stage.player.location.y + 3, this.size)) {
      this.location.x = stage.player.location.x
      this.location.y = stage.player.location.y + this.size - 1
    } else {
      this.location.x = stage.player.location.x - 1
      this.location.y = stage.player.location.y + 1
    }
  }

}
