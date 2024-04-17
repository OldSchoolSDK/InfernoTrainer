import { filter } from "lodash";
import { Entity } from "./Entity";
import { LineOfSightMask } from "./LineOfSight";
import { Mob } from "./Mob";
import { Pathing } from "./Pathing";
import { Player } from "./Player";
import { Region } from "./Region";
import { Settings } from "./Settings";
import { Unit } from "./Unit";

export enum CollisionType {
  NONE = 0,
  BLOCK_MOVEMENT = 1,
}

export class Collision {
  static collisionMath(x: number, y: number, s: number, x2: number, y2: number, s2: number) {
    return !(x > x2 + s2 - 1 || x + s - 1 < x2 || y - s + 1 > y2 || y < y2 - s2 + 1);
  }

  // include the outer boundary - used for precision checks with perceivedLocation
  static collisionMathInclusive(x: number, y: number, s: number, x2: number, y2: number, s2: number) {
    return !(x > x2 + s2 || x + s - 1 < x2 || y - s > y2 || y < y2 - s2 + 1);
  }

  // Mob collision

  static collidesWithMob(region: Region, x: number, y: number, s: number, mob: Unit) {
    return Collision.collisionMath(x, y, s, mob.location.x, mob.location.y, mob.size);
  }

  static collidesWithAnyMobs(region: Region, x: number, y: number, s: number, mobToAvoid: Unit = null) {
    for (let i = 0; i < region.mobs.length; i++) {
      if (region.mobs[i] === mobToAvoid) {
        continue;
      }

      const collidedWithSpecificMob = Collision.collidesWithMob(region, x, y, s, region.mobs[i]);

      if (collidedWithSpecificMob && region.mobs[i].consumesSpace) {
        return region.mobs[i];
      }
    }
    return null;
  }

  // Entity collision

  // Same as above but only returns entities with collision enabled.
  static collideableEntitiesAtPoint(region: Region, x: number, y: number, s: number) {
    return filter(
      Pathing.entitiesAtPoint(region, x, y, s),
      (entity: Entity) => entity.collisionType != CollisionType.NONE,
    );
  }

  static collidesWithAnyEntities(region: Region, x: number, y: number, s: number) {
    for (let i = 0; i < region.entities.length; i++) {
      const entity = region.entities[i];
      if (
        entity.collisionType != CollisionType.NONE &&
        Collision.collisionMath(x, y, s, entity.location.x, entity.location.y, entity.size)
      ) {
        return true;
      }
    }
    return false;
  }

  static collidesWithAnyLoSBlockingEntities(region: Region, x: number, y: number, s: number): LineOfSightMask {
    for (let i = 0; i < region.entities.length; i++) {
      const entity = region.entities[i];
      if (Collision.collisionMath(x, y, s, entity.location.x, entity.location.y, entity.size)) {
        return entity.lineOfSight;
      }
    }
    return null;
  }

  static collidesWithAnyMobsAtPerceivedDisplayLocation(
    region: Region,
    x: number,
    y: number,
    tickPercent: number,
  ): Mob[] {
    const mobs = [];
    for (let i = 0; i < region.mobs.length; i++) {
      const collidedWithSpecificMob = Collision.collidesWithUnitAtPerceivedDisplayLocation(
        x,
        y,
        tickPercent,
        region.mobs[i],
      );
      if (collidedWithSpecificMob) {
        mobs.push(region.mobs[i]);
      }
    }
    return mobs;
  }

  static collidesWithUnitAtPerceivedDisplayLocation(x: number, y: number, tickPercent: number, unit: Unit) {
    const { x: perceivedX, y: perceivedY } = unit.getPerceivedLocation(tickPercent);
    // WTF
    return Collision.collisionMathInclusive(x, y, 1.0, perceivedX, perceivedY, unit.size);
  }

  static collidesWithAnyPlayersAtPerceivedDisplayLocation(
    region: Region,
    x: number,
    y: number,
    tickPercent: number,
  ): Player[] {
    const players = [];
    for (let i = 0; i < region.players.length; i++) {
      const collidedWithSpecificPlayer = Collision.collidesWithUnitAtPerceivedDisplayLocation(
        x,
        y,
        tickPercent,
        region.players[i],
      );
      if (collidedWithSpecificPlayer) {
        players.push(region.players[i]);
      }
    }
    return players;
  }
}
