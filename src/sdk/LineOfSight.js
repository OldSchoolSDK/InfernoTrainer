'use strict';

import _ from "lodash";
import { Settings } from "./Settings";
import { Pathing } from "./Pathing";

/*
 Basically, this entire file is lifted and modified to be as coherent as possible.
 This algorithm makes no sense and is copy pasta'd between basically every trainer.
 I have no clue how it works, nor do I care. 
*/
export class LineOfSight {
    static drawLOS(region, x, y, s, r, c, isNPC) {
        region.ctx.globalAlpha = 0.4;
        for (var i = 0; i < 870; i++) {
            region.ctx.fillStyle = c;

            var x2 = i % 29;
            var y2 = Math.floor(i / 29);

            if (LineOfSight.hasLineOfSight(region, x, y, x2, y2, s, r, isNPC)) {
                region.ctx.fillRect(
                    x2 * Settings.tileSize, 
                    y2 * Settings.tileSize, 
                    Settings.tileSize, 
                    Settings.tileSize
                );
            }
        }
        region.ctx.globalAlpha = 1;
    }

    static hasLineOfSightOfPlayer(region, x, y, s, r = 1, isNPC = true) {
        return LineOfSight.hasLineOfSight(region, x, y, region.player.location.x, region.player.location.y, s, r, isNPC);
    }

    static closestPointTo(x, y, mob) {

      const corners = [];
      for (let xx=0; xx < mob.size; xx++){
          for (let yy=0; yy < mob.size; yy++){
            corners.push({
                x: mob.location.x + xx, 
                y: mob.location.y - yy
            });
          }
      }
      
      return _.minBy(corners, (point) => Pathing.dist(x, y, point.x, point.y));
    }
    
    static hasLineOfSightOfMob(region, x, y, mob, r = 1, isNPC = false) {
      const mobPoint = LineOfSight.closestPointTo(x, y, mob);
      return LineOfSight.hasLineOfSight(region, x, y, mobPoint.x, mobPoint.y, 1, r, false);
    }

    static hasLineOfSight(region, x1, y1, x2, y2, s = 1, r = 1, isNPC = false) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        if (Pathing.collidesWithAnyEntities(region, x1, y1, 1) || Pathing.collidesWithAnyEntities(region, x2, y2, 1) || Pathing.collisionMath(x1, y1, s, x2, y2, 1)) {
            return false;
        }
        //assume range 1 is melee
        if (r == 1) {
            return (dx < s && dx >= 0 && (dy == 1 || dy == -s)) || (dy > -s && dy <= 0 && (dx == -1 || dx == s))
        }
        if (isNPC) {
            var tx = Math.max(x1, Math.min(x1 + s - 1, x2))
            var ty = Math.max(y1 - s + 1, Math.min(y1, y2))
            return LineOfSight.hasLineOfSight(region, x2, y2, tx, ty, 1, r, false);
        }
        let dxAbs = Math.abs(dx);
        let dyAbs = Math.abs(dy);
        if (dxAbs > r || dyAbs > r) {
            return false;
        }
        if (dxAbs > dyAbs) {
            let xTile = x1;
            let y = (y1 << 16) + 0x8000;
            let slope = Math.trunc((dy << 16) / dxAbs); // Integer division
            let xInc = (dx > 0) ? 1 : -1;
            if (dy < 0) {
                y -= 1; // For correct rounding
            }
            while (xTile !== x2) {
                xTile += xInc;
                let yTile = y >>> 16;
                if (Pathing.collidesWithAnyEntities(region, xTile, yTile, 1)) {
                    return false;
                }
                y += slope;
                let newYTile = y >>> 16;
                if (newYTile !== yTile && Pathing.collidesWithAnyEntities(region, xTile, newYTile, 1)) {
                    return false;
                }
            }
    
        } else {
            let yTile = y1;
            let x = (x1 << 16) + 0x8000;
            let slope = Math.trunc((dx << 16) / dyAbs); // Integer division
            let yInc = (dy > 0) ? 1 : -1;
            if (dx < 0) {
                x -= 1; // For correct rounding
            }
            while (yTile !== y2) {
                yTile += yInc;
                let xTile = x >>> 16;
                if (Pathing.collidesWithAnyEntities(region, xTile, yTile, 1)) {
                    return false;
                }
                x += slope;
                let newXTile = x >>> 16;
                if (newXTile !== xTile && Pathing.collidesWithAnyEntities(region, newXTile, yTile, 1)) {
                    return false;
                }
            }
    
        }
        return true;
    }
}
