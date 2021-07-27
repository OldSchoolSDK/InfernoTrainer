'use strict'

import { minBy } from 'lodash'
import { Settings } from './Settings'
import { Pathing } from './Pathing'
import { World } from './World'
import { GameObject, Location } from './GameObject'

/*
 Basically, this entire file is lifted and modified to be as coherent as possible.
 This algorithm makes no sense and is copy pasta'd between basically every trainer.
 I have no clue how it works, nor do I care.
*/
export class LineOfSight {
  static drawLOS (world: World, x: number, y: number, s: number, r: number, c: string, isNPC: boolean) {
    world.ctx.globalAlpha = 0.4
    for (let i = 0; i < 870; i++) {
      world.ctx.fillStyle = c

      const x2 = i % 29
      const y2 = Math.floor(i / 29)

      if (LineOfSight.hasLineOfSight(world, x, y, x2, y2, s, r, isNPC)) {
        world.ctx.fillRect(
          x2 * Settings.tileSize,
          y2 * Settings.tileSize,
          Settings.tileSize,
          Settings.tileSize
        )
      }
    }
    world.ctx.globalAlpha = 1
  }

  static hasLineOfSightOfPlayer (world: World, x: number, y: number, s: number, r: number = 1, isNPC: boolean = true) {
    return LineOfSight.hasLineOfSight(world, x, y, world.player.location.x, world.player.location.y, s, r, isNPC)
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

  static hasLineOfSightOfMob (world: World, x: number, y: number, mob: GameObject, r = 1, isNPC = false) {
    const mobPoint = LineOfSight.closestPointTo(x, y, mob)
    return LineOfSight.hasLineOfSight(world, x, y, mobPoint.x, mobPoint.y, 1, r, false)
  }

  static hasLineOfSight (world: World, x1: number, y1: number, x2: number, y2: number, s: number = 1, r: number = 1, isNPC: boolean = false): boolean {
    const dx = x2 - x1
    const dy = y2 - y1
    if (Pathing.collidesWithAnyEntities(world, x1, y1, 1) || Pathing.collidesWithAnyEntities(world, x2, y2, 1) || Pathing.collisionMath(x1, y1, s, x2, y2, 1)) {
      return false
    }
    // assume range 1 is melee
    if (r === 1) {
      return (dx < s && dx >= 0 && (dy === 1 || dy === -s)) || (dy > -s && dy <= 0 && (dx === -1 || dx === s))
    }
    if (isNPC) {
      const tx = Math.max(x1, Math.min(x1 + s - 1, x2))
      const ty = Math.max(y1 - s + 1, Math.min(y1, y2))
      return LineOfSight.hasLineOfSight(world, x2, y2, tx, ty, 1, r, false)
    }
    const dxAbs = Math.abs(dx)
    const dyAbs = Math.abs(dy)
    if (dxAbs > r || dyAbs > r) {
      return false
    }
    if (dxAbs > dyAbs) {
      let xTile = x1
      let y = (y1 << 16) + 0x8000
      const slope = Math.trunc((dy << 16) / dxAbs) // Integer division
      const xInc = (dx > 0) ? 1 : -1
      if (dy < 0) {
        y -= 1 // For correct rounding
      }
      while (xTile !== x2) {
        xTile += xInc
        const yTile = y >>> 16
        if (Pathing.collidesWithAnyEntities(world, xTile, yTile, 1)) {
          return false
        }
        y += slope
        const newYTile = y >>> 16
        if (newYTile !== yTile && Pathing.collidesWithAnyEntities(world, xTile, newYTile, 1)) {
          return false
        }
      }
    } else {
      let yTile = y1
      let x = (x1 << 16) + 0x8000
      const slope = Math.trunc((dx << 16) / dyAbs) // Integer division
      const yInc = (dy > 0) ? 1 : -1
      if (dx < 0) {
        x -= 1 // For correct rounding
      }
      while (yTile !== y2) {
        yTile += yInc
        const xTile = x >>> 16
        if (Pathing.collidesWithAnyEntities(world, xTile, yTile, 1)) {
          return false
        }
        x += slope
        const newXTile = x >>> 16
        if (newXTile !== xTile && Pathing.collidesWithAnyEntities(world, newXTile, yTile, 1)) {
          return false
        }
      }
    }
    return true
  }
}
