"use strict";

import { Assets, UnitOptions, ImageLoader, Location, MultiModelProjectileOffsetInterpolator, Location3, MagicWeapon, Mob, Unit, AttackBonuses, DelayedAction, AttackIndicators, SoundCache, Projectile, ArcProjectileMotionInterpolator, RangedWeapon, FollowTargetInterpolator, Region, MeleeWeapon, Collision, Random, UnitBonuses, Sound, GLTFModel, EntityNames } from "@supalosa/oldschool-trainer-sdk";

import JadImage from "../../assets/images/jad/jad_mage_1.png";
import { YtHurKot } from "./YtHurKot";

import FireBreath from "../../assets/sounds/firebreath_159.ogg";
import FireWaveCastAndFire from "../../assets/sounds/firewave_cast_and_fire_162.ogg";
import FireWaveHit from "../../assets/sounds/firewave_hit_163.ogg";

import { JAD_FRAMES_PER_TICK, JAD_MAGE_FRAMES, JAD_RANGE_FRAMES } from "./JalTokJadAnim";

const HitSound = Assets.getAssetUrl("assets/sounds/dragon_hit_410.ogg");

export const JadModel = Assets.getAssetUrl("models/7700_33012.glb");
export const JadRangeProjectileModel = Assets.getAssetUrl("models/jad_range.glb");
export const JadMageProjectileModel1 = Assets.getAssetUrl("models/jad_mage_front.glb");
export const JadMageProjectileModel2 = Assets.getAssetUrl("models/jad_mage_middle.glb");
export const JadMageProjectileModel3 = Assets.getAssetUrl("models/jad_mage_rear.glb");

interface JadUnitOptions extends UnitOptions {
  attackSpeed: number;
  stun: number;
  healers: number;
  isZukWave: boolean;
}

const MageStartSound = { src: FireBreath, volume: 0.1 };
const RangeProjectileSound = { src: FireWaveHit, volume: 0.075 };
const MageProjectileSound = { src: FireWaveCastAndFire, volume: 0.075 };

const JAD_PROJECTILE_DELAY = 3;

// draw the projectiles forward to back
const MageOffsetInterpolator: MultiModelProjectileOffsetInterpolator ={
  interpolateOffsets: function (from, to, percent: number): Location3[] {
    const res = [
      { x: 0, y: 1.0, z: 0},
      { x: 0, y: 0.5, z: 0},
      { x: 0, y: 0, z: 0}
    ];
    return res;
  }
}

class JadMagicWeapon extends MagicWeapon {
  override attack(from: Mob, to: Unit, bonuses: AttackBonuses = {}): boolean {
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        const overhead = to.prayerController?.matchFeature("magic");
        from.attackFeedback = AttackIndicators.HIT;
        if (overhead) {
          from.attackFeedback = AttackIndicators.BLOCKED;
        }
        super.attack(from, to, bonuses);
      }, JAD_PROJECTILE_DELAY),
    );
    SoundCache.play(MageStartSound);
    return true;
  }

  registerProjectile(from: Unit, to: Unit) {
    to.addProjectile(
      new Projectile(this, this.damage, from, to, "magic", {
        reduceDelay: JAD_PROJECTILE_DELAY,
        motionInterpolator: new ArcProjectileMotionInterpolator(1),
        color: "#FFAA00",
        size: 2,
        visualHitEarlyTicks: -1,
        projectileSound: MageProjectileSound,
        models: [
          JadMageProjectileModel1,
          JadMageProjectileModel2,
          JadMageProjectileModel3,
        ],
        modelScale: 1 / 128,
        offsetsInterpolator: MageOffsetInterpolator
      }),
    );
  }
}
class JadRangeWeapon extends RangedWeapon {
  attack(from: Mob, to: Unit, bonuses: AttackBonuses = {}): boolean {
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        const overhead = to.prayerController?.matchFeature("range");
        from.attackFeedback = AttackIndicators.HIT;
        if (overhead) {
          from.attackFeedback = AttackIndicators.BLOCKED;
        }
        super.attack(from, to, bonuses);
      }, JAD_PROJECTILE_DELAY),
    );
    return true;
  }

  registerProjectile(from: Unit, to: Unit) {
    to.addProjectile(
      new Projectile(this, this.damage, from, to, "range", {
        reduceDelay: JAD_PROJECTILE_DELAY,
        model: JadRangeProjectileModel,
        modelScale: 1 / 128,
        // allows the animation to play out even after hitting
        visualHitEarlyTicks: -1,
        motionInterpolator: new FollowTargetInterpolator(),
        sound: RangeProjectileSound,
      }),
    );
  }
}

const jadMageFrames = JAD_MAGE_FRAMES.map((frame) => ImageLoader.createImage(frame));
const jadRangeFrames = JAD_RANGE_FRAMES.map((frame) => ImageLoader.createImage(frame));

export class JalTokJad extends Mob {
  playerPrayerScan?: string = null;
  waveCooldown: number;
  hasProccedHealers = false;
  healers: number;
  isZukWave: boolean;

  currentAnimationTick = 0;
  currentAnimationFrame = 0;
  currentAnimation: string[] | null = null;

  constructor(region: Region, location: Location, options: JadUnitOptions) {
    super(region, location, options);
    this.waveCooldown = options.attackSpeed;
    this.stunned = options.stun;
    this.healers = options.healers;
    this.autoRetaliate = true;
    this.isZukWave = options.isZukWave;
  }

  mobName() {
    return EntityNames.JAL_TOK_JAD;
  }

  get combatLevel() {
    return 900;
  }

  shouldChangeAggro(projectile: Projectile) {
    return this.aggro != projectile.from && this.autoRetaliate;
  }

  setStats() {
    this.weapons = {
      stab: new MeleeWeapon(),
      magic: new JadMagicWeapon(),
      range: new JadRangeWeapon(),
    };

    // non boosted numbers
    this.stats = {
      hitpoint: 350,
      attack: 750,
      strength: 1020,
      defence: 480,
      range: 1020,
      magic: 510,
    };

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats));
  }

  damageTaken() {
    if (this.currentStats.hitpoint < this.stats.hitpoint / 2) {
      if (this.hasProccedHealers === false) {
        this.autoRetaliate = false;
        this.hasProccedHealers = true;
        for (let i = 0; i < this.healers; i++) {
          // Spawn healer

          let xOff = 0;
          let yOff = 0;

          while (Collision.collidesWithMob(this.region, this.location.x + xOff, this.location.y + yOff, 1, this)) {
            if (this.isZukWave) {
              xOff = Math.floor(Random.get() * 6);
              yOff = -Math.floor(Random.get() * 4) - this.size;
            } else {
              xOff = Math.floor(Random.get() * 11) - 5;
              yOff = Math.floor(Random.get() * 15) - 5 - this.size;
            }
          }

          const healer = new YtHurKot(
            this.region,
            { x: this.location.x + xOff, y: this.location.y + yOff },
            { aggro: this },
          );
          this.region.addMob(healer);
        }
      }
    }
  }
  get bonuses(): UnitBonuses {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 100,
        range: 80,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 80,
        magicDamage: 1.75,
        prayer: 0,
      },
    };
  }

  get attackSpeed() {
    return this.waveCooldown;
  }

  get flinchDelay() {
    return 2;
  }

  get attackRange() {
    return 50;
  }

  get size() {
    return 5;
  }

  get clickboxRadius() {
    return 2.5;
  }

  get clickboxHeight() {
    return 4;
  }

  get image() {
    if (!this.currentAnimation) {
      return JadImage;
    }
    const animationLength = this.currentAnimation.length;
    return this.currentAnimation[Math.floor(this.currentAnimationFrame % animationLength)];
  }

  get isAnimated() {
    return !!this.currentAnimation;
  }

  attackStyleForNewAttack() {
    return Random.get() < 0.5 ? "range" : "magic";
  }

  shouldShowAttackAnimation() {
    return this.attackDelay === this.attackSpeed && this.playerPrayerScan === null;
  }

  canMeleeIfClose() {
    return "stab" as const;
  }

  magicMaxHit() {
    return 113;
  }

  attackStep() {
    super.attackStep();
    this.currentAnimationTick++;
  }

  hitSound(damaged) {
    return new Sound(HitSound, 0.1);
  }

  attack() {
    super.attack();
    this.attackFeedback = AttackIndicators.NONE;
    if (this.attackStyle === "magic") {
      this.currentAnimation = JAD_MAGE_FRAMES;
    } else if (this.attackStyle === "range") {
      this.currentAnimation = JAD_RANGE_FRAMES;
    }
    this.currentAnimationFrame = 0;
    this.currentAnimationTick = 0;
    return true;
  }

  draw(tickPercent, context, offset, scale, drawUnderTile) {
    if (this.currentAnimation) {
      this.currentAnimationFrame =
        (this.currentAnimationTick - 1) * JAD_FRAMES_PER_TICK + tickPercent * JAD_FRAMES_PER_TICK;
      if (this.currentAnimationFrame >= this.currentAnimation.length) {
        this.currentAnimation = null;
        this.currentAnimationFrame = 0;
        this.currentAnimationTick = 0;
      }
    }
    super.draw(tickPercent, context, offset, scale, drawUnderTile);
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, JadModel);
  }

  get attackAnimationId() {
    switch (this.attackStyle) {
      case "magic":
        return 2;
      case "range":
        return 3;
      default:
        return 4;
    }
  }

  override get deathAnimationId() {
    return 6;
  }
}
