"use strict";

import { MeleeWeapon } from "../../../../sdk/weapons/MeleeWeapon";
import { Mob } from "../../../../sdk/Mob";
import JalAkRekKetImage from "../../assets/images/Jal-AkRek-Ket.png";
import { Settings } from "../../../../sdk/Settings";
import { UnitBonuses } from "../../../../sdk/Unit";
import { EntityName } from "../../../../sdk/EntityName";

export class JalAkRekKet extends Mob {
  mobName(): EntityName {
    return EntityName.JAL_AK_REK_KET;
  }

  get combatLevel() {
    return 70;
  }

  drawUnderTile() {
    if (this.dying > -1) {
      this.region.context.fillStyle = "#964B0073";
    }
    {
      this.region.context.fillStyle = "#FF0000";
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
      crush: new MeleeWeapon(),
    };

    // non boosted numbers
    this.stats = {
      attack: 120,
      strength: 120,
      defence: 95,
      range: 1,
      magic: 1,
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
        magic: 0,
        range: 25,
      },
      defence: {
        stab: 25,
        slash: 25,
        crush: 25,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 25,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0,
      },
    };
  }

  get attackSpeed() {
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

  attackStyleForNewAttack() {
    return "crush";
  }

  attackAnimation(tickPercent: number, context) {
    context.translate(Math.sin(tickPercent * Math.PI * 4) * 2, Math.sin(tickPercent * Math.PI * -2));
  }
}
