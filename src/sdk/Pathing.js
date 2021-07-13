'use strict';
import _ from "lodash";
import Constants from "./Constants";
import Point from "./Utils/Point";

export default class Pathing {

  static linearInterpolation(x, y, a) {
    return ((y - x) * a) + x
  }
  
  static dist(x, y, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2))
  }

  static collisionMath(x, y, s, x2, y2, s2) {
    return !(x > (x2 + s2 - 1) || (x + s - 1) < x2 || (y - s + 1) > y2 || y < (y2 - s2 + 1));
  }

  static collidesWithAnyEntities(stage, x, y, s) {
    for (var i = 0; i < stage.entities.length; i++) {
        if (Pathing.collisionMath(x, y, s, stage.entities[i].location.x, stage.entities[i].location.y, stage.entities[i].size)) {
          return true;
        }
    }
    return false;
  }



  static collidesWithAnyMobsAtPerceivedDisplayLocation(stage, x, y, framePercent) {
    for (let i = 0; i < stage.mobs.length; i++) {
      const collidedWithSpecificMob = Pathing.collidesWithMobAtPerceivedDisplayLocation(stage, x, y, framePercent, stage.mobs[i]);
      if (collidedWithSpecificMob) {
        return stage.mobs[i];
      }
    }
    return null;
  }

  static collidesWithMobAtPerceivedDisplayLocation(stage, x, y, framePercent, mob) {

    let perceivedX = Pathing.linearInterpolation(mob.perceivedLocation.x * Constants.tileSize, mob.location.x * Constants.tileSize, framePercent);
    let perceivedY = Pathing.linearInterpolation(mob.perceivedLocation.y * Constants.tileSize, mob.location.y * Constants.tileSize, framePercent);
    return (Pathing.collisionMath(x - Constants.tileSize, y, Constants.tileSize, perceivedX, perceivedY, (mob.size - 1) * Constants.tileSize));
  }


  // point.x + to.location.x, point.y + to.location.y
  static mobsAroundMob(stage, mob, point) {
    const mobs = [];
    for (let i = 0; i < stage.mobs.length; i++) {

      const collidedWithSpecificMob = stage.mobs[i].location.x === point.x + mob.location.x && stage.mobs[i].location.y === point.y + mob.location.y;

      if (collidedWithSpecificMob) {
        mobs.push(stage.mobs[i])
      }
    }

    return _.sortBy(mobs, (m) => mob !== m);
  }

  static collidesWithAnyMobs(stage, x, y, s, mobToAvoid) {
    for (let i = 0; i < stage.mobs.length; i++) {
      if (stage.mobs[i] === mobToAvoid) {
        continue;
      }

      const collidedWithSpecificMob = Pathing.collidesWithMob(stage, x, y, s, stage.mobs[i]);

      if (collidedWithSpecificMob) {
        return stage.mobs[i];
      }
    }
    return null;
  }

  static collidesWithMob(stage, x, y, s, mob) {
    return (Pathing.collisionMath(x, y, s, mob.location.x, mob.location.y, mob.size));
  }

  static canTileBePathedTo(stage, x, y, s, mobToAvoid) {
    if (y - (s - 1) < 0 || x + (s - 1) > 28) {
      return false;
    }
    if (y < 0 || x < 0) {
      return false;
    }
    var collision = false;
    collision = collision | Pathing.collidesWithAnyEntities(stage, x, y, s);

    if (mobToAvoid) { // if no mobs to avoid, avoid them all
      // Player can walk under mobs
      collision = collision | Pathing.collidesWithAnyMobs(stage, x, y, s, mobToAvoid) != null;
    }

    return !collision;
  }

  static constructPath(stage, startPoint, endPoint, seeking) {

    if (endPoint === -1) {
      return [];
    }

    const x = startPoint.x;
    const y = startPoint.y;
    const toX = endPoint.x;
    const toY = endPoint.y;
    if (!Pathing.canTileBePathedTo(stage, toX, toY, 1)) {
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

        if (!Pathing.canTileBePathedTo(stage, pathX, pathY, 1, null)) {
          // Destination is not a valid square
          continue;
        }
        if (i >= 4) {
          // Check neighbourin squares for diagonal moves
          var neighbour_x = parent_node.x;
          var neighbour_y = parent_node.y + iDirection.y;
          if (!Pathing.canTileBePathedTo(stage, neighbour_x, neighbour_y, 1, null)) {
            continue;
          }
          var neighbour_x = parent_node.x + iDirection.x;
          var neighbour_y = parent_node.y;
          if (!Pathing.canTileBePathedTo(stage, neighbour_x, neighbour_y, 1, null)) {
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

  static path(stage, startPoint, endPoint, speed, seeking) {

    let x, y;
    const path = Pathing.constructPath(stage, startPoint, endPoint);
    if (path.length === 0) {
      return startPoint;
    }
    if (seeking && Pathing.collidesWithMob(stage, path[0].x, path[0].y, 1, seeking)){
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
    return new Point(x, y);
  }
}
