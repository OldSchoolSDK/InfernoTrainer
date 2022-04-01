'use strict'

import { remove } from "lodash";
import { Entity } from "./Entity";
import { Item } from "./Item"
import { Mob } from "./Mob";
import { Settings } from "./Settings";
import { Unit } from "./Unit";
import { World } from "./World"


interface GroundYItems {
  [key: number]: Item[]
}

export interface GroundItems {
  [key: number]: GroundYItems
}


// Base class for any trainer region.
export class Region{
  canvas: OffscreenCanvas;

  world: World;

  newMobs: Mob[] = [];
  mobs: Mob[] = [];
  entities: Entity[] = [];
  
  mapImage: HTMLImageElement;

  groundItems: GroundItems = { }

  get context() {
    if (!this.canvas) {
      this.canvas = new OffscreenCanvas(10000, 10000);
    }
    return this.canvas.getContext('2d');
  }

  addEntity (entity: Entity) {
    this.entities.push(entity)
  }

  removeEntity (entity: Entity) {
    remove(this.entities, entity)
  }

  addMob (mob: Mob) {
    if (this.world.tickCounter === 0) {
      this.mobs.push(mob)
    }else{
      this.newMobs.push(mob)
    }
  }

  removeMob (mob: Unit) {
    remove(this.mobs, mob)
  }

  addGroundItem(world: World, item: Item, x: number, y: number) {
    if (!this.groundItems[x]) {
      this.groundItems[x] = {};
    }
    if (!this.groundItems[x][y]) {
      this.groundItems[x][y] = [];
    }

    item.groundLocation = { x:  world.player.location.x, y:  world.player.location.y };
    this.groundItems[x][y].push(item);
  }

  getName (): string {
    return 'My Region'
  }

  get width (): number {
    return 0
  }

  get height (): number {
    return 0
  }

  mapImagePath (): string {
    return ''
  }

  // Spawn entities, NPCs, player and initialize any extra UI controls.
  initialize (world: World) {
    this.world = world;
  }

  drawWorldBackground(ctx: OffscreenCanvasRenderingContext2D) {

  }
  groundItemsAtLocation(x: number, y: number) {
    return (this.groundItems[x] ? this.groundItems[x][y] : []) || [];
  }

  removeGroundItem(item: Item, x: number, y: number) {
    if (this.groundItems[x]){
      if (this.groundItems[x][y]){
        remove(this.groundItems[x][y], item);
      }
    }
  }

  drawGroundItems(ctx: OffscreenCanvasRenderingContext2D) {
    Object.entries(this.groundItems).forEach((scope1: [string, any]) => {
      const x = parseInt(scope1[0]);
      Object.entries(this.groundItems[x]).forEach((scope2: [string, any]) => {
        const y = parseInt(scope2[0]);
        const items = this.groundItems[x][y];
        items.forEach((item: Item) => {
          ctx.drawImage(
            item.inventorySprite, 
            x * Settings.tileSize, 
            y * Settings.tileSize,
            Settings.tileSize,
            Settings.tileSize
          )
        })
      })
    })
  }
}
