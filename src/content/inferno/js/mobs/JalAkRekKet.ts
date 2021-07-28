'use strict'

import { MeleeWeapon } from '../../../../sdk/sdfg/MeleeWeapon'
import { Mob } from '../../../../sdk/Mob'
import JalAkRekKetImage from '../../assets/images/Jal-AkRek-Ket.png'
import { Settings } from '../../../../sdk/Settings'

export class JalAkRekKet extends Mob {
  get displayName () {
    return 'Jal-AkRek-Ket'
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
      this.world.worldCtx.fillStyle = '#FF0000'
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
      crush: new MeleeWeapon()
    }

    // non boosted numbers
    this.stats = {
      attack: 120,
      strength: 120,
      defence: 95,
      range: 1,
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
        stab: 25,
        slash: 25,
        crush: 25,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 25,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      }
    }
  }

  get cooldown () {
    return 4
  }

  get attackRange () {
    return 1
  }

  get size () {
    return 1
  }

  get image () {
    return JalAkRekKetImage
  }

  get sound (): string {
    return null
  }

  get color () {
    return '#aadd7333'
  }

  get attackStyle () {
    return 'crush'
  }

  attackAnimation (tickPercent: number) {
    this.world.worldCtx.translate(Math.sin(tickPercent * Math.PI * 4) * 2, Math.sin(tickPercent * Math.PI * -2))
  }
}
