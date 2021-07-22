import MapBoarder from '../assets/images/interface/map_border.png'
import MapNumberOrb from '../assets/images/interface/map_num_orb.png'
import MapBoarderMask from '../assets/images/interface/map_border_mask.png'
import CompassIcon from '../assets/images/interface/compass.png'

import { Game } from './Game';

export class MapController {
  static controller = new MapController();

  game: Game;
  canvas = document.getElementById('map') as HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  outlineImage: HTMLImageElement;
  mapAlphaImage: HTMLImageElement;
  compassImage: OffscreenCanvas;
  mapNumberOrb: HTMLImageElement;

  mapCanvas: OffscreenCanvas;

  constructor(){

    this.canvas.width = 210
    this.canvas.height = 175

    this.ctx = this.canvas.getContext('2d')

    const outlineImage = new Image();
    outlineImage.src = MapBoarder;
    outlineImage.onload = () => {
      this.outlineImage = outlineImage;
    };

    const mapNumberOrb = new Image();
    mapNumberOrb.src = MapNumberOrb;
    mapNumberOrb.onload = () => {
      this.mapNumberOrb = mapNumberOrb;
    };

    const mapAlphaImage = new Image();
    mapAlphaImage.src = MapBoarderMask;
    mapAlphaImage.onload = () => {
      this.mapAlphaImage = mapAlphaImage;
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

      // only draw image where mask is
      mapContext.globalCompositeOperation = 'destination-out'


      // draw our circle mask
      mapContext.drawImage(this.mapAlphaImage, 0, 0)
      // restore to default composite operation (is draw over current image)
      mapContext.globalCompositeOperation = 'source-over'


    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.mapCanvas){
      this.ctx.drawImage(this.mapCanvas, 51, 7);
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
      this.ctx.fillStyle = 'black'
      this.ctx.fillText( '99', 15, 74 )
      this.ctx.fillStyle = '#00FF00'
      this.ctx.fillText( '99', 14, 73 )


      // prayer
      this.ctx.fillStyle = 'black'
      this.ctx.fillText( '99', 15, 108 )
      this.ctx.fillStyle = '#00FF00'
      this.ctx.fillText( '99', 14, 107 )


      // run
      this.ctx.fillStyle = 'black'
      this.ctx.fillText( '99', 25, 140 )
      this.ctx.fillStyle = '#00FF00'
      this.ctx.fillText( '99', 24, 139 )


      // spec
      this.ctx.fillStyle = 'black'
      this.ctx.fillText( '99', 47, 166 )
      this.ctx.fillStyle = '#00FF00'
      this.ctx.fillText( '99', 46, 165 )

    }

  }
}
