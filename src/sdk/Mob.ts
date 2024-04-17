"use strict";
import { every } from "lodash";

import { Settings } from "./Settings";
import { LineOfSight } from "./LineOfSight";
import { Pathing } from "./Pathing";

import { Weapon } from "./gear/Weapon";
import { Unit, UnitBonuses, UnitOptions, UnitStats, UnitTypes } from "./Unit";
import { Location } from "./Location";
import { Collision } from "./Collision";
import { SoundCache } from "./utils/SoundCache";
import { Viewport } from "./Viewport";
import { Random } from "./Random";
import { Region } from "./Region";
import { CanvasSpriteModel } from "./rendering/CanvasSpriteModel";
import { Model } from "./rendering/Model";

export enum AttackIndicators {
  NONE = 0,
  HIT = 1,
  BLOCKED = 2,
  SCAN = 3,
}

export interface WeaponsMap {
  [key: string]: Weapon;
}

export class Mob extends Unit {
  static mobIdTracker = 0;
  mobId: number = Mob.mobIdTracker++;
  hasResurrected = false;
  attackFeedback: AttackIndicators;
  stats: UnitStats;
  currentStats: UnitStats;
  hadLOS: boolean;
  hasLOS: boolean;
  weapons: WeaponsMap;
  attackStyle: string;
  tcc: Location[];
  removableWithRightClick = false;

  constructor(region: Region, location: Location, options?: UnitOptions) {
    super(region, location, options);
  }

  override get type() {
    return UnitTypes.MOB;
  }

  canBeAttacked() {
    return true;
  }

  override setStats() {
    // non boosted numbers
    this.stats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99,
    };

    // with boosts
    this.currentStats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99,
    };
  }

  override get bonuses(): UnitBonuses {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
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
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0,
      },
    };
  }

  override movementStep() {
    if (this.dying === 0) {
      return;
    }
    this.processIncomingAttacks();

    this.spawnDelay--;
    if (this.spawnDelay > 0) {
      return;
    }
    this.perceivedLocation = { x: this.location.x, y: this.location.y };

    this.setHasLOS();
    if (this.canMove() && this.aggro) {
      let dx = this.location.x + Math.sign(this.aggro.location.x - this.location.x);
      let dy = this.location.y + Math.sign(this.aggro.location.y - this.location.y);

      if (
        Collision.collisionMath(
          this.location.x,
          this.location.y,
          this.size,
          this.aggro.location.x,
          this.aggro.location.y,
          1,
        )
      ) {
        // Random movement if player is under the mob.
        if (Random.get() < 0.5) {
          dy = this.location.y;
          if (Random.get() < 0.5) {
            dx = this.location.x + 1;
          } else {
            dx = this.location.x - 1;
          }
        } else {
          dx = this.location.x;
          if (Random.get() < 0.5) {
            dy = this.location.y + 1;
          } else {
            dy = this.location.y - 1;
          }
        }
      } else if (Collision.collisionMath(dx, dy, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
        // allows corner safespotting
        dy = this.location.y;
      }

      if (this.attackDelay > this.attackSpeed) {
        // No movement right after melee dig. 8 ticks after the dig it should be able to move again.
        dx = this.location.x;
        dy = this.location.y;
      }

      const xOff = dx - this.location.x;
      const yOff = this.location.y - dy;

      let xTiles = this.getXMovementTiles(xOff, yOff);
      let yTiles = this.getYMovementTiles(xOff, yOff);
      let xSpace = every(
        xTiles.map((location: Location) =>
          Pathing.canTileBePathedTo(this.region, location.x, location.y, 1, this.consumesSpace as Mob),
        ),
        Boolean,
      );
      let ySpace = every(
        yTiles.map((location: Location) =>
          Pathing.canTileBePathedTo(this.region, location.x, location.y, 1, this.consumesSpace as Mob),
        ),
        Boolean,
      );
      const both = xSpace && ySpace;

      // if (this.mobName() === EntityName.JAL_AK){
      //   this.tcc =  xTiles; //xTiles.concat(yTiles);
      // }

      if (!both) {
        xTiles = this.getXMovementTiles(xOff, 0);
        xSpace = every(
          xTiles.map((location: Location) =>
            Pathing.canTileBePathedTo(this.region, location.x, location.y, 1, this.consumesSpace as Mob),
          ),
          Boolean,
        );
        if (!xSpace) {
          yTiles = this.getYMovementTiles(0, yOff);
          ySpace = every(
            yTiles.map((location: Location) =>
              Pathing.canTileBePathedTo(this.region, location.x, location.y, 1, this.consumesSpace as Mob),
            ),
            Boolean,
          );
        }
      }

      if (both) {
        this.location.x = dx;
        this.location.y = dy;
      } else if (xSpace) {
        this.location.x = dx;
      } else if (ySpace) {
        this.location.y = dy;
      }
    }
  }

  getXMovementTiles(xOff: number, yOff: number) {
    const start = yOff === -1 ? -1 : 0;
    const end = yOff === 1 ? this.size + 1 : this.size;
    const xTiles = [];
    if (xOff === -1) {
      for (let i = start; i < end; i++) {
        xTiles.push({
          x: this.location.x - 1,
          y: this.location.y - i,
        });
      }
    } else if (xOff === 1) {
      for (let i = start; i < end; i++) {
        xTiles.push({
          x: this.location.x + this.size,
          y: this.location.y - i,
        });
      }
    }
    return xTiles;
  }

  getYMovementTiles(xOff: number, yOff: number) {
    const start = xOff === -1 ? -1 : 0;
    const end = xOff === 1 ? this.size + 1 : this.size;

    const yTiles = [];
    if (yOff === -1) {
      // south
      for (let i = start; i < end; i++) {
        yTiles.push({
          x: this.location.x + i,
          y: this.location.y + 1,
        });
      }
    } else if (yOff === 1) {
      // north
      for (let i = start; i < end; i++) {
        yTiles.push({
          x: this.location.x + i,
          y: this.location.y - this.size,
        });
      }
    }

    return yTiles;
  }
  // todo: Rename this possibly? it returns the attack style if it's possible
  canMeleeIfClose(): "slash" | "crush" | "stab" | "" {
    return "";
  }

  override attackStep() {
    super.attackStep();

    if (this.spawnDelay > 0) {
      return;
    }
    if (this.dying === 0) {
      return;
    }

    this.attackIfPossible();
    this.detectDeath();

    this.frozen--;
    this.stunned--;
  }

  attackStyleForNewAttack() {
    return "slash";
  }

  attackIfPossible() {
    this.hadLOS = this.hasLOS;
    this.setHasLOS();

    if (this.canAttack() === false) {
      return;
    }

    this.attackStyle = this.attackStyleForNewAttack();

    const weaponIsAreaAttack = this.weapons[this.attackStyle].isAreaAttack;
    let isUnderAggro = false;
    if (!weaponIsAreaAttack) {
      isUnderAggro = Collision.collisionMath(
        this.location.x,
        this.location.y,
        this.size,
        this.aggro.location.x,
        this.aggro.location.y,
        1,
      );
    }
    this.attackFeedback = AttackIndicators.NONE;

    if (!isUnderAggro && this.hasLOS && this.attackDelay <= 0) {
      this.attack() && this.didAttack();
    }
  }

  magicMaxHit() {
    return 0;
  }

  attack() {
    if (this.aggro.dying >= 0) {
      return false;
    }
    if (this.canMeleeIfClose() && Weapon.isMeleeAttackStyle(this.attackStyle) === false) {
      if (this.isWithinMeleeRange() && Random.get() < 0.5) {
        this.attackStyle = this.canMeleeIfClose();
      }
    }

    if (
      this.weapons[this.attackStyle].isBlockable(this, this.aggro, {
        attackStyle: this.attackStyle,
      })
    ) {
      this.attackFeedback = AttackIndicators.BLOCKED;
    } else {
      this.attackFeedback = AttackIndicators.HIT;
    }
    this.weapons[this.attackStyle].attack(this, this.aggro as Unit /* hack */, {
      attackStyle: this.attackStyle,
      magicBaseSpellDamage: this.magicMaxHit(),
    });

    return true;
  }

  get consumesSpace(): Unit {
    return this;
  }

  override playAttackSound() {
    if (Settings.playsAudio && this.sound) {
      let attemptedVolume =
        1 /
        Pathing.dist(
          Viewport.viewport.player.location.x,
          Viewport.viewport.player.location.y,
          this.location.x,
          this.location.y,
        );
      attemptedVolume = Math.min(1, Math.max(0, Math.sqrt(attemptedVolume)));
      SoundCache.play({
        src: this.sound.src,
        volume: attemptedVolume * this.sound.volume,
      });
    }
  }

  override get combatLevel() {
    return 99;
  }

  override contextActions(region: Region, x: number, y: number) {
    const actions = [
      {
        text: [
          { text: "Attack ", fillStyle: "white" },
          { text: this.mobName(), fillStyle: "yellow" },
          {
            text: ` (level ${this.combatLevel})`,
            fillStyle: Viewport.viewport.player.combatLevelColor(this),
          },
        ],
        action: () => {
          Viewport.viewport.clickController.redClick();
          Viewport.viewport.clickController.sendToServer(() =>
            Viewport.viewport.clickController.playerAttackClick(this),
          );
        },
      },
    ];

    // hack hack hack

    if (this.removableWithRightClick) {
      actions.push({
        text: [
          { text: "Remove ", fillStyle: "white" },
          { text: this.mobName(), fillStyle: "yellow" },
          {
            text: ` (level ${this.combatLevel})`,
            fillStyle: Viewport.viewport.player.combatLevelColor(this),
          },
        ],
        action: () => {
          this.region.removeMob(this);
        },
      });
    }

    return actions;
  }

  drawOverTile(tickPercent: number, context: OffscreenCanvasRenderingContext2D, scale) {
    // Override me
  }

  drawUnderTile(tickPercent: number, context: OffscreenCanvasRenderingContext2D, scale) {
    context.fillStyle = "#00000000";
    if (Settings.displayFeedback) {
      if (this.dying > -1) {
        context.fillStyle = "#964B0073";
      } else if (this.attackFeedback === AttackIndicators.BLOCKED) {
        context.fillStyle = "#00FF0073";
      } else if (this.attackFeedback === AttackIndicators.HIT) {
        context.fillStyle = "#FF000073";
      } else if (this.attackFeedback === AttackIndicators.SCAN) {
        context.fillStyle = "#FFFF0073";
      } else if (this.hasLOS) {
        context.fillStyle = "#FF730073";
      } else {
        context.fillStyle = this.color;
      }
    }
    // Draw mob
    context.fillRect(-(this.size * scale) / 2, -(this.size * scale) / 2, this.size * scale, this.size * scale);
  }

  override draw(
    tickPercent: number,
    context: OffscreenCanvasRenderingContext2D,
    offset: Location,
    scale: number,
    drawUnderTile: boolean,
  ) {
    super.draw(tickPercent, context, offset, scale, drawUnderTile);
    if (Settings.displayMobLoS) {
      LineOfSight.drawLOS(
        this.region,
        this.location.x,
        this.location.y,
        this.size,
        this.attackRange,
        "#FF000055",
        this.type === UnitTypes.MOB,
      );
    }

    const perceivedX = offset.x;
    const perceivedY = offset.y;
    context.save();
    context.translate(
      perceivedX * scale + (this.size * scale) / 2,
      (perceivedY - this.size + 1) * scale + (this.size * scale) / 2,
    );

    if (drawUnderTile) {
      this.drawUnderTile(tickPercent, context, scale);
    }
    const currentImage = this.unitImage;

    if (Settings.rotated === "south") {
      context.rotate(Math.PI);
    }
    if (Settings.rotated === "south") {
      context.scale(-1, 1);
    }

    context.save();
    if (this.shouldShowAttackAnimation()) {
      this.attackAnimation(tickPercent, context);
    }

    if (currentImage) {
      context.drawImage(
        currentImage,
        -(this.size * scale) / 2,
        -(this.size * scale) / 2,
        this.size * scale,
        this.size * scale,
      );
    }

    context.restore();

    if (Settings.rotated === "south") {
      context.scale(-1, 1);
    }

    this.drawOverTile(tickPercent, context, scale);

    if (this.aggro) {
      const unit = this.aggro as Unit;

      if (
        LineOfSight.playerHasLineOfSightOfMob(
          this.region,
          this.aggro.location.x,
          this.aggro.location.y,
          this,
          unit.attackRange,
        )
      ) {
        context.strokeStyle = "#00FF0073";
        context.lineWidth = 1;
        context.strokeRect(-(this.size * scale) / 2, -(this.size * scale) / 2, this.size * scale, this.size * scale);
      }
    }

    context.restore();

    if (!this.tcc) {
      return;
    }
    // if (this.mobName() !== EntityName.JAL_AK) {
    //   return;
    // }
    // if (this.mobId !== 4) {
    //   return;
    // }
    /*this.tcc.forEach((location: Location) => {
      context.fillStyle = "#00FF0073";
      context.fillRect(location.x * scale, location.y * scale, scale, scale);
    });*/
  }
  override drawUILayer(tickPercent, offset, context, scale, hitsplatsAbove) {
    context.save();
    context.translate(offset.x, offset.y);
    if (Settings.rotated === "south") {
      context.rotate(Math.PI);
    }

    this.drawHPBar(context, scale);
    this.drawHitsplats(context, scale, hitsplatsAbove);
    this.drawOverheadPrayers(context, scale);

    context.restore();
  }

  override create3dModel(): Model {
    return CanvasSpriteModel.forRenderable(this);
  }

  override get color() {
    return "#FF0000";
  }
}
