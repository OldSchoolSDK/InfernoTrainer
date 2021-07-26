import MapBoarder from '../assets/images/interface/map_border.png'
import MapSelectedNumberOrb from '../assets/images/interface/map_selected_num_orb.png'
import MapNumberOrb from '../assets/images/interface/map_num_orb.png'
import MapBorderMask from '../assets/images/interface/map_border_mask.png'
import CompassIcon from '../assets/images/interface/compass.png'
import MapHitpointOrb from '../assets/images/interface/map_hitpoint_orb.png'
import MapPrayerOrb from '../assets/images/interface/map_prayer_orb.png'
import MapPrayerSelectedOrb from '../assets/images/interface/map_prayer_on_orb.png'

import MapRunOrb from '../assets/images/interface/map_run_orb.png'
import MapNoSpecOrb from '../assets/images/interface/map_no_spec_orb.png'
import MapSpecOrb from '../assets/images/interface/map_spec_orb.png'

import MapXpButton from '../assets/images/interface/map_xp_button.png'
import MapXpHoverButton from '../assets/images/interface/map_xp_hover_button.png'


import MapHitpointIcon from '../assets/images/interface/map_hitpoint_icon.png'
import MapPrayerIcon from '../assets/images/interface/map_prayer_icon.png'
import MapWalkIcon from '../assets/images/interface/map_walk_icon.png'
import MapRunIcon from '../assets/images/interface/map_run_icon.png'
import MapSpecIcon from '../assets/images/interface/map_spec_icon.png'

import { Game } from './Game';
import ColorScale from 'color-scales'
import { PlayerStats } from './Player'
import { ImageLoader } from './Utils/ImageLoader'
import { Settings } from './Settings'
import { ControlPanelController } from './ControlPanelController'

enum MapHover {
  NONE = 0,
  HITPOINT = 1,
  PRAYER = 2,
  RUN = 3,
  SPEC = 4,
  XP = 5,
}

export class MapController {
  static controller = new MapController();

  colorScale: ColorScale = new ColorScale(0, 1, [ '#FF0000', '#FF7300', '#00FF00'], 1);

  game: Game;
  canvas = document.getElementById('map') as HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  outlineImage: HTMLImageElement = ImageLoader.createImage(MapBoarder)
  mapAlphaImage: HTMLImageElement = ImageLoader.createImage(MapBorderMask);
  mapNumberOrb = ImageLoader.createImage(MapNumberOrb);
  mapSelectedNumberOrb = ImageLoader.createImage(MapSelectedNumberOrb);
  mapHitpointOrb = ImageLoader.createImage(MapHitpointOrb);
  mapPrayerOrb = ImageLoader.createImage(MapPrayerOrb);
  mapPrayerSelectedOrb = ImageLoader.createImage(MapPrayerSelectedOrb);
  mapRunOrb = ImageLoader.createImage(MapRunOrb);
  mapNoSpecOrb = ImageLoader.createImage(MapNoSpecOrb)
  mapSpecOrb = ImageLoader.createImage(MapSpecOrb);
  mapHitpointIcon = ImageLoader.createImage(MapHitpointIcon);
  mapPrayerIcon = ImageLoader.createImage(MapPrayerIcon);
  mapWalkIcon = ImageLoader.createImage(MapWalkIcon);
  mapRunIcon = ImageLoader.createImage(MapRunIcon);
  mapSpecIcon = ImageLoader.createImage(MapSpecIcon);
  mapXpButton = ImageLoader.createImage(MapXpButton);
  mapXpHoverButton = ImageLoader.createImage(MapXpHoverButton);

  mapCanvas: OffscreenCanvas;

  compassImage: OffscreenCanvas;
  mapHitpointOrbMasked: OffscreenCanvas;
  mapPrayerOrbMasked: OffscreenCanvas;
  mapRunOrbMasked: OffscreenCanvas;
  mapSpecOrbMasked: OffscreenCanvas;

  currentStats: PlayerStats;
  stats: PlayerStats;

  hovering: MapHover = null;

  width: number;
  height: number;
  constructor(){

    this.width = 210
    this.height = 180
    // this.canvas.addEventListener('mousedown', this.clicked.bind(this))
    // this.canvas.addEventListener('mousemove', (e: MouseEvent) => this.cursorMovedTo(e))
    this.hovering = MapHover.NONE;
    this.loadImages();

  }

  cursorMovedTo(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;

    this.hovering = MapHover.NONE;
    if (x > 4 && x < 23 && y > 31 && y < 51) {
      this.hovering = MapHover.XP;
    }else if (x > 4 && x < 48 && y > 53 && y < 76){
      this.hovering = MapHover.HITPOINT;
    }else if (x > 4 && x < 48 && y > 90 && y < 108) {
      this.hovering = MapHover.PRAYER;
    }else if (x > 15 && x < 62 && y > 122 && y < 144) {
      this.hovering = MapHover.RUN;
    }else if (x > 38 && x < 85 && y > 148 && y < 170) {
      this.hovering = MapHover.SPEC;
    }

  }

  clicked(event: MouseEvent) {
    const x = event.offsetX - this.game.width * Settings.tileSize;
    const y = event.offsetY;

    if (x > 4 && x < 23 && y > 31 && y < 51) {
      Settings.displayXpDrops = !Settings.displayXpDrops;
    }else if (x > 33 && x < 67 && y > 5 && y < 39){
      
      if (Settings.rotated === 'south') {
        Settings.rotated = 'north'
      } else {
        Settings.rotated = 'south'
      }
      Settings.persistToStorage();
    }else if (x > 4 && x < 48 && y > 53 && y < 76){
      // this.hovering = MapHover.HITPOINT;
    }else if (x > 4 && x < 48 && y > 90 && y < 108) {
      const hasQuickPrayers = ControlPanelController.controls.PRAYER.hasQuickPrayersActivated;
      if (ControlPanelController.controls.PRAYER.hasQuickPrayersActivated) {
        ControlPanelController.controls.PRAYER.deactivateAllPrayers();
        this.game.player.prayerDrainCounter = 0;
      }else {
        ControlPanelController.controls.PRAYER.activateQuickPrayers();
      }
    }else if (x > 15 && x < 62 && y > 122 && y < 144) {
      this.game.player.running = !this.game.player.running;
    }else if (x > 38 && x < 74 && y > 148 && y < 170) {
      // this.hovering = MapHover.SPEC;
    }
    this.updateOrbsMask(this.currentStats, this.stats);
  }

  updateOrbsMask(currentStats: PlayerStats, stats: PlayerStats) {

    if (currentStats){
      this.currentStats = currentStats;
    }
    if (stats) {
      this.stats = stats;
    }

    if (!this.mapHitpointOrb || !this.mapPrayerOrb || !this.mapRunOrb || !this.mapSpecOrb) {
      return;
    }
    const hitpointPercentage = this.currentStats.hitpoint / this.stats.hitpoint;

    this.mapHitpointOrbMasked = new OffscreenCanvas(this.mapHitpointOrb.width, this.mapHitpointOrb.height);
    let ctx = this.mapHitpointOrbMasked.getContext('2d')

    ctx.fillStyle="white";
    ctx.drawImage(this.mapHitpointOrb, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0,this.mapHitpointOrb.height * (1 - hitpointPercentage), this.mapHitpointOrb.width, this.mapHitpointOrb.height * hitpointPercentage)
    ctx.globalCompositeOperation = 'source-over'

    const prayerPercentage = this.currentStats.prayer / this.stats.prayer;
    this.mapPrayerOrbMasked = new OffscreenCanvas(this.mapPrayerOrb.width, this.mapPrayerOrb.height);
    ctx = this.mapPrayerOrbMasked.getContext('2d')
    ctx.fillStyle="white";
    ctx.drawImage(ControlPanelController.controls.PRAYER.hasQuickPrayersActivated ? this.mapPrayerSelectedOrb : this.mapPrayerOrb, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0,this.mapPrayerOrb.height * (1 - prayerPercentage), this.mapPrayerOrb.width, this.mapPrayerOrb.height * prayerPercentage)
    ctx.globalCompositeOperation = 'source-over'

    const runPercentage = this.currentStats.run / 100;
    this.mapRunOrbMasked = new OffscreenCanvas(this.mapRunOrb.width, this.mapRunOrb.height);
    ctx = this.mapRunOrbMasked.getContext('2d')
    ctx.fillStyle="white";
    ctx.drawImage(this.game.player.running ? this.mapRunOrb: this.mapNoSpecOrb, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0,this.mapRunOrb.height * (1 - runPercentage), this.mapRunOrb.width, this.mapRunOrb.height * runPercentage)
    ctx.globalCompositeOperation = 'source-over'


    const specPercentage = this.currentStats.specialAttack / 100;
    this.mapSpecOrbMasked = new OffscreenCanvas(this.mapSpecOrb.width, this.mapSpecOrb.height);
    ctx = this.mapSpecOrbMasked.getContext('2d')
    ctx.fillStyle="white";
    ctx.drawImage(this.game.player.weapon.hasSpecialAttack() ? this.mapSpecOrb : this.mapNoSpecOrb, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0,this.mapSpecOrb.height * (1 - specPercentage), this.mapRunOrb.width, this.mapRunOrb.height * specPercentage)
    ctx.globalCompositeOperation = 'source-over'
  }

  loadImages() {


    const compassImage = ImageLoader.createImage(CompassIcon);

    compassImage.addEventListener('load', () => {
      this.compassImage = new OffscreenCanvas(51, 51)

      const context = this.compassImage.getContext('2d')

      context.drawImage(compassImage, 0, 0)

      // only draw image where mask is
      context.globalCompositeOperation = 'destination-in'

      // draw our circle mask
      context.fillStyle = '#000'
      context.beginPath()
      const size = 38
      context.arc(
        (51 - size) * 0.5 + size * 0.5, // x
        (51 - size) * 0.5 + size * 0.5, // y
        size * 0.5, // radius
        0, // start angle
        2 * Math.PI // end angle
      )
      context.fill()

      // restore to default composite operation (is draw over current image)
      context.globalCompositeOperation = 'source-over'

    })

  }

  setGame(game: Game) {
    this.game = game;
  }

  generateMaskedMap() {
    this.mapCanvas = new OffscreenCanvas(152, 152);
    const mapContext = this.mapCanvas.getContext('2d')


    mapContext.save()
    mapContext.translate(76, 76)
    if (Settings.rotated === 'south') {
      mapContext.rotate(Math.PI)
    }
    mapContext.translate(-76, -76)

    const compatCtx = mapContext as any;
    compatCtx.webkitImageSmoothingEnabled = false;
    compatCtx.mozImageSmoothingEnabled = false;
    compatCtx.imageSmoothingEnabled = false;

    mapContext.drawImage(this.game.region.mapImage, 0, 0, 152, 152)
    compatCtx.webkitImageSmoothingEnabled = true;
    compatCtx.mozImageSmoothingEnabled = true;
    compatCtx.imageSmoothingEnabled = true;


    mapContext.globalCompositeOperation = 'destination-out'
    mapContext.drawImage(this.mapAlphaImage, 0, 0)
    mapContext.globalCompositeOperation = 'source-over'
    mapContext.restore()
  }

  draw(ctx: CanvasRenderingContext2D, tickPercent: number){
  

    const offset = this.game.region.width * Settings.tileSize
    
    ctx.font = '16px Stats_11'
    ctx.textAlign = 'center'
    
    
    this.generateMaskedMap();
    ctx.drawImage(this.mapCanvas, offset + 52, 8);

    // draw compass
    ctx.save()
    ctx.translate(offset + 50.5, 23.5)
    if (Settings.rotated === 'south') {
      ctx.rotate(Math.PI)
    }
    ctx.translate(-50.5, -23.5)
    if (this.compassImage) {

      ctx.drawImage(this.compassImage, 25, -2)
    }
    ctx.restore()



    ctx.drawImage(this.outlineImage, offset + 28, 0);
    ctx.drawImage(this.hovering == MapHover.XP ? this.mapXpHoverButton : this.mapXpButton, offset, 26)

    ctx.drawImage(this.hovering == MapHover.HITPOINT ? this.mapSelectedNumberOrb : this.mapNumberOrb, offset, 47);
    ctx.drawImage(this.hovering == MapHover.PRAYER ? this.mapSelectedNumberOrb : this.mapNumberOrb, offset, 81);
    ctx.drawImage(this.hovering == MapHover.RUN ? this.mapSelectedNumberOrb : this.mapNumberOrb, offset + 10, 114);
    ctx.drawImage(this.hovering == MapHover.SPEC ? this.mapSelectedNumberOrb : this.mapNumberOrb, offset + 32, 140);

    ctx.drawImage(this.mapHitpointOrbMasked, offset + 27, 51)
    ctx.drawImage(this.mapHitpointIcon, offset + 27, 51)
    ctx.drawImage(this.mapPrayerOrbMasked, offset + 27, 85)
    ctx.drawImage(this.mapPrayerIcon, offset + 27, 85)
    ctx.drawImage(this.mapRunOrbMasked, offset + 37, 118)
    ctx.drawImage(this.game.player.running ? this.mapRunIcon: this.mapWalkIcon, offset + 37, 118)
    ctx.drawImage(this.mapSpecOrbMasked, offset + 59, 144)
    ctx.drawImage(this.mapSpecIcon, offset + 57, 142, 30, 30)



    // hitpoints
    ctx.fillStyle = 'black'
    ctx.fillText( String(this.currentStats.hitpoint), offset + 15, 74 )
    ctx.fillStyle = this.colorScale.getColor(this.currentStats.hitpoint / this.stats.hitpoint).toHexString()
    ctx.fillText( String(this.currentStats.hitpoint), offset + 14, 73 )  
    // prayer
    ctx.fillStyle = 'black'
    ctx.fillText( String(this.currentStats.prayer), offset + 15, 108 )
    ctx.fillStyle = this.colorScale.getColor(this.currentStats.prayer / this.stats.prayer).toHexString()
    ctx.fillText( String(this.currentStats.prayer), offset + 14, 107 )


    // run
    ctx.fillStyle = 'black'
    ctx.fillText( String(this.currentStats.run), offset + 25, 140 )
    ctx.fillStyle = this.colorScale.getColor(this.currentStats.run / 100).toHexString()
    ctx.fillText( String(this.currentStats.run), offset + 24, 139 )


    // spec
    ctx.fillStyle = 'black'
    ctx.fillText( String(this.currentStats.specialAttack), offset + 47, 166 )
    ctx.fillStyle = this.colorScale.getColor(this.currentStats.specialAttack / 100).toHexString()
    ctx.fillText( String(this.currentStats.specialAttack), offset + 46, 165 )

    

  }
}
