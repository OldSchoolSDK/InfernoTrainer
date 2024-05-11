"use strict";

import { Mob, EntityNames, Settings, MagicWeapon, UnitBonuses } from "@supalosa/oldschool-trainer-sdk";

import JalAkRekMejImage from "../../assets/images/Jal-AkRek-Mej.png";

export class JalAkRekMej extends Mob {
  mobName() {
    return EntityNames.JAL_AK_REK_MEJ;
  }

  get combatLevel() {
    return 70;
  }
  drawUnderTile() {
    if (this.dying > -1) {
      this.region.context.fillStyle = "#964B0073";
    }
    {
      this.region.context.fillStyle = "#0000FF";
    }

    // Draw mob
    this.region.context.fillRect(
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize,
    );
  }

  setStats() {
    this.weapons = {
      magic: new MagicWeapon(),
    };

    // non boosted numbers
    this.stats = {
      attack: 1,
      strength: 1,
      defence: 95,
      range: 1,
      magic: 120,
      hitpoint: 15,
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats));
  }

  get bonuses(): UnitBonuses {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 25,
        range: 0,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 25,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 1.25,
        prayer: 0,
      },
    };
  }

  get attackSpeed() {
    return 4;
  }

  get attackRange() {
    return 15;
  }

  get size() {
    return 1;
  }

  get image() {
    return JalAkRekMejImage;
  }

  attackStyleForNewAttack() {
    return "magic";
  }

  attackAnimation(tickPercent: number, context) {
    context.translate(Math.sin(tickPercent * Math.PI * 4) * 2, Math.sin(tickPercent * Math.PI * -2));
  }
}
