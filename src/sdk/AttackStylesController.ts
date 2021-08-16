'use strict';

import { Weapon } from "./gear/Weapon";
import { ImageLoader } from "./utils/ImageLoader";


import CrossbowAccurateImage from '../assets/images/attackstyles/crossbows/accurate.png'
import CrossbowRapidImage from '../assets/images/attackstyles/crossbows/rapid.png'
import CrossbowLongrangeImage from '../assets/images/attackstyles/crossbows/longrange.png'

//https://oldschool.runescape.wiki/w/Weapons/Types
export enum AttackStyleTypes {
  CROSSBOW = 'CROSSBOW',
  BOW = 'BOW',
  CHINCHOMPA = 'CHINCOMPA',
  GUN = 'GUN',
  THROWN = 'THROWN',
  BLADEDSTAFF = 'BLADEDSTAFF',
  POWEREDSTAFF = 'POWEREDSTAFF',
  STAFF = 'STAFF',
  SALAMANDER = 'SALAMANDER',
  TWOHANDSWORD = 'TWOHANDSWORD',
  AXE = 'AXE',
  BANNER = 'BANNER',
  BLUNT = 'BLUNT',
  BLUDGEON = 'BLUDGEON',
  BULWARK = 'BULWARK',
  CLAW = 'CLAW',
  PICKAXE = 'PICKAXE',
  POLEARM = 'POLEARM',
  POLESTAFF = 'POLESTAFF',
  SCYTHE = 'SCYTHE',
  SLASHSWORD = 'SLASHSWORD',
  SPEAR = 'SPEAR',
  SPIKEDWEAPON = 'SPIKEDWEAPON',
  STABSWORD = 'STABSWORD',
  UNARMED = 'UNARMED',
  WHIP = 'WHIP',
}

export enum AttackStyle {
  ACCURATE = 'ACCURATE',
  RAPID = 'RAPID',
  LONGRANGE = 'LONGRANGE',
  AGGRESSIVE = 'AGGRESSIVE',
  DEFENSIVE = 'DEFENSIVE',
  CONTROLLED = 'CONTROLLED'
}

interface AttackStyleStorage {
  [key: string]: AttackStyle
}



interface AttackStyleImageMap {
  [type: string]: IAttackStyleImageMap
}

interface IAttackStyleImageMap {
  [style: string]: HTMLImageElement;
}


export class AttackStylesController {
  static attackStyleImageMap: AttackStyleImageMap = {
    [AttackStyleTypes.CROSSBOW] : {
      [AttackStyle.ACCURATE] : ImageLoader.createImage(CrossbowAccurateImage),
      [AttackStyle.RAPID] : ImageLoader.createImage(CrossbowRapidImage),
      [AttackStyle.LONGRANGE] : ImageLoader.createImage(CrossbowLongrangeImage),
    }
  }

  static controller: AttackStylesController = new AttackStylesController();
  stylesMap: AttackStyleStorage = {};

  getAttackStyleForType(type: AttackStyleTypes, weapon: Weapon) {
    if (!this.stylesMap[type]){
      this.stylesMap[type] = weapon.defaultStyle();
    }
    return this.stylesMap[type];
  }

  setWeaponAttackStyle(weapon: Weapon, newStyle: AttackStyle) {
    this.stylesMap[weapon.attackStyleCategory()] = newStyle;
  }
  getWeaponAttackStyle(weapon: Weapon) {
    return this.stylesMap[weapon.attackStyleCategory()]
  }

}
