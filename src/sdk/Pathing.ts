"use strict";
import { sortBy, minBy, max } from "lodash";
import { Location } from "./Location";
import { Collision } from "./Collision";
import { Region } from "./Region";
import { Unit } from "./Unit";

interface PathingCache {
  [key: string]: boolean;
}

interface PathingNode {
  x: number;
  y: number;
  parent?: PathingNode;
  pathLength?: number;
}
export class Pathing {
  static entitiesAtPoint(region: Region, x: number, y: number, s: number) {
    const entities = [];
    for (let i = 0; i < region.entities.length; i++) {
      if (
        Collision.collisionMath(
          x,
          y,
          s,
          region.entities[i].location.x,
          region.entities[i].location.y,
          region.entities[i].size,
        )
      ) {
        entities.push(region.entities[i]);
      }
    }
    return entities;
  }

  // TODO: Make this more like entitiesAtPoint
  static mobsAtAoeOffset(region: Region, mob: Unit, point: Location) {
    const mobs = [];
    for (let i = 0; i < region.mobs.length; i++) {
      const collidedWithSpecificMob =
        region.mobs[i].location.x === point.x + mob.location.x &&
        region.mobs[i].location.y === point.y + mob.location.y;

      if (collidedWithSpecificMob) {
        mobs.push(region.mobs[i]);
      }
    }

    return sortBy(mobs, (m: Unit) => mob !== m);
  }

  // Core pathing

  static linearInterpolation(x: number, y: number, a: number) {
    return (y - x) * a + x;
  }

  static dist(x: number, y: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));
  }

  static angle(x: number, y: number, x2: number, y2: number) {
    return Math.atan2(y2 - y, x2 - x);
  }

  static closestPointTo(x: number, y: number, mob: Unit) {
    const corners = [];
    for (let xx = 0; xx < mob.size; xx++) {
      for (let yy = 0; yy < mob.size; yy++) {
        corners.push({
          x: mob.location.x + xx,
          y: mob.location.y - yy,
        });
      }
    }

    return minBy(corners, (point: Location) => Pathing.dist(x, y, point.x, point.y));
  }

  static tileCache: PathingCache = {};
  static purgeTileCache() {
    Pathing.tileCache = {};
  }

  static canTileBePathedTo(region: Region, x: number, y: number, s: number, mobToAvoid: Unit = null) {
    const cache =
      Pathing.tileCache[`${region.serialNumber}-${x}-${y}-${s}-${mobToAvoid ? mobToAvoid.serialNumber : 0}`];
    if (cache !== undefined) {
      return cache;
    }
    let collision = false;
    collision = collision || Collision.collidesWithAnyEntities(region, x, y, s);

    if (mobToAvoid) {
      // if no mobs to avoid, avoid them all
      // Player can walk under mobs
      collision = collision || Collision.collidesWithAnyMobs(region, x, y, s, mobToAvoid) !== null;
    }
    Pathing.tileCache[`${region.serialNumber}-${x}-${y}-${s}-${mobToAvoid ? mobToAvoid.serialNumber : 0}`] = !collision;
    return !collision;
  }

  /**
   *
   * @param region
   * @param startPoint
   * @param endPoints array of valid end points. the first should be the SW tile.
   * @returns
   */
  static constructPaths(
    region: Region,
    { x, y }: Location,
    endPoints: Location[],
  ): {
    destination: Location | null;
    path: Location[];
  } {
    const unpathableEndPoints = endPoints.filter(
      (location) => !Pathing.canTileBePathedTo(region, location.x, location.y, 1),
    );
    if (unpathableEndPoints.length === endPoints.length) {
      // no pathable end points
      return {
        destination: null,
        path: [],
      };
    }

    const pathableEndPoints = endPoints.filter((location) =>
      Pathing.canTileBePathedTo(region, location.x, location.y, 1),
    );

    let pathX = x;
    let pathY = y;

    const nodes: PathingNode[] = [{ x, y, parent: null }];

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
      { x: 1, y: -1 }, // ne
    ];

    let currentDistance = 0;

    // Djikstra search for the optimal route
    const explored: { [x: number]: { [y: number]: PathingNode } } = {};

    // initialise first node
    explored[pathX] = {};
    explored[pathX][pathY] = { x: pathX, y: pathY, parent: null, pathLength: 0 };
    let minExploredX = pathX;
    let minExploredY = pathY;
    let maxExploredX = pathX;
    let maxExploredY = pathY;

    while (nodes.length !== 0) {
      const parentNode = nodes.shift();
      const matchedDestinations = pathableEndPoints.filter((d) => d.x === parentNode.x && d.y === parentNode.y);
      for (const matchedDestination of matchedDestinations) {
        const path = [];
        let parent = parentNode;
        while (parent) {
          path.push({ x: parent.x, y: parent.y });
          parent = parent.parent;
        }
        return { destination: matchedDestination, path };
      }
      currentDistance = (explored[parentNode.x] || {})[parentNode.y]?.pathLength || 0;
      for (let i = 0; i < directions.length; i++) {
        const iDirection = directions[i];
        pathX = parentNode.x + iDirection.x;
        pathY = parentNode.y + iDirection.y;

        if (!Pathing.canTileBePathedTo(region, pathX, pathY, 1, null)) {
          // Destination is not a valid square
          continue;
        }
        if (i >= 4) {
          // Check neighbouring squares for diagonal moves
          let neighbourX = parentNode.x;
          let neighbourY = parentNode.y + iDirection.y;
          if (!Pathing.canTileBePathedTo(region, neighbourX, neighbourY, 1, null)) {
            continue;
          }
          neighbourX = parentNode.x + iDirection.x;
          neighbourY = parentNode.y;
          if (!Pathing.canTileBePathedTo(region, neighbourX, neighbourY, 1, null)) {
            continue;
          }
        }

        if (!(pathX in explored)) {
          explored[pathX] = {};
          if (pathX < minExploredX) {
            minExploredX = pathX;
          }
          if (pathX > maxExploredX) {
            maxExploredX = pathX;
          }
        }
        if (pathY in explored[pathX]) {
          continue;
        } else {
          explored[pathX][pathY] = {
            x: pathX,
            y: pathY,
            parent: parentNode,
            pathLength: currentDistance + 1,
          };
          if (pathY < minExploredY) {
            minExploredY = pathY;
          }
          if (pathY > maxExploredY) {
            maxExploredY = pathY;
          }
        }
        nodes.push({ x: pathX, y: pathY, parent: parentNode });
      }
    }

    // No path found yet.
    // Find a backup tile within a 21x21 grid of the SW tile of the selection that:
    // - has path length less than 100
    // - has the shortest path distance
    // - has target tile as close as possible in Euclidean distance to the nearest requested tile
    const swTile = endPoints[0];
    const minX = Math.max(minExploredX, swTile.x - 10);
    const minY = Math.max(minExploredY, swTile.y - 10);
    const maxX = Math.max(maxExploredX, swTile.x + 10);
    const maxY = Math.max(maxExploredY, swTile.y + 10);

    let bestBackupTile: Location | null = null;
    //let minEuclideanDistance = Pathing.dist(swTile.x, swTile.y, startPoint.x, startPoint.y);
    let minEuclideanDistance = Number.MAX_VALUE; // Pathing.dist(swTile.x, swTile.y, startPoint.x, startPoint.y);
    let minPathLength = 100;

    for (let x = minX; x <= maxX; ++x) {
      if (!(x in explored)) {
        continue;
      }
      for (let y = minY; y <= maxY; ++y) {
        if (!(y in explored[x])) {
          continue;
        }
        const pathLength = explored[x][y].pathLength;

        endPoints.forEach((endPoint) => {
          const dist = Pathing.dist(x, y, endPoint.x, endPoint.y);
          if (dist < minEuclideanDistance || (dist === minEuclideanDistance && pathLength < minPathLength)) {
            bestBackupTile = { x, y };
            minPathLength = pathLength;
            minEuclideanDistance = dist;
          }
        });
      }
    }
    // No LoS - path to best backup tile
    if (bestBackupTile) {
      // unwind the path
      const path = [];
      let node = explored[bestBackupTile.x][bestBackupTile.y];
      while (node) {
        path.push({ x: node.x, y: node.y });
        node = node.parent;
      }
      return {
        destination: bestBackupTile,
        path,
      };
    }
    // no backup tile found
    return {
      destination: null,
      path: [],
    };
  }

  static path(region: Region, startPoint: Location, endPoint: Location, speed: number, seeking: Unit) {
    let x: number, y: number;
    const pathResult = Pathing.constructPaths(region, startPoint, [endPoint]);
    const { path } = pathResult;
    if (path.length === 0) {
      return { x: startPoint.x, y: startPoint.y, path: [] };
    }
    if (seeking && Collision.collidesWithMob(region, path[0].x, path[0].y, 1, seeking)) {
      path.shift();
    }

    if (path.length === 0) {
      return {
        x: startPoint.x,
        y: startPoint.y,
        path: [],
      };
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
    return { x, y, path: path.slice(1, 3), destination };
  }
}
