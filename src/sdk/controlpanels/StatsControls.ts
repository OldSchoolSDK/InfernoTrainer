
import StatsPanel from '../../assets/images/panels/stats.png'
import StatsTab from '../../assets/images/tabs/stats.png'
import { ControlPanelController } from '../ControlPanelController'
import { World } from '../World'
import { BaseControls } from './BaseControls'

export class StatsControls extends BaseControls {
  get panelImageReference () {
    return StatsPanel
  }

  get tabImageReference () {
    return StatsTab
  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(world, ctrl, x, y)


    world.viewportCtx.font = '16px Stats_11'
    
    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.currentStats.attack), x + 49, y + 22)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.currentStats.attack), x + 48, y + 21)

    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.stats.attack), x + 61, y + 36)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.stats.attack), x + 60, y + 35)



    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.currentStats.strength), x + 49, y + 22 + 32)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.currentStats.strength), x + 48, y + 21 + 32)

    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.stats.strength), x + 61, y + 36 + 32)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.stats.strength), x + 60, y + 35 + 32)



    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.currentStats.defence), x + 49, y + 22 + 64)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.currentStats.defence), x + 48, y + 21 + 64)

    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.stats.defence), x + 61, y + 36 + 64)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.stats.defence), x + 60, y + 35 + 64)



    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.currentStats.range), x + 49, y + 22 + 96)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.currentStats.range), x + 48, y + 21 + 96)

    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.stats.range), x + 61, y + 36 + 96)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.stats.range), x + 60, y + 35 + 96)


    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.currentStats.prayer), x + 49, y + 22 + 128)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.currentStats.prayer), x + 48, y + 21 + 128)

    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.stats.prayer), x + 61, y + 36 + 128)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.stats.prayer), x + 60, y + 35 + 128)



    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.currentStats.magic), x + 49, y + 22 + 160)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.currentStats.magic), x + 48, y + 21 + 160)

    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.stats.magic), x + 61, y + 36 + 160)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.stats.magic), x + 60, y + 35 + 160)


    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.currentStats.hitpoint), x + 49 + 63, y + 22)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.currentStats.hitpoint), x + 48 + 63, y + 21)

    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.stats.hitpoint), x + 61 + 63, y + 36)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.stats.hitpoint), x + 60 + 63, y + 35)


    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.currentStats.agility), x + 49 + 63, y + 22 + 32)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.currentStats.agility), x + 48 + 63, y + 21 + 32)

    world.viewportCtx.fillStyle = '#000'
    world.viewportCtx.fillText(String(world.player.stats.agility), x + 61 + 63, y + 36 + 32)
    world.viewportCtx.fillStyle = '#FFFF00'
    world.viewportCtx.fillText(String(world.player.stats.agility), x + 60 + 63, y + 35 + 32)

  }
}
