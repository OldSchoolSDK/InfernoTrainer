"use strict";

import { Assets, MagicWeapon, Unit, Sound, Projectile, Mob, Region, UnitOptions, ImageLoader, Location, Viewport, UnitTypes, UnitBonuses, Model, GLTFModel, EntityNames, Trainer } from "@supalosa/oldschool-trainer-sdk";

import ZukImage from "../../assets/images/TzKal-Zuk.png";
import { ZukShield } from "../ZukShield";
import { find } from "lodash";
import ZukAttackImage from "../../assets/images/zuk_attack.png";
import { JalZek, MagerModel } from "./JalZek";
import { JalXil, RangerModel } from "./JalXil";
import { JalMejJak } from "./JalMejJak";
import { JadModel, JalTokJad } from "./JalTokJad";

const HitSound = Assets.getAssetUrl("assets/sounds/dragon_hit_410.ogg");

import ZukAttackSound from "../../assets/sounds/fireblast_cast_and_fire_155.ogg";

const ZukModel = Assets.getAssetUrl("models/7706_33011.glb");
const ZukBall = Assets.getAssetUrl("models/zuk_projectile.glb");

/* eslint-disable @typescript-eslint/no-explicit-any */

const zukWeaponImage = ImageLoader.createImage(ZukAttackImage);

class ZukWeapon extends MagicWeapon {
  get image(): HTMLImageElement {
    return zukWeaponImage;
  }

  isBlockable() {
    return false;
  }
  registerProjectile(from: Unit, to: Unit) {
    const sound = new Sound(ZukAttackSound, 0.03);
    if (to.isPlayer) {
      // louder!
      sound.volume = 0.1;
    }
    to.addProjectile(
      new ZukProjectile(this, this.damage, from, to, "range", {
        model: ZukBall,
        modelScale: 1 / 128,
        setDelay: 4,
        visualDelayTicks: 2,
        sound,
      }),
    );
  }
}

class ZukProjectile extends Projectile {
  get size() {
    return 2;
  }

  get color() {
    return "#FFAA00";
  }
}

export class TzKalZuk extends Mob {
  shield: ZukShield;
  enraged = false;

  setTimer = 72;
  timerPaused = false;
  hasPaused = false;

  constructor(region: Region, location: Location, options: UnitOptions) {
    super(region, location, options);
    this.attackDelay = 14;

    this.shield = find(region.mobs.concat(region.newMobs), (mob: Unit) => {
      return mob.mobName() === EntityNames.INFERNO_SHIELD;
    }) as ZukShield;
  }

  contextActions(region: Region, x: number, y: number) {
    return super.contextActions(region, x, y).concat([
      {
        text: [
          { text: "Spawn ", fillStyle: "white" },
          { text: ` Jad`, fillStyle: "yellow" },
        ],
        action: () => {
          Trainer.clickController.redClick();
          this.setTimer = 400;

          this.currentStats.hitpoint = 479;
          this.timerPaused = true;
          this.hasPaused = true;
          this.damageTaken();
        },
      },
      {
        text: [
          { text: "Spawn ", fillStyle: "white" },
          { text: ` Healers`, fillStyle: "yellow" },
        ],
        action: () => {
          Trainer.clickController.redClick();
          this.setTimer = 400;

          this.currentStats.hitpoint = 239;
          this.damageTaken();
          this.timerPaused = false;
          this.hasPaused = true;
        },
      },
    ]);
  }

  mobName() {
    return EntityNames.TZ_KAL_ZUK;
  }

  attackIfPossible() {
    this.attackStyle = this.attackStyleForNewAttack();

    if (this.timerPaused === false) {
      this.setTimer--;

      if (this.setTimer === 0) {
        this.setTimer = 350;

        const mager = new JalZek(this.region, { x: 20, y: 21 }, { aggro: this.shield, spawnDelay: 7 });
        this.region.addMob(mager);
        const ranger = new JalXil(this.region, { x: 29, y: 21 }, { aggro: this.shield, spawnDelay: 9 });
        this.region.addMob(ranger);
      }
    }

    if (this.canAttack() && this.attackDelay <= 0) {
      this.attack() && this.didAttack();
    }
  }
  damageTaken() {
    if (this.timerPaused === false) {
      if (this.currentStats.hitpoint < 600 && this.hasPaused === false) {
        this.timerPaused = true;
        this.hasPaused = true;
      }
    } else {
      if (this.currentStats.hitpoint < 480) {
        this.setTimer += 175;
        this.timerPaused = false;
        // Spawn Jad
        const jad = new JalTokJad(
          this.region,
          { x: 24, y: 25 },
          {
            aggro: this.shield,
            attackSpeed: 8,
            stun: 1,
            healers: 3,
            isZukWave: true,
            spawnDelay: 7,
          },
        );
        this.region.addMob(jad);
      }
    }

    if (this.currentStats.hitpoint < 240 && this.enraged === false) {
      this.enraged = true;

      const healer1 = new JalMejJak(this.region, { x: 16, y: 9 }, { aggro: this, spawnDelay: 2 });
      this.region.addMob(healer1);

      const healer2 = new JalMejJak(this.region, { x: 20, y: 9 }, { aggro: this, spawnDelay: 2 });
      this.region.addMob(healer2);

      const healer3 = new JalMejJak(this.region, { x: 30, y: 9 }, { aggro: this, spawnDelay: 2 });
      this.region.addMob(healer3);

      const healer4 = new JalMejJak(this.region, { x: 34, y: 9 }, { aggro: this, spawnDelay: 2 });
      this.region.addMob(healer4);
    }

    if (this.currentStats.hitpoint <= 0) {
      this.region.mobs.forEach((mob: Mob) => {
        if ((mob as any) !== this) {
          mob.dying = 0;
        }
      });
    }
  }

  override visible() {
    // always visible, even during countdown
    return true;
  }

  attack() {
    if (!this.aggro || this.aggro.dying >= 0) {
      return false;
    }
    let shieldOrPlayer: Unit = this.shield;

    if (this.aggro.location.x < this.shield.location.x || this.aggro.location.x >= this.shield.location.x + 5) {
      shieldOrPlayer = this.aggro as Unit;
    }
    if (this.aggro.location.y > 16) {
      shieldOrPlayer = this.aggro as Unit;
    }
    this.weapons["typeless"].attack(this, shieldOrPlayer, {
      attackStyle: "typeless",
      magicBaseSpellDamage: shieldOrPlayer.type === UnitTypes.PLAYER ? this.magicMaxHit() : 0,
    });
    return true;
  }

  get combatLevel() {
    return 1400;
  }

  canMove() {
    return false;
  }

  magicMaxHit() {
    return 251;
  }

  override get xpBonusMultiplier() {
    return 1.575;
  }

  setStats() {
    this.stunned = 8;

    this.weapons = {
      // sound is handled internally in ZukWeapon
      typeless: new ZukWeapon(),
    };

    // non boosted numbers
    this.stats = {
      attack: 350,
      strength: 600,
      defence: 234,
      range: 400,
      magic: 150,
      hitpoint: 1200,
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
        magic: 550,
        range: 550,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 350,
        range: 100,
      },
      other: {
        meleeStrength: 200,
        rangedStrength: 200,
        magicDamage: 4.5,
        prayer: 0,
      },
    };
  }
  get attackSpeed() {
    if (this.enraged) {
      return 7;
    }
    return 10;
  }

  attackStyleForNewAttack() {
    return "magic";
  }

  get attackRange() {
    return 0;
  }

  get size() {
    return 7;
  }

  get height() {
    return 4;
  }

  get image() {
    return ZukImage;
  }

  hitSound(damaged) {
    return new Sound(HitSound, 0.1);
  }

  attackAnimation(tickPercent: number, context: OffscreenCanvasRenderingContext2D) {
    context.transform(1, 0, Math.sin(-tickPercent * Math.PI * 2) / 2, 1, 0, 0);
  }

  drawOverTile(tickPercent: number, context: OffscreenCanvasRenderingContext2D, scale: number) {
    super.drawOverTile(tickPercent, context, scale);
    // Draw mob
  }

  create3dModel(): Model {
    return GLTFModel.forRenderable(this, ZukModel);
  }

  getPerceivedRotation(tickPercent: any) {
    // zuk doesn't rotate for some reason
    return -Math.PI / 2;
  }

  drawUILayer(tickPercent, offset, context, scale, hitsplatsAbove) {
    super.drawUILayer(tickPercent, offset, context, scale, hitsplatsAbove);

    context.fillStyle = "#FFFF00";
    context.font = "24px OSRS";

    context.fillText(String(this.currentStats.hitpoint), offset.x, offset.y + 120);
  }

  async preload() {
    await super.preload();
    await GLTFModel.preload(RangerModel);
    await GLTFModel.preload(MagerModel);
    await GLTFModel.preload(JadModel);
  }

  get deathAnimationLength() {
    return 6;
  }

  get attackAnimationId() {
    return 1;
  }

  override get deathAnimationId() {
    return 3;
  }
}
