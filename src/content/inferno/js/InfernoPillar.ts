"use strict";
import { Entity, Projectile, UnitBonuses, Region, Settings, DelayedAction, Model, ImageLoader, Location, EntityNames, UnitStats, BasicModel, Assets } from "@supalosa/oldschool-trainer-sdk";


import { filter, remove } from "lodash";

const MissSplat = Assets.getAssetUrl("assets/images/hitsplats/miss.png");
const DamageSplat = Assets.getAssetUrl("assets/images/hitsplats/damage.png");


export class InfernoPillar extends Entity {
  incomingProjectiles: Projectile[] = [];
  missedHitsplatImage: HTMLImageElement;
  damageHitsplatImage: HTMLImageElement;
  stats: UnitStats;
  currentStats: UnitStats;
  bonuses: UnitBonuses;

  constructor(region: Region, point: Location) {
    super(region, point);

    this.missedHitsplatImage = ImageLoader.createImage(MissSplat);
    this.damageHitsplatImage = ImageLoader.createImage(DamageSplat);

    // non boosted numbers
    this.stats = {
      attack: 0,
      strength: 0,
      defence: 0,
      range: 0,
      magic: 0,
      hitpoint: 255,
    };

    // with boosts
    this.currentStats = {
      attack: 0,
      strength: 0,
      defence: 0,
      range: 0,
      magic: 0,
      hitpoint: 255,
    };

    this.bonuses = {
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
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  tick() {
    this.incomingProjectiles = filter(
      this.incomingProjectiles,
      (projectile: Projectile) => projectile.remainingDelay > -1,
    );

    this.incomingProjectiles.forEach((projectile) => {
      projectile.remainingDelay--;
      if (projectile.remainingDelay <= 0) {
        this.currentStats.hitpoint -= projectile.damage;
      }
    });
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint);

    if (this.currentStats.hitpoint <= 0) {
      return this.dead();
    }
  }

  draw() {
    this.region.context.fillStyle = "#000073";

    this.region.context.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize,
    );
  }

  drawUILayer(
    tickPercent: number,
    screenPosition: Location,
    context: OffscreenCanvasRenderingContext2D,
    scale: number,
    hitsplatAbove) {
    context.save();

    context.translate(screenPosition.x, screenPosition.y);

    if (Settings.rotated === "south") {
      context.rotate(Math.PI);
    }

    context.fillStyle = "red";
    context.fillRect(
      (-this.size / 2) * Settings.tileSize,
      hitsplatAbove ? (-this.size / 2) * Settings.tileSize : 0,
      Settings.tileSize * this.size,
      5,
    );

    context.fillStyle = "lime";
    const w = (this.currentStats.hitpoint / this.stats.hitpoint) * (Settings.tileSize * this.size);
    context.fillRect((-this.size / 2) * Settings.tileSize, hitsplatAbove ? (-this.size / 2) * Settings.tileSize : 0, w, 5);

    let projectileOffsets: number[][] = [
      [0, 0],
      [0, -16],
      [-12, -8],
      [12, -8],
    ];

    let projectileCounter = 0;
    this.incomingProjectiles.forEach((projectile) => {
      if (projectile.remainingDelay > 0) {
        return;
      }
      if (projectileCounter > 3) {
        return;
      }
      projectileCounter++;
      const image = projectile.damage === 0 ? this.missedHitsplatImage : this.damageHitsplatImage;
      if (!projectile.offsetX && !projectile.offsetY) {
        projectile.offsetX = projectileOffsets[0][0];
        projectile.offsetY = projectileOffsets[0][1];
      }

      projectileOffsets = remove(projectileOffsets, (offset: number[]) => {
        return offset[0] !== projectile.offsetX || offset[1] !== projectile.offsetY;
      });

      const posMult = hitsplatAbove ? -1 : 1;

      context.drawImage(
        image,
        projectile.offsetX - 12,
        posMult * ((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY,
        24,
        23,
      );
      context.fillStyle = "#FFFFFF";
      context.font = "16px Stats_11";
      context.textAlign = "center";
      context.fillText(
        String(projectile.damage),
        projectile.offsetX,
        posMult * ((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY + 15,
      );
      context.textAlign = "left";
    });
    context.restore();
  }

  entityName() {
    return EntityNames.PILLAR;
  }

  get size() {
    return 3;
  }

  get height() {
    return 6;
  }

  get color() {
    return "#333333";
  }

  dead() {
    this.dying = 2;
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        this.region.removeEntity(this);
      }, 2),
    );
    // TODO: needs to AOE the nibblers around it
  }

  addProjectile(projectile: Projectile) {
    this.incomingProjectiles.push(projectile);
  }

  static addPillarsToWorld(region: Region, southPillar: boolean, westPillar: boolean, northPillar: boolean) {
    if (southPillar) {
      region.addEntity(new InfernoPillar(region, { x: 21, y: 37 }));
    }
    if (westPillar) {
      region.addEntity(new InfernoPillar(region, { x: 11, y: 23 }));
    }
    if (northPillar) {
      region.addEntity(new InfernoPillar(region, { x: 28, y: 21 }));
    }
  }

  create3dModel(): Model {
    return BasicModel.forRenderable(this);
  }
}
