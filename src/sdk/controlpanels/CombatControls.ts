
import InventoryPanel from '../../assets/images/panels/inventory.png'
import CombatTab from '../../assets/images/tabs/combat.png'
import { ControlPanelController } from '../ControlPanelController'
import { ImageLoader } from '../utils/ImageLoader'
import { World } from '../World'
import { BaseControls } from './BaseControls'
import SelectedCombatStyleButtonImage from '../../assets/images/attackstyles/interface/attack_style_button_highlighted.png'
import CombatStyleButtonImage from '../../assets/images/attackstyles/interface/attack_style_button.png'
import SelectedAutoRetaliateButtonImage from '../../assets/images/attackstyles/interface/auto_retal_button_highlighted.png'
import AutoRetaliateButtonImage from '../../assets/images/attackstyles/interface/auto_retal_button.png'
import { AttackStyle, AttackStylesController } from '../AttackStylesController'
import { Weapon } from '../gear/Weapon'
import { Location } from '../../sdk/Location'
import { startCase, toLower } from 'lodash'
import { Settings } from '../Settings'

export class CombatControls extends BaseControls {
  selectedCombatStyleButtonImage: HTMLImageElement = ImageLoader.createImage(SelectedCombatStyleButtonImage)
  combatStyleButtonImage: HTMLImageElement = ImageLoader.createImage(CombatStyleButtonImage)
  autoRetailButtonImage: HTMLImageElement = ImageLoader.createImage(AutoRetaliateButtonImage)
  selectedAutoRetailButtonImage: HTMLImageElement = ImageLoader.createImage(SelectedAutoRetaliateButtonImage)

  get panelImageReference () {
    return InventoryPanel
  }

  get tabImageReference () {
    return CombatTab
  }


  get keyBinding () {
    return Settings.combat_key
  }


  panelClickDown (world: World, x: number, y: number) {
    const scale = Settings.controlPanelScale;

    x = x / scale;
    y = y / scale;

    const attackStyleOffsets = [
      { x: 25, y: 45},
      { x: 105, y: 45},
      { x: 25, y: 100},
      { x: 105, y: 100},
    ]
    const weapon = world.player.equipment.weapon;
    const attackStyles = weapon.attackStyles();

    attackStyleOffsets.slice(0, attackStyles.length).forEach((offset: Location, index: number) => {
      if (offset.x < x && x < offset.x + 70 && offset.y < y && y < offset.y + 48){
        AttackStylesController.controller.setWeaponAttackStyle(weapon, attackStyles[index])
      }
    });

    if (x > 28 && x < 175 && y > 160 && y < 200) {
      world.player.autoRetaliate = !world.player.autoRetaliate;
    }

  }


  get isAvailable (): boolean {
    return true;
  }
  
  drawAttackStyleButton(world: World, weapon: Weapon, attackStyle: AttackStyle, attackStyleImage: HTMLImageElement, x: number, y: number) {
    
    const scale = Settings.controlPanelScale;
    const currentAttackStyle = weapon.attackStyle();

    const currentAttackStyleImage = currentAttackStyle === attackStyle ? this.selectedCombatStyleButtonImage : this.combatStyleButtonImage;
    world.viewport.context.drawImage(   
      currentAttackStyleImage,   
      x,
      y,
      currentAttackStyleImage.width * scale,
      currentAttackStyleImage.height * scale
    )

    world.viewport.context.drawImage(      
      attackStyleImage,
      x + (35 - Math.floor(attackStyleImage.width / 2)) * scale,
      y + (5) * scale,
      attackStyleImage.width * scale,
      attackStyleImage.height * scale
    )


    world.viewport.context.font = (16*scale) + 'px Stats_11'
    world.viewport.context.textAlign = 'center'

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(startCase(toLower(attackStyle)), x + 36 * scale, y + 41*scale)

    world.viewport.context.fillStyle = '#FF9700'
    world.viewport.context.fillText(startCase(toLower(attackStyle)), x + 35 * scale, y + 40*scale)

  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(world, ctrl, x, y)

    const scale = Settings.controlPanelScale;
    
    
    const weapon = world.player.equipment.weapon;

    if (!weapon){
      return;
    }


    world.viewport.context.font = (21 * scale) + 'px Stats_11'
    world.viewport.context.textAlign = 'center'

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(startCase(toLower(weapon.itemName)), x + 101 * scale, y + 31 * scale)

    world.viewport.context.fillStyle = '#FF9700'
    world.viewport.context.fillText(startCase(toLower(weapon.itemName)), x + 100 * scale, y + 30 * scale)





    const attackStyleOffsets = [
      { x: 25, y: 45},
      { x: 105, y: 45},
      { x: 25, y: 100},
      { x: 105, y: 100},
    ]

    const attackStyles = weapon.attackStyles();

    const imageMap = AttackStylesController.attackStyleImageMap[weapon.attackStyleCategory()];
    if (imageMap){

      attackStyles.forEach((style: AttackStyle, index: number) => {
        const offsets = attackStyleOffsets[index];
  
        const attackStyleImage = imageMap[weapon.attackStyles()[index]]
        if (attackStyleImage){
          this.drawAttackStyleButton(world, weapon, weapon.attackStyles()[index], attackStyleImage, x + offsets.x * scale, y + offsets.y * scale)      
        }
      })
  
    }

    const autoRetailateImage = world.player.autoRetaliate ? this.selectedAutoRetailButtonImage : this.autoRetailButtonImage;
    world.viewport.context.drawImage(      
      autoRetailateImage,
      x + 25 * scale,
      y + 155 * scale,
      autoRetailateImage.width * scale,
      autoRetailateImage.height * scale
    )


    world.viewport.context.font = (19* scale)+'px Stats_11'
    world.viewport.context.textAlign = 'center'

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText("Auto Retaliate", x + 116 * scale, y + 183 * scale)

    world.viewport.context.fillStyle = '#FF9700'
    world.viewport.context.fillText("Auto Retaliate", x + 115 * scale, y + 182 * scale)


  }

}
