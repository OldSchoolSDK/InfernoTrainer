"use strict";

import { remove } from "lodash";
import { Entity } from "./Entity";
import { Item } from "./Item";
import { Mob } from "./Mob";
import { Player } from "./Player";
import { Settings } from "./Settings";
import { Unit } from "./Unit";
import { World } from "./World";
import { Projectile } from "./weapons/Projectile";

interface GroundYItems {
  [key: number]: Item[];
}

export interface GroundItems {
  [key: number]: GroundYItems;
}

export enum CardinalDirection {
  NORTH,
  SOUTH,
}

// Base class for any trainer region.
export abstract class Region {
  canvas: OffscreenCanvas;

  players: Player[] = [];

  world: World;

  newMobs: Mob[] = [];
  mobs: Mob[] = [];
  entities: Entity[] = [];
  // free-floating projectiles not associated with a mob/player. TODO maybe they all should be here.
  projectiles: Projectile[] = [];

  mapImage: HTMLImageElement;

  groundItems: GroundItems = {};

  _serialNumber: string;
  get serialNumber(): string {
    if (!this._serialNumber) {
      this._serialNumber = String(Math.random());
    }
    return this._serialNumber;
  }

  get initialFacing(): CardinalDirection {
    return CardinalDirection.SOUTH;
  }

  midTick() {
    // Override me
  }

  postTick() {
    // Override me
  }

  addPlayer(player: Player) {
    this.players.push(player);
    player.addedToWorld();
  }

  rightClickActions() {
    return [];
  }

  get context() {
    if (!this.canvas) {
      if (Settings.mobileCheck()) {
        this.canvas = new OffscreenCanvas(2000, 2000);
      } else {
        this.canvas = new OffscreenCanvas(10000, 10000);
      }
    }
    return this.canvas.getContext("2d");
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  removeEntity(entity: Entity) {
    entity.dying = 0;
    remove(this.entities, entity);
  }

  addMob(mob: Mob) {
    if (!mob.region.world) {
      this.mobs.push(mob);
      mob.addedToWorld();
    } else {
      this.newMobs.push(mob);
    }
  }

  removeMob(mob: Mob) {
    remove(this.mobs, mob);
  }
  removePlayer(player: Player) {
    remove(this.players, player);
  }
  addGroundItem(player: Player, item: Item, x: number, y: number) {
    if (!this.groundItems[x]) {
      this.groundItems[x] = {};
    }
    if (!this.groundItems[x][y]) {
      this.groundItems[x][y] = [];
    }

    item.groundLocation = { x: player.location.x, y: player.location.y };
    this.groundItems[x][y].push(item);
  }

  addProjectile(projectile: Projectile) {
    this.projectiles.push(projectile);
  }

  removeProjectile(projectile: Projectile) {
    remove(this.projectiles, projectile);
  }

  getName(): string {
    return "My Region";
  }

  get width(): number {
    return 0;
  }

  get height(): number {
    return 0;
  }

  mapImagePath(): string {
    return "";
  }

  drawWorldBackground(context: OffscreenCanvasRenderingContext2D, scale: number) {
    // Override me
  }

  drawDefaultFloor() {
    return true;
  }

  groundItemsAtLocation(x: number, y: number) {
    return (this.groundItems[x] ? this.groundItems[x][y] : []) || [];
  }

  removeGroundItem(item: Item, x: number, y: number) {
    if (this.groundItems[x]) {
      if (this.groundItems[x][y]) {
        remove(this.groundItems[x][y], item);
      }
    }
  }

  drawGroundItems(ctx: OffscreenCanvasRenderingContext2D) {
    Object.entries(this.groundItems).forEach((scope1: [string, string]) => {
      const x = parseInt(scope1[0]);
      Object.entries(this.groundItems[x]).forEach((scope2: [string, string]) => {
        const y = parseInt(scope2[0]);
        const items = this.groundItems[x][y];
        items.forEach((item: Item) => {
          ctx.drawImage(
            item.inventorySprite,
            x * Settings.tileSize,
            y * Settings.tileSize,
            Settings.tileSize,
            Settings.tileSize,
          );
        });
      });
    });
  }

  abstract initialiseRegion(): { player: Player };

  getSidebarContent(): string {
    return "Nothing to see here";
  }

  // calls preload on all renderable children
  async preload() {
    await Promise.all(this.entities.map((entity) => entity.preload()));
    await Promise.all(this.mobs.map((mob) => mob.preload()));
    await Promise.all(this.newMobs.map((mob) => mob.preload()));
    await Promise.all(this.players.map((players) => players.preload()));
  }
}
