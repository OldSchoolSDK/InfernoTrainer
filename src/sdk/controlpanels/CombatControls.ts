
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
import { find, startCase, toLower } from 'lodash'

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



  panelClickDown (world: World, x: number, y: number) {
    
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


  drawAttackStyleButton(world: World, weapon: Weapon, attackStyle: AttackStyle, attackStyleImage: HTMLImageElement, x: number, y: number) {
    
    const currentAttackStyle = weapon.attackStyle();

    world.viewport.context.drawImage(      
      currentAttackStyle === attackStyle ? this.selectedCombatStyleButtonImage : this.combatStyleButtonImage,
      x,
      y
    )

    world.viewport.context.drawImage(      
      attackStyleImage,
      x + 35 - Math.floor(attackStyleImage.width / 2),
      y + 5
    )


    world.viewport.context.font = '16px Stats_11'
    world.viewport.context.textAlign = 'center'

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(startCase(toLower(attackStyle)), x + 35 + 1, y + 40 + 1)

    world.viewport.context.fillStyle = '#FF9700'
    world.viewport.context.fillText(startCase(toLower(attackStyle)), x + 35, y + 40)

  }

  draw (world: World, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(world, ctrl, x, y)

    
    
    const weapon = world.player.equipment.weapon;

    if (!weapon){
      return;
    }


    world.viewport.context.font = '21px Stats_11'
    world.viewport.context.textAlign = 'center'

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText(startCase(toLower(weapon.itemName)), x + 100 + 1, y + 30 + 1)

    world.viewport.context.fillStyle = '#FF9700'
    world.viewport.context.fillText(startCase(toLower(weapon.itemName)), x + 100, y + 30)





    const attackStyleOffsets = [
      { x: 25, y: 45},
      { x: 105, y: 45},
      { x: 25, y: 100},
      { x: 105, y: 100},
    ]

    const attackStyles = weapon.attackStyles();

    attackStyles.forEach((style: AttackStyle, index: number) => {
      const offsets = attackStyleOffsets[index];

      const attackStyleImage = AttackStylesController.attackStyleImageMap[weapon.attackStyleCategory()][weapon.attackStyles()[index]]
      this.drawAttackStyleButton(world, weapon, weapon.attackStyles()[index], attackStyleImage, x + offsets.x, y + offsets.y)      
    })

    world.viewport.context.drawImage(      
      world.player.autoRetaliate ? this.selectedAutoRetailButtonImage : this.autoRetailButtonImage,
      x + 25,
      y + 155
    )


    world.viewport.context.font = '19px Stats_11'
    world.viewport.context.textAlign = 'center'

    world.viewport.context.fillStyle = '#000'
    world.viewport.context.fillText("Auto Retaliate", x + 115 + 1, y + 182 + 1)

    world.viewport.context.fillStyle = '#FF9700'
    world.viewport.context.fillText("Auto Retaliate", x + 115, y + 182)


  }

}
