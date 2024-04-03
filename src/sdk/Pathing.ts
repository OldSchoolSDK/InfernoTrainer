'use strict'
import { sortBy, minBy } from 'lodash'
import { Location } from "./Location"
import { Collision } from './Collision'
import { Region } from './Region'
import { Unit } from './Unit'
/* eslint-disable @typescript-eslint/no-explicit-any */

interface PathingCache {
  [key: string]: boolean;
}


interface PathingNode {
  x: number;
  y: number;
  parent?: PathingNode;
}
export class Pathing {

  static entitiesAtPoint (region: Region, x: number, y: number, s: number) {
    const entities = []
    for (let i = 0; i < region.entities.length; i++) {
      if (Collision.collisionMath(x, y, s, region.entities[i].location.x, region.entities[i].location.y, region.entities[i].size)) {
        entities.push(region.entities[i])
      }
    }
    return entities
  }


  // TODO: Make this more like entitiesAtPoint
  static mobsAtAoeOffset (region: Region,  mob: Unit, point: Location) {
    const mobs = []
    for (let i = 0; i < region.mobs.length; i++) {
      const collidedWithSpecificMob = region.mobs[i].location.x === point.x + mob.location.x && region.mobs[i].location.y === point.y + mob.location.y

      if (collidedWithSpecificMob) {
        mobs.push(region.mobs[i])
      }
    }

    return sortBy(mobs, (m: Unit) => mob !== m)
  }



  // Core pathing

  static linearInterpolation (x: number, y: number, a: number) {
    return ((y - x) * a) + x
  }

  static dist (x: number, y: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2))
  }

  static angle(x: number, y: number, x2: number, y2: number) {
    return Math.atan2(y2 - y, x2 - x);
  }


  static closestPointTo (x: number, y: number, mob: Unit) {
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


  static tileCache: PathingCache = {};
  static purgeTileCache() {
    Pathing.tileCache = {};
  }


  static canTileBePathedTo (region: Region, x: number, y: number, s: number, mobToAvoid: Unit = null) {
    const cache = Pathing.tileCache[`${region.serialNumber}-${x}-${y}-${s}-${mobToAvoid ? mobToAvoid.serialNumber : 0}`];
    if (cache !== undefined){
      return cache;
    }
    let collision = false
    collision = collision || Collision.collidesWithAnyEntities(region, x, y, s)

    if (mobToAvoid) { // if no mobs to avoid, avoid them all
      // Player can walk under mobs
      collision = collision || Collision.collidesWithAnyMobs(region, x, y, s, mobToAvoid) !== null
    }
    Pathing.tileCache[`${region.serialNumber}-${x}-${y}-${s}-${mobToAvoid ? mobToAvoid.serialNumber : 0}`] = !collision;
    return !collision
  }

  static constructPath (region: Region, startPoint: Location, endPoint: Location): Location[] {
    // if (endPoint === -1) {
    //   return []
    // }

    const x = startPoint.x;
    const y = startPoint.y;
    const toX = endPoint.x;
    const toY = endPoint.y;
    if (!Pathing.canTileBePathedTo(region, toX, toY, 1)) {
      return []
    }

    const pathTiles = [];

    let pathX = x;
    let pathY = y;

    const nodes: PathingNode[] = [
      { x, y, parent: null }
    ]

    // The order of possible directions in this array determines if the player moves first straight or diagonaly
    // https://oldschool.runescape.wiki/w/Pathfinding#Determining_the_target_tile
    const directions = [
      { x: -1, y: 0 }, // west
      { x: 1, y: 0 }, // east
      { x: 0, y: 1 }, // south
      { x: 0, y: -1 }, // north
      { x: -1, y: 1 }, // sw
      { x: 1, y: 1 }, // se
      { x: -1, y: -1 }, // nw 
      { x: 1, y: -1 } // ne
    ]
    
    let bestBackupTile = {x: -1, y: -1};
    let bestBackupTileDistance = 99999;

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
            if (Pathing.dist(toX, toY, pathX, pathY) < bestBackupTileDistance) {
              bestBackupTileDistance = Pathing.dist(toX, toY, pathX, pathY);
              bestBackupTile = {x: pathX, y: pathY };
            }
          }
        } else {
          explored[pathX] = {}
          explored[pathX][pathY] = true

          if (Pathing.dist(toX, toY, pathX, pathY) < bestBackupTileDistance) {
            bestBackupTileDistance = Pathing.dist(toX, toY, pathX, pathY);
            bestBackupTile = {x: pathX, y: pathY };
          }
        }

        nodes.push({ x: pathX, y: pathY, parent: parentNode })
      }
    }

    if (pathTiles.length === 0) {
      // No LoS
      return Pathing.constructPath(region, startPoint, bestBackupTile)
    }

    return pathTiles
  }

  static path (region: Region, startPoint: Location, endPoint: Location, speed: number, seeking: Unit) {
    let x: number, y: number;
    const path = Pathing.constructPath(region, startPoint, endPoint)
    if (path.length === 0) {
      return { x: startPoint.x, y: startPoint.y, path: [] }
    }
    if (seeking && Collision.collidesWithMob(region, path[0].x, path[0].y, 1, seeking)) {
      path.shift()
    }

    if (path.length === 0) {
      return {
        x: startPoint.x,
        y: startPoint.y,
        path: []
      }
    }

    if (path.length <= speed) {
      // Step to the destination
      x = path[0].x;
      y = path[0].y;
    } else {
      // Move two steps forward
      x = path[path.length - speed - 1].x;
      y = path[path.length - speed - 1].y;
    }
    const destination = path[0];
    path.reverse();
    return { x, y, path: path.slice(1, 3), destination }
  }
}
