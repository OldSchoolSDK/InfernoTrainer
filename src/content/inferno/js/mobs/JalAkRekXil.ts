'use strict'

import { Mob } from '../../../../sdk/Mob'
import { Settings } from '../../../../sdk/Settings'
import { RangedWeapon } from '../../../../sdk/Weapons/RangedWeapon'
import JalAkRekMejImage from '../../assets/images/Jal-AkRek-Mej.png'

export class JalAkRekXil extends Mob {
  get displayName () {
    return 'Jal-AkRek-Xil'
  }

  get combatLevel () {
    return 70
  }

  get combatLevelColor () {
    return 'lime'
  }

  drawOnTile(tickPercent: number) {

    if (this.dying > -1) {
      this.world.worldCtx.fillStyle = '#964B0073'
    }{
      this.world.worldCtx.fillStyle = '#00FF00'
    }

    // Draw mob
    this.world.worldCtx.fillRect(
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }
  setStats () {

    this.weapons = {
      range: new RangedWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 1,
      strength: 1,
      defence: 95,
      range: 120,
      magic: 1,
      hitpoint: 15
    }

    // with boosts
    this.currentStats = JSON.parse(JSON.stringify(this.stats))

    this.bonuses = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 25
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 25
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 25,
        magicDamage: 0,
        prayer: 0
      }
    }
  }

  get cooldown () {
    return 4
  }

  get attackRange () {
    return 5
  }

  get size () {
    return 1
  }

  get image () {
    return JalAkRekMejImage
  }

  get sound (): string {
    return null
  }

  get color () {
    return '#aadd7333'
  }

  get attackStyle () {
    return 'range'
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.translate(Math.sin(tickPercent * Math.PI * 4) * 2, Math.sin(tickPercent * Math.PI * -2))
  }
}
