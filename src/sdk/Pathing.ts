'use strict'
import { filter, sortBy, minBy } from 'lodash'
import { CollisionType, GameObject, Location } from './GameObject'
import { World } from './World'
import { Settings } from './Settings'
import { Unit } from './Unit'

interface PathingNode {
  x: number;
  y: number;
  parent?: any;
}
export class Pathing {
  static linearInterpolation (x: number, y: number, a: number) {
    return ((y - x) * a) + x
  }

  static dist (x: number, y: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2))
  }

  static collisionMath (x: number, y: number, s: number, x2: number, y2: number, s2: number) {
    return !(x > (x2 + s2 - 1) || (x + s - 1) < x2 || (y - s + 1) > y2 || y < (y2 - s2 + 1))
  }

  static collidesWithAnyEntities (world: World, x: number, y: number, s: number) {
    for (var i = 0; i < world.entities.length; i++) {
      let entity = world.entities[i];
      if (entity.collisionType != CollisionType.NONE && Pathing.collisionMath(x, y, s, entity.location.x, entity.location.y, entity.size)) {
        return true;
      }
    }
    return false;
  }

  static closestPointTo (x: number, y: number, mob: GameObject) {
    const corners = []
    for (let xx = 0; xx < mob.size; xx++) {
      for (let yy = 0; yy < mob.size; yy++) {
        corners.push({
          x: mob.location.x + xx,
          y: mob.location.y - yy
        })
      }
    }

    return minBy(corners, (point: Location) => Pathing.dist(x, y, point.x, point.y))
  }

  static entitiesAtPoint (world: World, x: number, y: number, s: number) {
    const entities = []
    for (let i = 0; i < world.entities.length; i++) {
      if (Pathing.collisionMath(x, y, s, world.entities[i].location.x, world.entities[i].location.y, world.entities[i].size)) {
        entities.push(world.entities[i])
      }
    }
    return entities
  }

  // Same as above but only returns entities with collision enabled.
  static collideableEntitiesAtPoint(world: World, x: number, y: number, s: number) {
    return filter(Pathing.entitiesAtPoint(world, x, y, s), (entity: GameObject) => entity.collisionType != CollisionType.NONE);
  }

  static collidesWithAnyMobsAtPerceivedDisplayLocation (world: World, x: number, y: number, tickPercent: number) {
    const mobs = []
    for (let i = 0; i < world.mobs.length; i++) {
      const collidedWithSpecificMob = Pathing.collidesWithMobAtPerceivedDisplayLocation(world, x, y, tickPercent, world.mobs[i])
      if (collidedWithSpecificMob) {
        mobs.push(world.mobs[i])
      }
    }
    return mobs
  }

  static collidesWithMobAtPerceivedDisplayLocation (world: World, x: number, y: number, tickPercent: number, mob: Unit) {
    const perceivedX = Pathing.linearInterpolation(mob.perceivedLocation.x * Settings.tileSize, mob.location.x * Settings.tileSize, tickPercent)
    const perceivedY = Pathing.linearInterpolation(mob.perceivedLocation.y * Settings.tileSize, mob.location.y * Settings.tileSize, tickPercent)

    return (Pathing.collisionMath(x, y - Settings.tileSize, 1, perceivedX, perceivedY, (mob.size) * Settings.tileSize))
  }

  // point.x + to.location.x, point.y + to.location.y
  static mobsInAreaOfEffectOfMob (world: World, mob: GameObject, point: Location) {
    const mobs = []
    for (let i = 0; i < world.mobs.length; i++) {
      const collidedWithSpecificMob = world.mobs[i].location.x === point.x + mob.location.x && world.mobs[i].location.y === point.y + mob.location.y

      if (collidedWithSpecificMob) {
        mobs.push(world.mobs[i])
      }
    }

    return sortBy(mobs, (m: GameObject) => mob !== m)
  }

  static collidesWithAnyMobs (world: World, x: number, y: number, s: number, mobToAvoid: GameObject = null) {
    for (let i = 0; i < world.mobs.length; i++) {
      if (world.mobs[i] === mobToAvoid) {
        continue
      }

      const collidedWithSpecificMob = Pathing.collidesWithMob(world, x, y, s, world.mobs[i])

      if (collidedWithSpecificMob && world.mobs[i].consumesSpace) {
        return world.mobs[i]
      }
    }
    return null
  }

  static collidesWithMob (world: World, x: number, y: number, s: number, mob: GameObject) {
    return (Pathing.collisionMath(x, y, s, mob.location.x, mob.location.y, mob.size))
  }

  static canTileBePathedTo (world: World, x: number, y: number, s: number, mobToAvoid: GameObject = null) {
    // if (y - (s - 1) < 0 || x + (s - 1) > 28) {
    //   return false
    // }
    // if (y < 0 || x < 0) {
    //   return false
    // }
    let collision = false
    collision = collision || Pathing.collidesWithAnyEntities(world, x, y, s)

    if (mobToAvoid) { // if no mobs to avoid, avoid them all
      // Player can walk under mobs
      collision = collision || Pathing.collidesWithAnyMobs(world, x, y, s, mobToAvoid) !== null
    }

    return !collision
  }

  static constructPath (world: World, startPoint: Location, endPoint: Location) {
    // if (endPoint === -1) {
    //   return []
    // }

    const x = startPoint.x
    const y = startPoint.y
    const toX = endPoint.x
    const toY = endPoint.y
    if (!Pathing.canTileBePathedTo(world, toX, toY, 1)) {
      return []
    }

    const pathTiles = []

    let pathX = x
    let pathY = y

    const nodes: PathingNode[] = [
      { x, y, parent: null }
    ]

    // The order of possible directions in this array determines if the player moves first straight or diagonaly
    const directions = [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 }
    ]

    // Djikstra search for the optimal route
    const explored: any = {}
    while (nodes.length !== 0) {
      let parentNode = nodes.shift()

      if ((parentNode.x === toX) && (parentNode.y === toY)) {
        while (parentNode) {
          pathTiles.push({ x: parentNode.x, y: parentNode.y })
          parentNode = parentNode.parent
        }
        break
      }
      for (let i = 0; i < directions.length; i++) {
        const iDirection = directions[i]
        pathX = parentNode.x + iDirection.x
        pathY = parentNode.y + iDirection.y

        if (!Pathing.canTileBePathedTo(world, pathX, pathY, 1, null)) {
          // Destination is not a valid square
          continue
        }
        if (i >= 4) {
          // Check neighbourin squares for diagonal moves
          let neighbourX = parentNode.x
          let neighbourY = parentNode.y + iDirection.y
          if (!Pathing.canTileBePathedTo(world, neighbourX, neighbourY, 1, null)) {
            continue
          }
          neighbourX = parentNode.x + iDirection.x
          neighbourY = parentNode.y
          if (!Pathing.canTileBePathedTo(world, neighbourX, neighbourY, 1, null)) {
            continue
          }
        }

        if (pathX in explored) {
          if (pathY in explored[pathX]) {
            continue
          } else {
            explored[pathX][pathY] = true
          }
        } else {
          explored[pathX] = {}
          explored[pathX][pathY] = true
        }

        nodes.push({ x: pathX, y: pathY, parent: parentNode })
      }
    }

    return pathTiles
  }

  static path (world: World, startPoint: Location, endPoint: Location, speed: number, seeking: GameObject) {
    let x, y
    const path = Pathing.constructPath(world, startPoint, endPoint)
    if (path.length === 0) {
      return startPoint
    }
    if (seeking && Pathing.collidesWithMob(world, path[0].x, path[0].y, 1, seeking)) {
      path.shift()
    }

    if (path.length <= speed) {
      // Step to the destination
      x = path[0].x
      y = path[0].y
    } else {
      // Move two steps forward
      x = path[path.length - speed - 1].x
      y = path[path.length - speed - 1].y
    }
    return { x, y }
  }
}
