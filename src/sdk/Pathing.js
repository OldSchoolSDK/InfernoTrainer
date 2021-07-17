'use strict';
import _ from "lodash";
import { Settings } from "./Settings";

export class Pathing {

  static linearInterpolation(x, y, a) {
    return ((y - x) * a) + x
  }
  
  static dist(x, y, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2))
  }

  static collisionMath(x, y, s, x2, y2, s2) {
    return !(x > (x2 + s2 - 1) || (x + s - 1) < x2 || (y - s + 1) > y2 || y < (y2 - s2 + 1));
  }

  static collidesWithAnyEntities(region, x, y, s) {
    for (var i = 0; i < region.entities.length; i++) {
        if (Pathing.collisionMath(x, y, s, region.entities[i].location.x, region.entities[i].location.y, region.entities[i].size)) {
          return true;
        }
    }
    return false;
  }
  static entitiesAtPoint(region, x, y, s) {
    const entities = [];
    for (var i = 0; i < region.entities.length; i++) {
        if (Pathing.collisionMath(x, y, s, region.entities[i].location.x, region.entities[i].location.y, region.entities[i].size)) {
          entities.push(region.entities[i]);
        }
    }
    return entities;
  }



  static collidesWithAnyMobsAtPerceivedDisplayLocation(region, x, y, framePercent) {
    const mobs = [];
    for (let i = 0; i < region.mobs.length; i++) {
      const collidedWithSpecificMob = Pathing.collidesWithMobAtPerceivedDisplayLocation(region, x, y, framePercent, region.mobs[i]);
      if (collidedWithSpecificMob) {
        mobs.push(region.mobs[i])
      }
    }
    return mobs;
  }

  static collidesWithMobAtPerceivedDisplayLocation(region, x, y, framePercent, mob) {

    let perceivedX = Pathing.linearInterpolation(mob.perceivedLocation.x * Settings.tileSize, mob.location.x * Settings.tileSize, framePercent);
    let perceivedY = Pathing.linearInterpolation(mob.perceivedLocation.y * Settings.tileSize, mob.location.y * Settings.tileSize, framePercent);

    return (Pathing.collisionMath(x, y - Settings.tileSize, 1, perceivedX, perceivedY, (mob.size) * Settings.tileSize));
  }


  // point.x + to.location.x, point.y + to.location.y
  static mobsAroundMob(region, mob, point) {
    const mobs = [];
    for (let i = 0; i < region.mobs.length; i++) {

      const collidedWithSpecificMob = region.mobs[i].location.x === point.x + mob.location.x && region.mobs[i].location.y === point.y + mob.location.y;

      if (collidedWithSpecificMob) {
        mobs.push(region.mobs[i])
      }
    }

    return _.sortBy(mobs, (m) => mob !== m);
  }

  static collidesWithAnyMobs(region, x, y, s, mobToAvoid) {
    for (let i = 0; i < region.mobs.length; i++) {
      if (region.mobs[i] === mobToAvoid) {
        continue;
      }

      const collidedWithSpecificMob = Pathing.collidesWithMob(region, x, y, s, region.mobs[i]);

      if (collidedWithSpecificMob && region.mobs[i].consumesSpace) {
        return region.mobs[i];
      }
    }
    return null;
  }

  static collidesWithMob(region, x, y, s, mob) {
    return (Pathing.collisionMath(x, y, s, mob.location.x, mob.location.y, mob.size));
  }

  static canTileBePathedTo(region, x, y, s, mobToAvoid) {
    if (y - (s - 1) < 0 || x + (s - 1) > 28) {
      return false;
    }
    if (y < 0 || x < 0) {
      return false;
    }
    var collision = false;
    collision = collision | Pathing.collidesWithAnyEntities(region, x, y, s);

    if (mobToAvoid) { // if no mobs to avoid, avoid them all
      // Player can walk under mobs
      collision = collision | Pathing.collidesWithAnyMobs(region, x, y, s, mobToAvoid) != null;
    }

    return !collision;
  }

  static constructPath(region, startPoint, endPoint) {

    if (endPoint === -1) {
      return [];
    }

    const x = startPoint.x;
    const y = startPoint.y;
    const toX = endPoint.x;
    const toY = endPoint.y;
    if (!Pathing.canTileBePathedTo(region, toX, toY, 1)) {
      return [];
    }

    const pathTiles = [];

    let pathX = x;
    let pathY = y;

    let nodes = [
      { x, y, parent: null }
    ];

    // The order of possible directions in this array determines if the player moves first straight or diagonaly
    let directions = [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
    ];

    // Djikstra search for the optimal route
    const explored = {};
    let iter = 0;
    while (nodes.length != 0) {
      var parent_node = nodes.shift();

      if ((parent_node.x == toX) & (parent_node.y == toY)) {
        while (parent_node) {
          pathTiles.push({ x: parent_node.x, y: parent_node.y });
          parent_node = parent_node.parent;
        }
        break;
      }
      for (let i = 0; i < directions.length; i++) {
        let iDirection = directions[i];
        pathX = parent_node.x + iDirection.x;
        pathY = parent_node.y + iDirection.y;

        if (!Pathing.canTileBePathedTo(region, pathX, pathY, 1, null)) {
          // Destination is not a valid square
          continue;
        }
        if (i >= 4) {
          // Check neighbourin squares for diagonal moves
          var neighbour_x = parent_node.x;
          var neighbour_y = parent_node.y + iDirection.y;
          if (!Pathing.canTileBePathedTo(region, neighbour_x, neighbour_y, 1, null)) {
            continue;
          }
          var neighbour_x = parent_node.x + iDirection.x;
          var neighbour_y = parent_node.y;
          if (!Pathing.canTileBePathedTo(region, neighbour_x, neighbour_y, 1, null)) {
            continue;
          }
        }

        if (pathX in explored) {
          if (pathY in explored[pathX]) {
            continue;
          } else {
            explored[pathX][pathY] = true;
          }
        } else {
          explored[pathX] = {};
          explored[pathX][pathY] = true;
        }

        nodes.push({ x: pathX, y: pathY, parent: parent_node });
      }

    }

    return pathTiles;
  }

  static path(region, startPoint, endPoint, speed, seeking) {

    let x, y;
    const path = Pathing.constructPath(region, startPoint, endPoint);
    if (path.length === 0) {
      return startPoint;
    }
    if (seeking && Pathing.collidesWithMob(region, path[0].x, path[0].y, 1, seeking)){
      path.shift();
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
    return {x, y};
  }
}
