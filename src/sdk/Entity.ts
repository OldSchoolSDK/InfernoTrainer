'use strict'
import { GameObject, Location } from './GameObject';
import { World } from './World'
import { Settings } from './Settings'
import { UnitTypes } from './Unit'

export enum EntityName {
  INFERNO_SHIELD = 'Inferno Shield',
  TZ_KAL_ZUK = 'TzKal-Zuk',
  JAL_XIL = 'Jal-Xil',
  JAL_ZEK = 'Jal-Zek',
  YT_HUR_KOT = 'Yt-HurKot',
  JAL_TOK_JAD = 'JalTok-Jad',
  JAL_NIB = 'Jal-Nib',
  JAL_MEJ_RAJ = 'Jal-MejRah',
  JAL_MEJ_JAK = 'Jal-MejJak',
  JAL_IM_KOT = 'Jal-ImKot',
  JAL_AK_REK_XIL = 'Jal-AkRek-Xil',
  JAL_AK_REK_MEJ = 'Jal-AkRek-Mej',
  JAL_AK_REK_KET = 'Jal-AkRek-Ket',
  JAL_AK = 'Jal-Ak',
}

export class Entity extends GameObject{
  world: World;
  location: Location;

  entityName(): EntityName {
    return null;
  }

  constructor (world: World, location: Location) {
    super()
    this.world = world
    this.location = location
  }

  get type () {
    // Kind of odd that Units live inside the unit class, but this isn't a unit
    return UnitTypes.ENTITY
  }

  tick () {

  }

  drawUILayer(tickPercent: number){

  }

  
  draw (tickPercent: number) {
    this.world.worldCtx.fillStyle = '#000073'

    this.world.worldCtx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }
}
