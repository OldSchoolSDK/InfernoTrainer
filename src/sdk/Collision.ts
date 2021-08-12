import { filter } from 'lodash';
import { GameObject } from './GameObject'
import { LineOfSightMask } from './LineOfSight';
import { Mob } from './Mob';
import { Pathing } from './Pathing';
import { Settings } from './Settings';
import { Unit } from './Unit';
import { World } from './World'


export enum CollisionType {
  NONE = 0,
  BLOCK_MOVEMENT = 1,
}

export class Collision {

  static collisionMath (x: number, y: number, s: number, x2: number, y2: number, s2: number) {
    return !(x > (x2 + s2 - 1) || (x + s - 1) < x2 || (y - s + 1) > y2 || y < (y2 - s2 + 1))
  }


  // Mob collision
  
  static collidesWithMob (world: World, x: number, y: number, s: number, mob: GameObject) {
    return (Collision.collisionMath(x, y, s, mob.location.x, mob.location.y, mob.size))
  }

  static collidesWithAnyMobs (world: World, x: number, y: number, s: number, mobToAvoid: GameObject = null) {
    for (let i = 0; i < world.region.mobs.length; i++) {
      if (world.region.mobs[i] === mobToAvoid) {
        continue
      }

      const collidedWithSpecificMob = Collision.collidesWithMob(world, x, y, s, world.region.mobs[i])

      if (collidedWithSpecificMob && world.region.mobs[i].consumesSpace) {
        return world.region.mobs[i]
      }
    }
    return null
  }


  // Entity collision

  // Same as above but only returns entities with collision enabled.
  static collideableEntitiesAtPoint(world: World, x: number, y: number, s: number) {
    return filter(Pathing.entitiesAtPoint(world, x, y, s), (entity: GameObject) => entity.collisionType != CollisionType.NONE);
  }


  static collidesWithAnyEntities (world: World, x: number, y: number, s: number) {
    for (var i = 0; i < world.region.entities.length; i++) {
      let entity = world.region.entities[i];
      if (entity.collisionType != CollisionType.NONE && Collision.collisionMath(x, y, s, entity.location.x, entity.location.y, entity.size)) {
        return true;
      }
    }
    return false;
  }

  static collidesWithAnyLoSBlockingEntities (world: World, x: number, y: number, s: number): LineOfSightMask {
    for (var i = 0; i < world.region.entities.length; i++) {
      let entity = world.region.entities[i];
      if (Collision.collisionMath(x, y, s, entity.location.x, entity.location.y, entity.size)) {
        return entity.lineOfSight
      }
    }
    return null;
  }




  // Perceived location works on the viewport size, so be careful as the numbers are a different scale

  static collidesWithAnyMobsAtPerceivedDisplayLocation (world: World, x: number, y: number, tickPercent: number): Mob[] {
    const mobs = []
    for (let i = 0; i < world.region.mobs.length; i++) {
      const collidedWithSpecificMob = Collision.collidesWithMobAtPerceivedDisplayLocation(world, x, y, tickPercent, world.region.mobs[i])
      if (collidedWithSpecificMob) {
        mobs.push(world.region.mobs[i])
      }
    }
    return mobs
  }

  static collidesWithMobAtPerceivedDisplayLocation (world: World, x: number, y: number, tickPercent: number, mob: Unit) {
    const perceivedX = Pathing.linearInterpolation(mob.perceivedLocation.x * Settings.tileSize, mob.location.x * Settings.tileSize, tickPercent)
    const perceivedY = Pathing.linearInterpolation(mob.perceivedLocation.y * Settings.tileSize, mob.location.y * Settings.tileSize, tickPercent)

    return (Collision.collisionMath(x, y - Settings.tileSize, 1, perceivedX, perceivedY, (mob.size) * Settings.tileSize))
  }
}