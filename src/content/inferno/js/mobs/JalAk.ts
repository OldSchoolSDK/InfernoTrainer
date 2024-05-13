"use strict";
import { Assets, Mob, MeleeWeapon, MagicWeapon, Sound, RangedWeapon, UnitBonuses, Random, AttackIndicators, Unit, Viewport, GLTFModel, EntityNames, Trainer } from "@supalosa/oldschool-trainer-sdk";

import BlobImage from "../../assets/images/blob.png";
import BlobSound from "../../assets/sounds/blob.ogg";

import { JalAkRekKet } from "./JalAkRekKet";
import { JalAkRekMej } from "./JalAkRekMej";
import { JalAkRekXil } from "./JalAkRekXil";
import { InfernoMobDeathStore } from "../InfernoMobDeathStore";

const BlobModel = Assets.getAssetUrl("models/7693_33001.glb");

export class JalAk extends Mob {
  playerPrayerScan?: string = null;

  mobName() {
    return EntityNames.JAL_AK;
  }

  get combatLevel() {
    return 165;
  }

  dead() {
    super.dead();
    InfernoMobDeathStore.npcDied(this);
  }

  setStats() {
    this.stunned = 1;

    this.weapons = {
      crush: new MeleeWeapon(),
      magic: new MagicWeapon({
        sound: new Sound(BlobSound)
      }),
      range: new RangedWeapon({
        sound: new Sound(BlobSound)
      }),
    };

    // non boosted numbers
    this.stats = {
      attack: 160,
      strength: 160,
      defence: 95,
      range: 160,
      magic: 160,
      hitpoint: 40,
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
        magic: 45,
        range: 40,
      },
      defence: {
        stab: 25,
        slash: 25,
        crush: 25,
        magic: 25,
        range: 25,
      },
      other: {
        meleeStrength: 45,
        rangedStrength: 45,
        magicDamage: 1.0,
        prayer: 0,
      },
    };
  }
  // Since blobs attack on a 6 tick cycle, but these mechanics are odd, i set the
  // attack speed to 3. The attack code exits early during a scan, so it always is
  // double the cooldown between actual attacks.
  get attackSpeed() {
    return 3;
  }

  get attackRange() {
    return 15;
  }

  get size() {
    return 3;
  }

  get height() {
    return 2;
  }

  get image() {
    return BlobImage;
  }
  
  attackAnimation(tickPercent: number, context) {
    context.scale(1 + Math.sin(tickPercent * Math.PI) / 4, 1 - Math.sin(tickPercent * Math.PI) / 4);
  }

  shouldShowAttackAnimation() {
    return this.attackDelay === this.attackSpeed && this.playerPrayerScan === null;
  }

  attackStyleForNewAttack() {
    if (this.playerPrayerScan !== "magic" && this.playerPrayerScan !== "range") {
      return Random.get() < 0.5 ? "magic" : "range";
    }
    return this.playerPrayerScan === "magic" ? "range" : "magic";
  }

  canMeleeIfClose() {
    return "crush" as const;
  }

  magicMaxHit() {
    return 29;
  }

  attackIfPossible() {
    this.attackFeedback = AttackIndicators.NONE;

    this.hadLOS = this.hasLOS;
    this.setHasLOS();

    if (this.canAttack() === false) {
      return;
    }

    this.attackStyle = this.attackStyleForNewAttack();

    // Scan when appropriate
    if (this.hasLOS && (!this.hadLOS || (!this.playerPrayerScan && this.attackDelay <= 0))) {
      // we JUST gained LoS, or we are properly queued up for the next scan
      const unit = this.aggro as Unit;
      const overhead = unit.prayerController.overhead();
      this.playerPrayerScan = overhead ? overhead.feature() : "none";
      this.attackFeedback = AttackIndicators.SCAN;

      this.attackDelay = this.attackSpeed;
      return;
    }

    // Perform attack. Blobs can hit through LoS if they got a scan.
    if (this.playerPrayerScan && this.attackDelay <= 0) {
      this.attack() && this.didAttack();
      this.playerPrayerScan = null;
    }
  }

  removedFromWorld() {
    const player = Trainer.player;
    const xil = new JalAkRekXil(
      this.region,
      { x: this.location.x + 1, y: this.location.y - 1 },
      { aggro: player, cooldown: 4 },
    );
    this.region.addMob(xil as Mob);

    const ket = new JalAkRekKet(this.region, this.location, {
      aggro: player,
      cooldown: 4,
    });
    this.region.addMob(ket as Mob);

    const mej = new JalAkRekMej(
      this.region,
      { x: this.location.x + 2, y: this.location.y - 2 },
      { aggro: player, cooldown: 4 },
    );
    this.region.addMob(mej as Mob);
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, BlobModel);
  }

  override get attackAnimationId() {
    return this.attackStyle === "magic" ? 2 : 4;
  }

  override get deathAnimationId() {
    return 3;
  }
}
