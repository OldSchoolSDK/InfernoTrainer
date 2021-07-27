'use strict'
import { filter, remove } from 'lodash'
import { Settings } from '../../../sdk/Settings'
import { Entity } from '../../../sdk/Entity'

import MissSplat from '../../../assets/images/hitsplats/miss.png'
import DamageSplat from '../../../assets/images/hitsplats/damage.png'
import { World } from '../../../sdk/World'
import { UnitBonuses, UnitStats } from '../../../sdk/Unit'
import { Projectile } from '../../../sdk/Weapons/Projectile'
import { Location } from '../../../sdk/GameObject'
import { ImageLoader } from '../../../sdk/Utils/ImageLoader'

export class InfernoPillar extends Entity {
  incomingProjectiles: Projectile[] = [];
  missedHitsplatImage: HTMLImageElement;
  damageHitsplatImage: HTMLImageElement;
  stats: UnitStats;
  currentStats: UnitStats;
  bonuses: UnitBonuses;

  constructor (world: World, point: Location) {
    super(world, point)

    this.missedHitsplatImage = ImageLoader.createImage(MissSplat)
    this.damageHitsplatImage = ImageLoader.createImage(DamageSplat)

    // non boosted numbers
    this.stats = {
      attack: 0,
      strength: 0,
      defence: 0,
      range: 0,
      magic: 0,
      hitpoint: 255
    }

    // with boosts
    this.currentStats = {
      attack: 0,
      strength: 0,
      defence: 0,
      range: 0,
      magic: 0,
      hitpoint: 255
    }

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }
  }

  tick () {
    this.incomingProjectiles = filter(this.incomingProjectiles, (projectile: Projectile) => projectile.remainingDelay > -1)

    this.incomingProjectiles.forEach((projectile) => {
      projectile.remainingDelay--
      if (projectile.remainingDelay <= 0) {
        this.currentStats.hitpoint -= projectile.damage
      }
    })
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint)

    if (this.currentStats.hitpoint <= 0) {
      return this.dead()
    }
  }

  draw () {
    this.world.worldCtx.fillStyle = '#000073'

    this.world.worldCtx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }



  drawUILayer(tickPercent: number){


    this.world.worldCtx.save()

    this.world.worldCtx.translate(
      (this.location.x * Settings.tileSize + this.size * Settings.tileSize / 2),
      ((this.location.y + 1) * Settings.tileSize - ((this.size) * Settings.tileSize) / 2)
    )

    if (Settings.rotated === 'south') {
      this.world.worldCtx.rotate(Math.PI)
    }

    this.world.worldCtx.fillStyle = 'red'
    this.world.worldCtx.fillRect(
      (-this.size / 2) * Settings.tileSize,
      (-this.size / 2) * Settings.tileSize,
      Settings.tileSize * this.size,
      5
    )

    this.world.worldCtx.fillStyle = 'green'
    const w = (this.currentStats.hitpoint / this.stats.hitpoint) * (Settings.tileSize * this.size)
    this.world.worldCtx.fillRect(
      (-this.size / 2) * Settings.tileSize,
      (-this.size / 2) * Settings.tileSize,
      w,
      5
    )

    let projectileOffsets: number[][] = [
      [0, 0],
      [0, -16],
      [-12, -8],
      [12, -8]
    ]

    let projectileCounter = 0
    this.incomingProjectiles.forEach((projectile) => {
      if (projectile.remainingDelay > 0) {
        return
      }
      if (projectileCounter > 3) {
        return
      }
      projectileCounter++
      const image = (projectile.damage === 0) ? this.missedHitsplatImage : this.damageHitsplatImage
      if (!projectile.offsetX && !projectile.offsetY) {
        projectile.offsetX = projectileOffsets[0][0]
        projectile.offsetY = projectileOffsets[0][1]
      }

      projectileOffsets = remove(projectileOffsets, (offset: number[]) => {
        return offset[0] !== projectile.offsetX || offset[1] !== projectile.offsetY
      })

      this.world.worldCtx.drawImage(
        image,
        projectile.offsetX - 12,
        -((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY,
        24,
        23
      )
      this.world.worldCtx.fillStyle = '#FFFFFF'
      this.world.worldCtx.font = '16px Stats_11'
      this.world.worldCtx.textAlign = 'center'
      this.world.worldCtx.fillText(
        String(projectile.damage),
        projectile.offsetX,
        -((this.size + 1) * Settings.tileSize) / 2 - projectile.offsetY + 15
      )
      this.world.worldCtx.textAlign = 'left'
    })
    this.world.worldCtx.restore()
  }

  get size() {
    return 3;
  }

  dead () {
    this.dying = 3
    // TODO: needs to AOE the nibblers around it
  }

  addProjectile (projectile: Projectile) {
    this.incomingProjectiles.push(projectile)
  }

  static addPillarsToWorld (world: World) {
    [
      { x: 0, y: 9 },
      { x: 17, y: 7 },
      { x: 10, y: 23 }
    ].forEach((position) => world.addEntity(new InfernoPillar(world, position)))
  }
}
