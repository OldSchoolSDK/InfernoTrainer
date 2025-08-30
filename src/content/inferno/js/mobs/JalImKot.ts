"use strict";

import { Assets, Mob, EntityNames, MeleeWeapon, Sound, UnitBonuses, Location, Random, Collision, UnitTypes, Player, GLTFModel } from "@supalosa/oldschool-trainer-sdk";

import MeleerImage from "../../assets/images/meleer.png";
import MeleerSound from "../../assets/sounds/meleer.ogg";
import { InfernoMobDeathStore } from "../InfernoMobDeathStore";

const MeleerModel = Assets.getAssetUrl("models/7697_33010.glb");

export class JalImKot extends Mob {
  private digSequenceTime = 0;
  private digLocation: Location = { x: 0, y: 0 };
  private digCount = 0;

  mobName() {
    return EntityNames.JAL_IM_KOT;
  }

  get combatLevel() {
    return 240;
  }

  dead() {
    super.dead();
    InfernoMobDeathStore.npcDied(this);
  }

  setStats() {
    this.stunned = 1;

    this.weapons = {
      slash: new MeleeWeapon({
        sound: new Sound(MeleerSound, 0.6)
      }),
    };

    // non boosted numbers
    this.stats = {
      attack: 210,
      strength: 290,
      defence: 120,
      range: 220,
      magic: 120,
      hitpoint: 75,
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
        range: 0,
      },
      defence: {
        stab: 65,
        slash: 65,
        crush: 65,
        magic: 30,
        range: 5,
      },
      other: {
        meleeStrength: 40,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0,
      },
    };
  }
  get attackSpeed() {
    return 4;
  }

  attackStyleForNewAttack() {
    return "slash";
  }

  get attackRange() {
    return 1;
  }

  get size() {
    return 4;
  }

  get image() {
    return MeleerImage;
  }

  get color() {
    return "#ACFF5633";
  }

  attackAnimation(tickPercent: number, context) {
    context.transform(1, 0, Math.sin(-tickPercent * Math.PI * 2) / 2, 1, 0, 0);
  }

  movementStep() {
    super.movementStep();
    if (!this.hasLOS && !this.digSequenceTime) {
      if ((this.attackDelay <= -38 && Random.get() < 0.1) || this.attackDelay <= -50) {
        this.startDig();
        this.playAnimation(3);
      }
    }
    if (this.digSequenceTime && --this.digSequenceTime === 0) {
      this.endDig();
      this.playAnimation(4);
    }
  }

  startDig() {
    if (!this.aggro) {
      return;
    }
    this.freeze(6);
    this.digSequenceTime = 6;
    this.digCount++;
    if (
      !Collision.collidesWithAnyEntities(this.region, this.aggro.location.x - 3, this.aggro.location.y + 3, this.size)
    ) {
      this.digLocation = {
        x: this.aggro.location.x - this.size + 1,
        y: this.aggro.location.y + this.size - 1,
      };
    } else if (
      !Collision.collidesWithAnyEntities(this.region, this.aggro.location.x, this.aggro.location.y, this.size)
    ) {
      this.digLocation = {
        x: this.aggro.location.x,
        y: this.aggro.location.y,
      };
    } else if (
      !Collision.collidesWithAnyEntities(this.region, this.aggro.location.x - 3, this.aggro.location.y, this.size)
    ) {
      this.digLocation = {
        x: this.aggro.location.x - this.size + 1,
        y: this.aggro.location.y,
      };
    } else if (
      !Collision.collidesWithAnyEntities(this.region, this.aggro.location.x, this.aggro.location.y + 3, this.size)
    ) {
      this.digLocation = {
        x: this.aggro.location.x,
        y: this.aggro.location.y + this.size - 1,
      };
    } else {
      this.digLocation = {
        x: this.aggro.location.x - 1,
        y: this.aggro.location.y + 1,
      };
    }
    this.perceivedLocation = this.location;
  }

  endDig() {
    if (this.aggro.type === UnitTypes.PLAYER) {
      const player = this.aggro as Player;
      if (player.aggro === this) {
        player.interruptCombat();
      }
    }
    this.attackDelay = 6;
    this.freeze(2);
    this.location = this.digLocation;
    this.perceivedLocation = this.location;
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, MeleerModel);
  }

  get deathAnimationLength() {
    return 6;
  }

  get attackAnimationId() {
    return 2;
  }

  override get deathAnimationId() {
    return 6;
  }
}
