'use strict'
import _ from 'lodash'
import { GameObject, Location } from './GameObject'
import { Mob } from './Mob'
import { Region } from './Region'
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

  static collidesWithAnyEntities (region: Region, x: number, y: number, s: number) {
    for (let i = 0; i < region.entities.length; i++) {
      if (Pathing.collisionMath(x, y, s, region.entities[i].location.x, region.entities[i].location.y, region.entities[i].size)) {
        return true
      }
    }
    return false
  }

  static entitiesAtPoint (region: Region, x: number, y: number, s: number) {
    const entities = []
    for (let i = 0; i < region.entities.length; i++) {
      if (Pathing.collisionMath(x, y, s, region.entities[i].location.x, region.entities[i].location.y, region.entities[i].size)) {
        entities.push(region.entities[i])
      }
    }
    return entities
  }

  static collidesWithAnyMobsAtPerceivedDisplayLocation (region: Region, x: number, y: number, tickPercent: number) {
    const mobs = []
    for (let i = 0; i < region.mobs.length; i++) {
      const collidedWithSpecificMob = Pathing.collidesWithMobAtPerceivedDisplayLocation(region, x, y, tickPercent, region.mobs[i])
      if (collidedWithSpecificMob) {
        mobs.push(region.mobs[i])
      }
    }
    return mobs
  }

  static collidesWithMobAtPerceivedDisplayLocation (region: Region, x: number, y: number, tickPercent: number, mob: Unit) {
    const perceivedX = Pathing.linearInterpolation(mob.perceivedLocation.x * Settings.tileSize, mob.location.x * Settings.tileSize, tickPercent)
    const perceivedY = Pathing.linearInterpolation(mob.perceivedLocation.y * Settings.tileSize, mob.location.y * Settings.tileSize, tickPercent)

    return (Pathing.collisionMath(x, y - Settings.tileSize, 1, perceivedX, perceivedY, (mob.size) * Settings.tileSize))
  }

  // point.x + to.location.x, point.y + to.location.y
  static mobsAroundMob (region: Region, mob: GameObject, point: Location) {
    const mobs = []
    for (let i = 0; i < region.mobs.length; i++) {
      const collidedWithSpecificMob = region.mobs[i].location.x === point.x + mob.location.x && region.mobs[i].location.y === point.y + mob.location.y

      if (collidedWithSpecificMob) {
        mobs.push(region.mobs[i])
      }
    }

    return _.sortBy(mobs, (m: GameObject) => mob !== m)
  }

  static collidesWithAnyMobs (region: Region, x: number, y: number, s: number, mobToAvoid: GameObject = null) {
    for (let i = 0; i < region.mobs.length; i++) {
      if (region.mobs[i] === mobToAvoid) {
        continue
      }

      const collidedWithSpecificMob = Pathing.collidesWithMob(region, x, y, s, region.mobs[i])

      if (collidedWithSpecificMob && region.mobs[i].consumesSpace) {
        return region.mobs[i]
      }
    }
    return null
  }

  static collidesWithMob (region: Region, x: number, y: number, s: number, mob: GameObject) {
    return (Pathing.collisionMath(x, y, s, mob.location.x, mob.location.y, mob.size))
  }

  static canTileBePathedTo (region: Region, x: number, y: number, s: number, mobToAvoid: GameObject = null) {
    if (y - (s - 1) < 0 || x + (s - 1) > 28) {
      return false
    }
    if (y < 0 || x < 0) {
      return false
    }
    let collision = false
    collision = collision || Pathing.collidesWithAnyEntities(region, x, y, s)

    if (mobToAvoid) { // if no mobs to avoid, avoid them all
      // Player can walk under mobs
      collision = collision || Pathing.collidesWithAnyMobs(region, x, y, s, mobToAvoid) !== null
    }

    return !collision
  }

  static constructPath (region: Region, startPoint: Location, endPoint: Location) {
    // if (endPoint === -1) {
    //   return []
    // }

    const x = startPoint.x
    const y = startPoint.y
    const toX = endPoint.x
    const toY = endPoint.y
    if (!Pathing.canTileBePathedTo(region, toX, toY, 1)) {
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

        if (!Pathing.canTileBePathedTo(region, pathX, pathY, 1, null)) {
          // Destination is not a valid square
          continue
        }
        if (i >= 4) {
          // Check neighbourin squares for diagonal moves
          let neighbourX = parentNode.x
          let neighbourY = parentNode.y + iDirection.y
          if (!Pathing.canTileBePathedTo(region, neighbourX, neighbourY, 1, null)) {
            continue
          }
          neighbourX = parentNode.x + iDirection.x
          neighbourY = parentNode.y
          if (!Pathing.canTileBePathedTo(region, neighbourX, neighbourY, 1, null)) {
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

  static path (region: Region, startPoint: Location, endPoint: Location, speed: number, seeking: GameObject) {
    let x, y
    const path = Pathing.constructPath(region, startPoint, endPoint)
    if (path.length === 0) {
      return startPoint
    }
    if (seeking && Pathing.collidesWithMob(region, path[0].x, path[0].y, 1, seeking)) {
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
