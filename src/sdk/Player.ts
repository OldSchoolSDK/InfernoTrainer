'use strict'
import { Pathing } from './Pathing'
import { Settings } from './Settings'
import { LineOfSight } from './LineOfSight'
import { minBy, range, filter, find, map, min } from 'lodash'
import { Unit, UnitTypes, UnitStats, UnitBonuses, UnitOptions } from './Unit'
import { XpDropController } from './XpDropController'
import { Game } from './Game'
import { Weapon } from './Weapons/Weapon'
import { BasePrayer } from './Prayers/BasePrayer'
import { XpDrop, XpDropAggregator } from './XpDrop'
import { Location } from './GameObject'
import { Mob } from './Mob'
import { ImageLoader } from './Utils/ImageLoader'
import { MapController } from './MapController'

export interface PlayerStats extends UnitStats { 
  prayer: number;
  run: number;
  specialAttack: number;
}

export class Player extends Unit {
  weapon?: Weapon;
  manualSpellCastSelection: Weapon;
  destinationLocation?: Location;

  stats: PlayerStats;
  currentStats: PlayerStats;
  bonuses: UnitBonuses;
  xpDrops: XpDropAggregator;
  overhead: BasePrayer;
  running: boolean = true;

  constructor (game: Game, location: Location, options: UnitOptions) {
    super(game, location, options)
    this.destinationLocation = location
    this.weapon = options.weapon
    this.clearXpDrops();

    ImageLoader.onAllImagesLoaded(() => MapController.controller.updateOrbsMask(this.currentStats, this.stats)  )

  }

  setStats () {
    // non boosted numbers
    this.stats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99,
      prayer: 99,
      run: 100,
      specialAttack: 100
    }

    // with boosts
    this.currentStats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99,
      prayer: 99,
      run: 100,
      specialAttack: 100
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
    return UnitTypes.PLAYER
  }

  clearXpDrops() {
    this.xpDrops = {};
  }

  grantXp(xpDrop: XpDrop) {
    if (!this.xpDrops[xpDrop.skill]){
      this.xpDrops[xpDrop.skill] = 0;
    }
    this.xpDrops[xpDrop.skill] += xpDrop.xp;
  }

  sendXpToController() {
    Object.keys(this.xpDrops).forEach((skill) => {
      XpDropController.controller.registerXpDrop({ skill, xp: Math.ceil(this.xpDrops[skill])});
    })
    
    this.clearXpDrops();
  }

  moveTo (x: number, y: number) {
    this.aggro = null
    this.manualSpellCastSelection = null

    const clickedOnEntities = Pathing.collideableEntitiesAtPoint(this.game, x, y, 1)
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
          const e = Pathing.collideableEntitiesAtPoint(this.game, potentialX, potentialY, 1)
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
      const winner = minBy(bestDistances, (distance) => Pathing.dist(distance.x, distance.y, this.location.x, this.location.y))
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
      this.manualSpellCastSelection.cast(this.game, this, this.aggro)
      this.manualSpellCastSelection = null
    } else {
      // use equipped weapon
      this.weapon.attack(this.game, this, this.aggro)
    }

    // this.playAttackSound();
  }

  activatePrayers () {
    this.lastOverhead = this.overhead
    this.overhead = find(this.game.player.prayers, (prayer: BasePrayer) => prayer.isOverhead() && prayer.isActive)
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
            if (Pathing.canTileBePathedTo(this.game, x, y, 1, {} as Mob)) {
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


        const seekingTiles: Location[] = [];
        // "When clicking on an npc, object, or player, the requested tiles will be all tiles"
        // "within melee range of the npc, object, or player."
        // For implementation reasons we also ensure the north/south tiles are added to seekingTiles *first* so that
        // in cases of ties, the north and south tiles are picked by minBy below.
        const aggroSize = this.aggro.size;
        range(0, aggroSize).forEach(xx => {
          [-1, this.aggro.size].forEach(yy => {
            // Don't path into an unpathable object.
            const px = this.aggro.location.x + xx;
            const py = this.aggro.location.y - yy;
            if (!Pathing.collidesWithAnyEntities(this.game, px, py, 1)) {
              seekingTiles.push({
                x: px,
                y: py
              });
            }
          });
        });
        range(0, aggroSize).forEach(yy => {
          [-1, this.aggro.size].forEach(xx => {
            // Don't path into an unpathable object.
            const px = this.aggro.location.x + xx;
            const py = this.aggro.location.y - yy;
            if (!Pathing.collidesWithAnyEntities(this.game, px, py, 1)) {
              seekingTiles.push({
                x: px,
                y: py
              });
            }
          });
        });
        // Create paths to all npc tiles
        const potentialPaths = map(seekingTiles, (point) => Pathing.constructPath(this.game, this.location, { x: point.x, y: point.y }));
        const potentialPathLengths = map(potentialPaths, (path) => path.length);
        // Figure out what the min distance is
        const shortestPathLength = min(potentialPathLengths);
        // Get all of the paths of the same minimum distance (can be more than 1)
        const shortestPaths = filter(map(potentialPathLengths, (length, index) => (length === shortestPathLength) ? seekingTiles[index] : null));
        // Take the path that is the shortest absolute distance from player
        this.destinationLocation = minBy(shortestPaths, (point) => Pathing.dist(this.location.x, this.location.y, point.x, point.y));

      } else {
        this.destinationLocation = this.location
      }
    }
  }

  moveTorwardsDestination () {
    this.perceivedLocation = this.location
    // Actually move the player forward by run speed.
    if (this.destinationLocation) {
      this.location = Pathing.path(this.game, this.location, this.destinationLocation, this.running ? 2 : 1, this.aggro)
    }
  }

  movementStep () {

  
    this.activatePrayers()

    this.pathToAggro()

    this.processIncomingAttacks()

    
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

  attackStep (game: Game) {
    this.clearXpDrops();

    this.attackIfPossible()

    this.sendXpToController();

    if (this.game.mapController){
      this.game.mapController.updateOrbsMask(this.currentStats, this.stats);
    }
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

  draw (tickPercent: number) {
    LineOfSight.drawLOS(this.game, this.location.x, this.location.y, this.size, this.attackRange, '#00FF0099', this.type === UnitTypes.MOB)

    const perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, tickPercent)
    const perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, tickPercent)

    // Perceived location

    this.game.ctx.globalAlpha = 0.7
    this.game.ctx.fillStyle = '#FFFF00'
    this.game.ctx.fillRect(
      perceivedX * Settings.tileSize,
      perceivedY * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )
    this.game.ctx.globalAlpha = 1

    // Draw player on true tile
    this.game.ctx.fillStyle = '#fff'
    // feedback for when you shoot
    if (this.shouldShowAttackAnimation()) {
      this.game.ctx.fillStyle = '#00FFFF'
    }
    this.game.ctx.strokeStyle = '#FFFFFF73'
    this.game.ctx.lineWidth = 3
    this.game.ctx.fillRect(
      this.location.x * Settings.tileSize,
      this.location.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )

    // Destination location
    this.game.ctx.strokeStyle = '#FFFFFF73'
    this.game.ctx.lineWidth = 3
    this.game.ctx.strokeRect(
      this.destinationLocation.x * Settings.tileSize,
      this.destinationLocation.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    )

    this.game.ctx.save()

    this.drawIncomingProjectiles(tickPercent);

    this.game.ctx.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2,
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )

    if (Settings.rotated === 'south') {
      this.game.ctx.rotate(Math.PI)
    }



    this.drawHPBar()
    this.drawHitsplats()
    this.drawOverheadPrayers()

    this.game.ctx.restore()
  }
}
