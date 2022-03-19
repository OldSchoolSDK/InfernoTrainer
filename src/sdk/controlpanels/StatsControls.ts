
import StatsPanel from '../../assets/images/panels/stats.png'
import StatsTab from '../../assets/images/tabs/stats.png'
import { ControlPanelController } from '../ControlPanelController'
import { Settings } from '../Settings'
import { World } from '../World'
import { BaseControls } from './BaseControls'

export class StatsControls extends BaseControls {
  get panelImageReference () {
    return StatsPanel
  }

  get tabImageReference () {
    return StatsTab
  }

  levelPrompt(skill: string): number {

    const newLvl = parseInt(prompt("What level would you like to set your "+skill+"?", "99"))
    if (isNaN(newLvl)){
      return -1;
    }
    if (newLvl > 0 && newLvl < 100) {
      return newLvl
    }
    return -1;
  }

  panelClickUp (world: World, x: number, y: number) {
    let scale = 0.9;

    x = x / scale;
    y = y / scale;
    
    if (x > 9 && x < 73) {
      if (y > 12 && y < 44) {
        
        const newLvl = this.levelPrompt('attack')
        if (newLvl > 0) {
          world.player.stats.attack = newLvl;
          world.player.currentStats.attack = newLvl;
          Settings.player_stats = world.player.stats;
          Settings.persistToStorage();  
        }

      }else if (y > 44 && y < 76) {
        // str

        const newLvl = this.levelPrompt('strength')
        if (newLvl > 0) {
          world.player.stats.strength = newLvl;
          world.player.currentStats.strength = newLvl;
          Settings.player_stats = world.player.stats;
          Settings.persistToStorage();  
        }
      }else if (y > 76 && y < 108) {
        // def
        const newLvl = this.levelPrompt('defence')
        if (newLvl > 0) {
          world.player.stats.defence = newLvl;
          world.player.currentStats.defence = newLvl;
          Settings.player_stats = world.player.stats;
          Settings.persistToStorage();  
        }
      }else if (y > 108 && y < 140) {
        // ranged
        const newLvl = this.levelPrompt('range')
        if (newLvl > 0) {
          world.player.stats.range = newLvl;
          world.player.currentStats.range = newLvl;
          Settings.player_stats = world.player.stats;
          Settings.persistToStorage();  
        }
      }else if (y > 140 && y < 172) {
        //prayer
        const newLvl = this.levelPrompt('prayer')
        if (newLvl > 0) {
          world.player.stats.prayer = newLvl;
          world.player.currentStats.prayer = newLvl;
          Settings.player_stats = world.player.stats;
          Settings.persistToStorage();  
        }
      }else if (y > 172 && y < 204) {
        //magic
        const newLvl = this.levelPrompt('magic')
        if (newLvl > 0) {
          world.player.stats.magic = newLvl;
          world.player.currentStats.magic = newLvl;
          Settings.player_stats = world.player.stats;
          Settings.persistToStorage();  
        }
      }
    }else if (x > 74 && x < 138){
      if (y > 12 && y < 44) {
        // hp
        const newLvl = this.levelPrompt('hitpoint')
        if (newLvl > 0) {
          world.player.stats.hitpoint = newLvl;
          world.player.currentStats.hitpoint = newLvl;
          Settings.player_stats = world.player.stats;
          Settings.persistToStorage();  
        }
      }else if (y > 44 && y < 76) {
        // agility
        const newLvl = this.levelPrompt('agility')
        if (newLvl > 0) {
          world.player.stats.agility = newLvl;
          world.player.currentStats.agility = newLvl;
          Settings.player_stats = world.player.stats;
          Settings.persistToStorage();  
        }
      }
    }else if (x > 138 && x < 202){
      
    }
  }

  get appearsOnLeftInMobile (): boolean {
    return false;
  }
  
  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    
    super.draw(world, ctrl, x, y)


    let scale = 0.9;

    world.viewport.context.font = (16 * scale) + 'px Stats_11'
    
    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.currentStats.attack), x + 49 * scale, y + 22 * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.currentStats.attack), x + 48 * scale, y + 21 * scale)

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.stats.attack), x + 61 * scale, y + 36 * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.stats.attack), x + 60 * scale, y + 35 * scale)



    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.currentStats.strength), x + 49 * scale, y + (22 + 32) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.currentStats.strength), x + 48 * scale, y + (21 + 32) * scale)

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.stats.strength), x + 61 * scale, y + (36 + 32) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.stats.strength), x + 60 * scale, y + (35 + 32) * scale)



    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.currentStats.defence), x + 49 * scale, y + (22 + 64) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.currentStats.defence), x + 48 * scale, y + (21 + 64) * scale)

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.stats.defence), x + 61 * scale, y + (36 + 64) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.stats.defence), x + 60 * scale, y + (35 + 64) * scale)



    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.currentStats.range), x + 49 * scale, y + (22 + 96) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.currentStats.range), x + 48 * scale, y + (21 + 96) * scale)

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.stats.range), x + 61 * scale, y + (36 + 96) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.stats.range), x + 60 * scale, y + (35 + 96) * scale)


    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.currentStats.prayer), x + 49 * scale, y + (22 + 128) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.currentStats.prayer), x + 48 * scale, y + (21 + 128) * scale)

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.stats.prayer), x + 61 * scale, y + (36 + 128) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.stats.prayer), x + 60 * scale, y + (35 + 128) * scale)



    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.currentStats.magic), x + 49 * scale, y + (22 + 160) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.currentStats.magic), x + 48 * scale, y + (21 + 160) * scale)

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.stats.magic), x + 61 * scale, y + (36 + 160) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.stats.magic), x + 60 * scale, y + (35 + 160) * scale)


    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.currentStats.hitpoint), x + (49 + 63) * scale, y + 22 * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.currentStats.hitpoint), x + (48 + 63) * scale, y + 21 * scale)

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.stats.hitpoint), x + (61 + 63) * scale, y + 36 * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.stats.hitpoint), x + (60 + 63) * scale, y + 35 * scale)


    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.currentStats.agility), x + (49 + 63) * scale, y + (22 + 32) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.currentStats.agility), x + (48 + 63) * scale, y + (21 + 32) * scale)

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(String(world.player.stats.agility), x + (61 + 63) * scale, y + (36 + 32) * scale)
    world.viewport.context.fillStyle = '#FFFF00'
    world.viewport.context.fillText(String(world.player.stats.agility), x + (60 + 63) * scale, y + (35 + 32) * scale)

  }
}
