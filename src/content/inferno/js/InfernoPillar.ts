"use strict";
import { filter, remove } from "lodash";
import { Settings } from "../../../sdk/Settings";
import { Entity } from "../../../sdk/Entity";

import MissSplat from "../../../assets/images/hitsplats/miss.png";
import DamageSplat from "../../../assets/images/hitsplats/damage.png";
import { UnitBonuses, UnitStats } from "../../../sdk/Unit";
import { Projectile } from "../../../sdk/weapons/Projectile";
import { Location } from "../../../sdk/Location";
import { ImageLoader } from "../../../sdk/utils/ImageLoader";
import { DelayedAction } from "../../../sdk/DelayedAction";
import { Region } from "../../../sdk/Region";
import { Model } from "../../../sdk/rendering/Model";
import { BasicModel } from "../../../sdk/rendering/BasicModel";
import { EntityName } from "../../../sdk/EntityName";

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

  drawUILayer() {
    this.region.context.save();

    this.region.context.translate(
      this.location.x * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (this.location.y + 1) * Settings.tileSize - (this.size * Settings.tileSize) / 2,
    );

    if (Settings.rotated === "south") {
      this.region.context.rotate(Math.PI);
    }

    this.region.context.fillStyle = "red";
    this.region.context.fillRect(
      (-this.size / 2) * Settings.tileSize,
      (-this.size / 2) * Settings.tileSize,
      Settings.tileSize * this.size,
      5,
    );

    this.region.context.fillStyle = "green";
    const w = (this.currentStats.hitpoint / this.stats.hitpoint) * (Settings.tileSize * this.size);
    this.region.context.fillRect((-this.size / 2) * Settings.tileSize, (-this.size / 2) * Settings.tileSize, w, 5);

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

      this.region.context.drawImage(
        image,
        projectile.offsetX - 12,
        -((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY,
        24,
        23,
      );
      this.region.context.fillStyle = "#FFFFFF";
      this.region.context.font = "16px Stats_11";
      this.region.context.textAlign = "center";
      this.region.context.fillText(
        String(projectile.damage),
        projectile.offsetX,
        -((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY + 15,
      );
      this.region.context.textAlign = "left";
    });
    this.region.context.restore();
  }

  entityName(): EntityName {
    return EntityName.PILLAR;
  }

  get size() {
    return 3;
  }

  get height() {
    return 10;
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
