'use strict'
import { Pathing } from './Pathing'
import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import _ from 'lodash'
import { Unit } from './Unit'
import { XpDropController } from './XPDropController'

export class Player extends Unit {
  constructor (region, location, options) {
    super(region, location, options)
    this.destinationLocation = -1
    this.weapon = options.weapon
    this.clearXpDrops();
  }

  setStats () {
    // non boosted numbers
    this.stats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99
    }

    // with boosts
    this.currentStats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99
    }

    this.bonuses = {
      attack: {
        stab: -1,
        slash: -1,
        crush: -1,
        magic: 53,
        range: 128
      },
      defence: {
        stab: 213,
        slash: 202,
        crush: 219,
        magic: 135,
        range: 215
      },
      other: {
        meleeStrength: 15,
        rangedStrength: 62,
        magicDamage: 1.27,
        prayer: 12
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }

  get type () {
    return Unit.types.PLAYER
  }

  get size () {
    return 1
  }

  clearXpDrops() {
    this.xpDrops = {};
  }

  grantXp(xpDrop) {
    if (!this.xpDrops[xpDrop.skill]){
      this.xpDrops[xpDrop.skill] = 0;
    }
    this.xpDrops[xpDrop.skill] += xpDrop.xp;
  }

  sendXpToController() {
    Object.keys(this.xpDrops).forEach((skill) => {
      XpDropController.controller.registerXpDrop({ skill, xp: this.xpDrops[skill]});
    })
    
    this.clearXpDrops();
  }

  moveTo (x, y) {
    this.aggro = null
    this.manualSpellCastSelection = null

    const clickedOnEntities = Pathing.entitiesAtPoint(this.region, x, y, 1)
    if (clickedOnEntities.length) {
      // Clicked on an entity, scan around to find the best spot to actually path to
      const clickedOnEntity = clickedOnEntities[0]
      const maxDist = Math.ceil(clickedOnEntity.size / 2)
      let bestDistances = []
      let bestDistance = 9999
      for (let yOff = -maxDist; yOff < maxDist; yOff++) {
        for (let xOff = -maxDist; xOff < maxDist; xOff++) {
          const potentialX = x + xOff
          const potentialY = y + yOff
          const e = Pathing.entitiesAtPoint(this.region, potentialX, potentialY, 1)
          if (e.length === 0) {
            const distance = Pathing.dist(potentialX, potentialY, x, y)
            if (distance <= bestDistance) {
              if (bestDistances[0] && bestDistances[0].bestDistance > distance) {
                bestDistance = distance
                bestDistances = []
              }
              bestDistances.push({ x: potentialX, y: potentialY, bestDistance })
            }
          }
        }
      }
      const winner = _.minBy(bestDistances, (distance) => Pathing.dist(distance.x, distance.y, this.location.x, this.location.y))
      if (winner) {
        this.destinationLocation = { x: winner.x, y: winner.y }
      }
    } else {
      this.destinationLocation = { x, y }
    }
  }

  dead () {

  }

  attack () {
    if (this.manualSpellCastSelection) {
      this.manualSpellCastSelection.cast(this.region, this, this.aggro)
      this.manualSpellCastSelection = null
    } else {
      // use equipped weapon
      this.weapon.attack(this.region, this, this.aggro)
    }

    // this.playAttackSound();
  }

  activatePrayers () {
    this.lastOverhead = this.overhead
    this.overhead = _.find(this.region.player.prayers, prayer => prayer.isOverhead() && prayer.isActive)
    if (this.lastOverhead && !this.overhead) {
      this.lastOverhead.playOffSound()
    } else if (this.lastOverhead !== this.overhead) {
      this.overhead.playOnSound()
    }
  }

  pathToAggro () {
    if (this.aggro) {
      if (this.aggro.dying > -1) {
        this.aggro = null
        this.destinationLocation = this.location
        return
      }
      const isUnderAggrodMob = Pathing.collisionMath(this.location.x, this.location.y, 1, this.aggro.location.x, this.aggro.location.y, this.aggro.size)
      this.setHasLOS()

      if (isUnderAggrodMob) {
        const maxDist = Math.ceil(this.aggro.size / 2)
        let bestDistance = 9999
        let winner = null
        for (let yy = -maxDist; yy < maxDist; yy++) {
          for (let xx = -maxDist; xx < maxDist; xx++) {
            const x = this.location.x + xx
            const y = this.location.y + yy
            if (Pathing.canTileBePathedTo(this.region, x, y, 1, true)) {
              const distance = Pathing.dist(this.location.x, this.location.y, x, y)
              if (distance > 0 && distance < bestDistance) {
                bestDistance = distance
                winner = { x, y }
              }
            }
          }
        }
        if (winner) {
          this.destinationLocation = { x: winner.x, y: winner.y }
        } else {
          console.log("I don't understand what could cause this, but i'd like to find out")
        }
      } else if (!this.hasLOS) {
        const seekingTiles = []
        // "When clicking on an npc, object, or player, the requested tiles will be all tiles"
        // "within melee range of the npc, object, or player."
        for (let xx = -1; xx <= this.aggro.size; xx++) {
          for (let yy = -1; yy <= this.aggro.size; yy++) {
            // Edges only, and no corners.
            if ((xx === -1 || xx === this.aggro.size || yy === -1 || yy === this.aggro.size) &&
              ((xx !== yy) && (xx !== -1 || yy !== this.aggro.size) && (xx !== this.aggro.size || yy !== -1))) {
              // Don't path into an unpathable object.
              const px = this.aggro.location.x + xx
              const py = this.aggro.location.y - yy
              if (!Pathing.collidesWithAnyEntities(this.region, px, py, 1)) {
                seekingTiles.push({
                  x: px,
                  y: py
                })
              }
            }
          }
        }
        // Create paths to all npc tiles
        const potentialPaths = _.map(seekingTiles, (point) => Pathing.constructPath(this.region, this.location, { x: point.x, y: point.y }))
        const validPaths = _.filter(potentialPaths, (path) => {
          return true
        })
        const validPathLengths = _.map(validPaths, (path) => path.length)
        // Figure out what the min distance is
        const shortestPathLength = _.min(validPathLengths)
        // Get all of the paths of the same minimum distance (can be more than 1)
        const shortestPaths = _.filter(_.map(validPathLengths, (length, index) => (length === shortestPathLength) ? seekingTiles[index] : null))
        // Take the path that is the shortest absolute distance from player
        this.destinationLocation = _.minBy(shortestPaths, (point) => Pathing.dist(this.location.x, this.location.y, point.x, point.y))
      } else {
        this.destinationLocation = this.location
      }
    }
  }

  moveTorwardsDestination () {
    this.perceivedLocation = this.location
    // Actually move the player forward by run speed.
    if (this.destinationLocation) {
      this.location = Pathing.path(this.region, this.location, this.destinationLocation, 2, this.aggro)
    }
  }

  movementStep () {

    this.activatePrayers()

    this.pathToAggro()

    this.moveTorwardsDestination()
  }

  get attackRange () {
    if (this.manualSpellCastSelection) {
      return this.manualSpellCastSelection.attackRange
    }
    return this.weapon.attackRange
  }

  get attackSpeed () {
    if (this.manualSpellCastSelection) {
      return this.manualSpellCastSelection.attackSpeed
    }
    return this.weapon.attackSpeed
  }

  attackStep () {
    this.clearXpDrops();

    this.processIncomingAttacks()

    this.attackIfPossible()

    this.sendXpToController();
  }

  attackIfPossible () {
    this.attackCooldownTicks--
    if (this.aggro) {
      this.setHasLOS()
      if (this.hasLOS && this.aggro && this.attackCooldownTicks <= 0) {
        this.attack()
        this.attackCooldownTicks = this.attackSpeed
      }
    }
  }

  draw (framePercent) {
    LineOfSight.drawLOS(this.region, this.location.x, this.location.y, this.size, this.attackRange, '#00FF0099', this.type === Unit.types.MOB)

    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, framePercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, framePercent)

    // Perceived location

    this.region.ctx.globalAlpha = 0.7
    this.region.ctx.fillStyle = '#FFFF00'
    this.region.ctx.fillRect(
      perceivedX * Settings.tileSize,
      perceivedY * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )
    this.region.ctx.globalAlpha = 1

    // Draw player on true tile
    this.region.ctx.fillStyle = '#fff'
    // feedback for when you shoot
    if (this.shouldShowAttackAnimation()) {
      this.region.ctx.fillStyle = '#00FFFF'
    }
    this.region.ctx.strokeStyle = '#FFFFFF73'
    this.region.ctx.lineWidth = 3
    this.region.ctx.fillRect(
      this.location.x * Settings.tileSize,
      this.location.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )

    // Destination location
    this.region.ctx.strokeStyle = '#FFFFFF73'
    this.region.ctx.lineWidth = 3
    this.region.ctx.strokeRect(
      this.destinationLocation.x * Settings.tileSize,
      this.destinationLocation.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )

    this.region.ctx.save()

    this.region.ctx.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )

    if (Settings.rotated === 'south') {
      this.region.ctx.rotate(Math.PI)
    }

    this.drawHPBar()
    this.drawIncomingProjectiles()
    this.drawOverheadPrayers()

    this.region.ctx.restore()
  }
}
