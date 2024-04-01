"use strict";

import { MagicWeapon } from "../../../../sdk/weapons/MagicWeapon";
import { MeleeWeapon } from "../../../../sdk/weapons/MeleeWeapon";
import { AttackIndicators, Mob } from "../../../../sdk/Mob";
import { RangedWeapon } from "../../../../sdk/weapons/RangedWeapon";
import JadImage from "../../assets/images/jad/jad_mage_1.png";
import JadMage from "../../assets/images/jad_mage.gif";
import JadRange from "../../assets/images/jad_range.gif";
import { Unit, UnitBonuses, UnitOptions } from "../../../../sdk/Unit";
import { Location } from "../../../../sdk/Location";
import { AttackBonuses } from "../../../../sdk/gear/Weapon";
import { Projectile } from "../../../../sdk/weapons/Projectile";
import { DelayedAction } from "../../../../sdk/DelayedAction";
import { YtHurKot } from "./YtHurKot";
import { Collision } from "../../../../sdk/Collision";
import { EntityName } from "../../../../sdk/EntityName";

import MagicSound from "../../assets/sounds/TzTok-Jad-Magic-attack.ogg";
import RangeSound from "../../assets/sounds/TzTok-Jad-Ranged-attack.ogg";
import { Random } from "../../../../sdk/Random";
import { Region } from "../../../../sdk/Region";
import { ImageLoader } from "../../../../sdk/utils/ImageLoader";
import { JAD_FRAMES_PER_TICK, JAD_MAGE_FRAMES, JAD_RANGE_FRAMES } from "./JalTokJadAnim";

interface JadUnitOptions extends UnitOptions {
  attackSpeed: number;
  stun: number;
  healers: number;
  isZukWave: boolean;
}

class JadMagicWeapon extends MagicWeapon {
  attack(from: Mob, to: Unit, bonuses: AttackBonuses = {}): boolean {
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        const overhead = to.prayerController.matchFeature("magic");
        from.attackFeedback = AttackIndicators.HIT;
        if (overhead) {
          from.attackFeedback = AttackIndicators.BLOCKED;
        }

        super.attack(from, to, bonuses);
      }, 3)
    );
    return true;
  }

  registerProjectile(from: Unit, to: Unit) {
    to.addProjectile(
      new Projectile(this, this.damage, from, to, "magic", { reduceDelay: 3 })
    );
  }
}
class JadRangeWeapon extends RangedWeapon {
  attack(from: Mob, to: Unit, bonuses: AttackBonuses = {}): boolean {
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        const overhead = to.prayerController.matchFeature("range");
        from.attackFeedback = AttackIndicators.HIT;
        if (overhead) {
          from.attackFeedback = AttackIndicators.BLOCKED;
        }

        super.attack(from, to, bonuses);
      }, 3)
    );
    return true;
  }

  registerProjectile(from: Unit, to: Unit) {
    to.addProjectile(
      new Projectile(this, this.damage, from, to, "range", { reduceDelay: 3 })
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

  mobName(): EntityName {
    return EntityName.JAL_TOK_JAD;
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

          while (
            Collision.collidesWithMob(
              this.region,
              this.location.x + xOff,
              this.location.y + yOff,
              1,
              this
            )
          ) {
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
            { aggro: this }
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
    return 15;
  }

  get size() {
    return 5;
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

  get sound() {
    return this.attackStyle === "magic" ? MagicSound : RangeSound;
  }

  attackStyleForNewAttack() {
    return Random.get() < 0.5 ? "range" : "magic";
  }

  attackAnimation(tickPercent: number) {
    if (this.attackStyle === "magic") {
      this.region.context.rotate(tickPercent * Math.PI * 2);
    } else {
      this.region.context.rotate(Math.sin(-tickPercent * Math.PI));
    }
  }

  shouldShowAttackAnimation() {
    return (
      this.attackDelay === this.attackSpeed && this.playerPrayerScan === null
    );
  }

  canMeleeIfClose() {
    return "stab";
  }

  magicMaxHit() {
    return 113;
  }
  
  attackStep() {
    super.attackStep();
    this.currentAnimationTick++;
  }

  attack() {
    super.attack();
    this.attackFeedback = AttackIndicators.NONE;
    if (this.attackStyle === "magic") {
      this.currentAnimation = JAD_MAGE_FRAMES
    } else if (this.attackStyle === "range") {
      this.currentAnimation = JAD_RANGE_FRAMES;
    }
    this.currentAnimationFrame = 0;
    this.currentAnimationTick = 0;
  }

  draw(tickPercent, context, offset, scale, drawUnderTile) {
    if (this.currentAnimation) {
      this.currentAnimationFrame = (this.currentAnimationTick -1 ) * JAD_FRAMES_PER_TICK + tickPercent * JAD_FRAMES_PER_TICK;
      if (this.currentAnimationFrame >= this.currentAnimation.length) {
        this.currentAnimation = null;
        this.currentAnimationFrame = 0;
        this.currentAnimationTick = 0;
      }
  }
    super.draw(tickPercent, context, offset, scale, drawUnderTile);
  }
}
