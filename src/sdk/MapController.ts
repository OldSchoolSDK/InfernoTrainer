import MapBoarder from '../assets/images/interface/map_border.png'
import MapNumberOrb from '../assets/images/interface/map_num_orb.png'
import MapBorderMask from '../assets/images/interface/map_border_mask.png'
import CompassIcon from '../assets/images/interface/compass.png'
import MapHitpointOrb from '../assets/images/interface/map_hitpoint_orb.png'
import MapPrayerOrb from '../assets/images/interface/map_prayer_orb.png'
import MapRunOrb from '../assets/images/interface/map_run_orb.png'
import MapNoSpecOrb from '../assets/images/interface/map_no_spec_orb.png'
import MapSpecOrb from '../assets/images/interface/map_spec_orb.png'


import MapHitpointIcon from '../assets/images/interface/map_hitpoint_icon.png'
import MapPrayerIcon from '../assets/images/interface/map_prayer_icon.png'
import MapWalkIcon from '../assets/images/interface/map_walk_icon.png'
import MapRunIcon from '../assets/images/interface/map_run_icon.png'
import MapSpecIcon from '../assets/images/interface/map_spec_icon.png'

import { Game } from './Game';
import { UnitStats } from './Unit'
import ColorScale from 'color-scales'

export class MapController {
  static controller = new MapController();

  colorScale: ColorScale = new ColorScale(0, 1, [ '#FF0000', '#FF7300', '#00FF00'], 1);

  game: Game;
  canvas = document.getElementById('map') as HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  outlineImage: HTMLImageElement;
  mapAlphaImage: HTMLImageElement;
  compassImage: OffscreenCanvas;
  mapNumberOrb: HTMLImageElement;
  mapHitpointOrb: HTMLImageElement;
  mapPrayerOrb: HTMLImageElement;
  mapRunOrb: HTMLImageElement;
  mapNoSpecOrb: HTMLImageElement;
  mapSpecOrb: HTMLImageElement;
  mapHitpointIcon: HTMLImageElement;
  mapPrayerIcon: HTMLImageElement;
  mapWalkIcon: HTMLImageElement;
  mapRunIcon: HTMLImageElement;
  mapSpecIcon: HTMLImageElement;

  mapCanvas: OffscreenCanvas;

  mapHitpointOrbMasked: OffscreenCanvas;
  mapPrayerOrbMasked: OffscreenCanvas;
  mapRunOrbMasked: OffscreenCanvas;
  mapSpecOrbMasked: OffscreenCanvas;

  currentStats: UnitStats;
  stats: UnitStats;

  constructor(){

    this.canvas.width = 210
    this.canvas.height = 180

    this.ctx = this.canvas.getContext('2d')

    this.loadImages();
    
  }

  updateOrbsMask(currentStats: UnitStats, stats: UnitStats) {

    this.currentStats = currentStats;
    this.stats = stats;

    const hitpointPercentage = currentStats.hitpoint / stats.hitpoint;

    this.mapHitpointOrbMasked = new OffscreenCanvas(this.mapHitpointOrb.width, this.mapHitpointOrb.height);
    let ctx = this.mapHitpointOrbMasked.getContext('2d')
    ctx.fillStyle="white";
    ctx.drawImage(this.mapHitpointOrb, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0,this.mapHitpointOrb.height * (1 - hitpointPercentage), this.mapHitpointOrb.width, this.mapHitpointOrb.height * hitpointPercentage)
    ctx.globalCompositeOperation = 'source-over'



    const prayerPercentage = currentStats.prayer / stats.prayer;
    this.mapPrayerOrbMasked = new OffscreenCanvas(this.mapPrayerOrb.width, this.mapPrayerOrb.height);
    ctx = this.mapPrayerOrbMasked.getContext('2d')
    ctx.fillStyle="white";
    ctx.drawImage(this.mapPrayerOrb, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0,this.mapPrayerOrb.height * (1 - prayerPercentage), this.mapPrayerOrb.width, this.mapPrayerOrb.height * prayerPercentage)
    ctx.globalCompositeOperation = 'source-over'

    const runPercentage = currentStats.run / 100;
    this.mapRunOrbMasked = new OffscreenCanvas(this.mapRunOrb.width, this.mapRunOrb.height);
    ctx = this.mapRunOrbMasked.getContext('2d')
    ctx.fillStyle="white";
    ctx.drawImage(this.mapRunOrb, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0,this.mapRunOrb.height * (1 - runPercentage), this.mapRunOrb.width, this.mapRunOrb.height * runPercentage)
    ctx.globalCompositeOperation = 'source-over'


    const specPercentage = currentStats.specialAttack / 100;
    this.mapSpecOrbMasked = new OffscreenCanvas(this.mapSpecOrb.width, this.mapSpecOrb.height);
    ctx = this.mapSpecOrbMasked.getContext('2d')
    ctx.fillStyle="white";
    ctx.drawImage(this.mapSpecOrb, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillRect(0,this.mapSpecOrb.height * (1 - specPercentage), this.mapRunOrb.width, this.mapRunOrb.height * specPercentage)
    ctx.globalCompositeOperation = 'source-over'




  }

  loadImages() {

    const outlineImage = new Image();
    outlineImage.src = MapBoarder;
    outlineImage.onload = () => {
      this.outlineImage = outlineImage;
    };

    const mapNoSpecOrb = new Image();
    mapNoSpecOrb.src = MapNoSpecOrb;
    mapNoSpecOrb.onload = () => {
      this.mapNoSpecOrb = mapNoSpecOrb;
    };
    const mapSpecOrb = new Image();
    mapSpecOrb.src = MapSpecOrb;
    mapSpecOrb.onload = () => {
      this.mapSpecOrb = mapSpecOrb;
    };


    const mapNumberOrb = new Image();
    mapNumberOrb.src = MapNumberOrb;
    mapNumberOrb.onload = () => {
      this.mapNumberOrb = mapNumberOrb;
    };

    const mapHitpointOrb = new Image();
    mapHitpointOrb.src = MapHitpointOrb;
    mapHitpointOrb.onload = () => {
      this.mapHitpointOrb = mapHitpointOrb;
    };

    const mapAlphaImage = new Image();
    mapAlphaImage.src = MapBorderMask;
    mapAlphaImage.onload = () => {
      this.mapAlphaImage = mapAlphaImage;
    };

    const mapPrayerOrb = new Image();
    mapPrayerOrb.src = MapPrayerOrb;
    mapPrayerOrb.onload = () => {
      this.mapPrayerOrb = mapPrayerOrb;
    };
    const mapRunOrb = new Image();
    mapRunOrb.src = MapRunOrb;
    mapRunOrb.onload = () => {
      this.mapRunOrb = mapRunOrb;
    };

    const mapHitpointIcon = new Image();
    mapHitpointIcon.src = MapHitpointIcon;
    mapHitpointIcon.onload = () => {
      this.mapHitpointIcon = mapHitpointIcon;
    };

    const mapRunIcon = new Image();
    mapRunIcon.src = MapRunIcon;
    mapRunIcon.onload = () => {
      this.mapRunIcon = mapRunIcon;
    };
    const mapSpecIcon = new Image();
    mapSpecIcon.src = MapSpecIcon;
    mapSpecIcon.onload = () => {
      this.mapSpecIcon = mapSpecIcon;
    };
  
    const mapPrayerIcon = new Image();
    mapPrayerIcon.src = MapPrayerIcon;
    mapPrayerIcon.onload = () => {
      this.mapPrayerIcon = mapPrayerIcon;
    };
    const mapWalkIcon = new Image();
    mapWalkIcon.src = MapWalkIcon;
    mapWalkIcon.onload = () => {
      this.mapWalkIcon = mapWalkIcon;
    };

    const compassImage = new Image()
    compassImage.src = CompassIcon

    compassImage.onload = () => {
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

    }

  }

  setGame(game: Game) {
    this.game = game;
  }

  draw(tickPercent: number){
    if (!this.mapCanvas && this.game && this.game.region.mapImage) {
      this.mapCanvas = new OffscreenCanvas(152, 152);
      const mapContext = this.mapCanvas.getContext('2d')
      mapContext.fillStyle="white";
      mapContext.fillRect(0,0, 152, 152)
      mapContext.globalCompositeOperation = 'destination-out'
      mapContext.drawImage(this.mapAlphaImage, 0, 0)
      mapContext.globalCompositeOperation = 'source-over'
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.mapCanvas){
      this.ctx.drawImage(this.mapCanvas, 52, 8);
    }


    if (this.compassImage){
      this.ctx.drawImage(this.compassImage, 25, -3);
    }

    if (this.outlineImage){
      this.ctx.drawImage(this.outlineImage, 28, 0);
    }
    if (this.mapNumberOrb) {
      this.ctx.drawImage(this.mapNumberOrb, 0, 47);
      this.ctx.drawImage(this.mapNumberOrb, 0, 81);
      this.ctx.drawImage(this.mapNumberOrb, 10, 114);
      this.ctx.drawImage(this.mapNumberOrb, 32, 140);

      this.ctx.font = '16px Stats_11'
      this.ctx.textAlign = 'center'

      // hitpoints
      if (this.currentStats) {
        this.ctx.fillStyle = 'black'
        this.ctx.fillText( String(this.currentStats.hitpoint), 15, 74 )
        this.ctx.fillStyle = this.colorScale.getColor(this.currentStats.hitpoint / this.stats.hitpoint).toHexString()
        this.ctx.fillText( String(this.currentStats.hitpoint), 14, 73 )  
        // prayer
        this.ctx.fillStyle = 'black'
        this.ctx.fillText( String(this.currentStats.prayer), 15, 108 )
        this.ctx.fillStyle = this.colorScale.getColor(this.currentStats.prayer / this.stats.prayer).toHexString()
        this.ctx.fillText( String(this.currentStats.prayer), 14, 107 )


        // run
        this.ctx.fillStyle = 'black'
        this.ctx.fillText( String(this.currentStats.run), 25, 140 )
        this.ctx.fillStyle = this.colorScale.getColor(this.currentStats.run / 100).toHexString()
        this.ctx.fillText( String(this.currentStats.run), 24, 139 )


        // spec
        this.ctx.fillStyle = 'black'
        this.ctx.fillText( String(this.currentStats.specialAttack), 47, 166 )
        this.ctx.fillStyle = this.colorScale.getColor(this.currentStats.specialAttack / 100).toHexString()
        this.ctx.fillText( String(this.currentStats.specialAttack), 46, 165 )
      }

    }

    if (this.mapHitpointOrbMasked) {
      this.ctx.drawImage(this.mapHitpointOrbMasked, 27, 51)
    }
    if (this.mapHitpointIcon) {
      this.ctx.drawImage(this.mapHitpointIcon, 27, 51)
    }

    if (this.mapPrayerOrbMasked) {
      this.ctx.drawImage(this.mapPrayerOrbMasked, 27, 85)
    }

    if (this.mapPrayerIcon) {
      this.ctx.drawImage(this.mapPrayerIcon, 27, 85)
    }

    if (this.mapRunOrbMasked) {
      this.ctx.drawImage(this.mapRunOrbMasked, 37, 118)
    }
    if (this.mapRunIcon) {
      this.ctx.drawImage(this.mapRunIcon, 37, 118)
    }

    // if (this.mapNoSpecOrb) {
    //   this.ctx.drawImage(this.mapNoSpecOrb, 59, 144)
    // }
    if (this.mapSpecOrbMasked) {
      this.ctx.drawImage(this.mapSpecOrbMasked, 59, 144)
    }
    if (this.mapSpecIcon) {
      this.ctx.drawImage(this.mapSpecIcon, 57, 142, 30, 30)
    }

  }
}
