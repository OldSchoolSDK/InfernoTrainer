"use strict";

import { Weapon } from "./gear/Weapon";
import { ImageLoader } from "./utils/ImageLoader";

import BowAccurateImage from "../assets/images/attackstyles/bow/accurate.png";
import BowRapidImage from "../assets/images/attackstyles/bow/rapid.png";
import BowLongrangeImage from "../assets/images/attackstyles/bow/longrange.png";

import CrossbowAccurateImage from "../assets/images/attackstyles/crossbows/accurate.png";
import CrossbowRapidImage from "../assets/images/attackstyles/crossbows/rapid.png";
import CrossbowLongrangeImage from "../assets/images/attackstyles/crossbows/longrange.png";

import ThrownAccurateImage from "../assets/images/attackstyles/thrown/accurate.png";
import ThrownRapidImage from "../assets/images/attackstyles/thrown/rapid.png";
import ThrownLongrangeImage from "../assets/images/attackstyles/thrown/longrange.png";

import StaffAccurateImage from "../assets/images/attackstyles/staff/accurate.png";
import StaffAggressiveImage from "../assets/images/attackstyles/staff/aggressive.png";
import StaffDefensiveImage from "../assets/images/attackstyles/staff/defensive.png";

import ScytheAccurateImage from "../assets/images/attackstyles/scythe/accurate.png";
import ScytheAggressiveSlashImage from "../assets/images/attackstyles/scythe/aggressiveslash.png";
import ScytheAggressiveCrushImage from "../assets/images/attackstyles/scythe/aggressivecrush.png";
import ScytheDefensiveImage from "../assets/images/attackstyles/scythe/defensive.png";

import ChinchompaShortFuseImage from "../assets/images/attackstyles/chinchompas/short.png";
import ChinchompaMediumFuseImage from "../assets/images/attackstyles/chinchompas/medium.png";
import ChinchompaLongFuseImage from "../assets/images/attackstyles/chinchompas/long.png";

//https://oldschool.runescape.wiki/w/Weapons/Types
export enum AttackStyleTypes {
  CROSSBOW = "CROSSBOW",
  BOW = "BOW",
  CHINCHOMPA = "CHINCOMPA",
  GUN = "GUN",
  THROWN = "THROWN",
  BLADEDSTAFF = "BLADEDSTAFF",
  POWEREDSTAFF = "POWEREDSTAFF",
  STAFF = "STAFF",
  SALAMANDER = "SALAMANDER",
  TWOHANDSWORD = "TWOHANDSWORD",
  AXE = "AXE",
  BANNER = "BANNER",
  BLUNT = "BLUNT",
  BLUDGEON = "BLUDGEON",
  BULWARK = "BULWARK",
  CLAW = "CLAW",
  PICKAXE = "PICKAXE",
  POLEARM = "POLEARM",
  POLESTAFF = "POLESTAFF",
  SCYTHE = "SCYTHE",
  SLASHSWORD = "SLASHSWORD",
  SPEAR = "SPEAR",
  SPIKEDWEAPON = "SPIKEDWEAPON",
  STABSWORD = "STABSWORD",
  UNARMED = "UNARMED",
  WHIP = "WHIP",
}

export enum AttackStyle {
  ACCURATE = "ACCURATE",
  RAPID = "RAPID",
  LONGRANGE = "LONGRANGE",
  AGGRESSIVECRUSH = "Aggr (Crush)",
  AGGRESSIVESLASH = "Aggr (Slash)",
  DEFENSIVE = "DEFENSIVE",
  CONTROLLED = "CONTROLLED",
  AUTOCAST = "AUTOCAST",
  SHORT_FUSE = "SHORT_FUSE",
  MEDIUM_FUSE = "MEDIUM_FUSE",
  LONG_FUSE = "LONG_FUSE",
}

interface AttackStyleStorage {
  [key: string]: AttackStyle;
}

interface AttackStyleImageMap {
  [type: string]: IAttackStyleImageMap;
}

interface IAttackStyleImageMap {
  [style: string]: HTMLImageElement;
}

export class AttackStylesController {
  static attackStyleImageMap: AttackStyleImageMap = {
    [AttackStyleTypes.CROSSBOW]: {
      [AttackStyle.ACCURATE]: ImageLoader.createImage(CrossbowAccurateImage),
      [AttackStyle.RAPID]: ImageLoader.createImage(CrossbowRapidImage),
      [AttackStyle.LONGRANGE]: ImageLoader.createImage(CrossbowLongrangeImage),
    },
    [AttackStyleTypes.BOW]: {
      [AttackStyle.ACCURATE]: ImageLoader.createImage(BowAccurateImage),
      [AttackStyle.RAPID]: ImageLoader.createImage(BowRapidImage),
      [AttackStyle.LONGRANGE]: ImageLoader.createImage(BowLongrangeImage),
    },
    [AttackStyleTypes.STAFF]: {
      [AttackStyle.ACCURATE]: ImageLoader.createImage(StaffAccurateImage),
      [AttackStyle.AGGRESSIVECRUSH]: ImageLoader.createImage(StaffAggressiveImage),
      [AttackStyle.DEFENSIVE]: ImageLoader.createImage(StaffDefensiveImage),
      [AttackStyle.AUTOCAST]: ImageLoader.createImage(StaffDefensiveImage),
    },
    [AttackStyleTypes.THROWN]: {
      [AttackStyle.ACCURATE]: ImageLoader.createImage(ThrownAccurateImage),
      [AttackStyle.RAPID]: ImageLoader.createImage(ThrownRapidImage),
      [AttackStyle.LONGRANGE]: ImageLoader.createImage(ThrownLongrangeImage),
    },
    [AttackStyleTypes.SCYTHE]: {
      [AttackStyle.ACCURATE]: ImageLoader.createImage(ScytheAccurateImage),
      [AttackStyle.AGGRESSIVESLASH]: ImageLoader.createImage(ScytheAggressiveSlashImage),
      [AttackStyle.AGGRESSIVECRUSH]: ImageLoader.createImage(ScytheAggressiveCrushImage),
      [AttackStyle.DEFENSIVE]: ImageLoader.createImage(ScytheDefensiveImage),
    },
    [AttackStyleTypes.CHINCHOMPA]: {
      [AttackStyle.SHORT_FUSE]: ImageLoader.createImage(ChinchompaShortFuseImage),
      [AttackStyle.MEDIUM_FUSE]: ImageLoader.createImage(ChinchompaMediumFuseImage),
      [AttackStyle.LONG_FUSE]: ImageLoader.createImage(ChinchompaLongFuseImage),
    },
  };

  static controller: AttackStylesController = new AttackStylesController();
  stylesMap: AttackStyleStorage = {};

  getAttackStyleForType(type: AttackStyleTypes, weapon: Weapon) {
    if (!this.stylesMap[type]) {
      this.stylesMap[type] = weapon.defaultStyle();
    }
    return this.stylesMap[type];
  }

  setWeaponAttackStyle(weapon: Weapon, newStyle: AttackStyle) {
    this.stylesMap[weapon.attackStyleCategory()] = newStyle;
  }
  getWeaponAttackStyle(weapon: Weapon) {
    return this.stylesMap[weapon.attackStyleCategory()];
  }
}
