import { Region } from './Region';
import { Settings } from './Settings'

export class ContextMenu {
  isActive: boolean = false;
  location: any = { x: 0, y: 0 };
  cursorPosition: any = { x: 0, y: 0 };
  activatedPosition: any = { x: 0, y: 0 };
  width: number = 0;
  height: number = 0;
  menuOptions: any[] = []
  linesOfText: any[] = []


  setPosition (position: any) {
    this.location = position
  }

  setActive () {
    this.isActive = true
  }

  setInactive () {
    this.isActive = false
  }

  setMenuOptions (menuOptions: any[]) {
    this.menuOptions = menuOptions
  }

  cursorMovedTo (region: Region, x: number, y: number) {
    const cRect = region.canvas.getBoundingClientRect() // Gets CSS pos, and width/height
    const canvasX = Math.round(x - cRect.left) // Subtract the 'left' of the canvas
    const canvasY = Math.round(y - cRect.top) // from the X/Y positions to make

    this.cursorPosition.x = canvasX
    this.cursorPosition.y = canvasY

    // cursor veering too far away, make inactive again
    if (Math.abs(canvasX - this.location.x) > this.width * 0.6) {
      this.setInactive()
    }
    if ((canvasY - this.location.y) < -10 || canvasY - this.location.y > this.height * 1.2) {
      this.setInactive()
    }
  }

  draw (region: Region) {
    if (this.isActive) {
      this.linesOfText = [
        {
          text: [{ text: 'Choose Option', fillStyle: '#5f5445' }],
          action: () => {
            region.yellowClick()
          }
        },
        ...this.menuOptions,
        {
          text: [{ text: 'Walk Here', fillStyle: 'white' }],
          action: () => {
            region.yellowClick()
            let x = this.location.x
            let y = this.location.y
            if (Settings.rotated === 'south') {
              x = region.width * Settings.tileSize - x
              y = region.height * Settings.tileSize - y
            }
            region.playerWalkClick(x, y)
          }
        },
        {
          text: [{ text: 'Cancel', fillStyle: 'white' }],
          action: () => {
            region.yellowClick()
          }
        }
      ]
      region.ctx.font = '17px OSRS'

      this.width = 0
      this.linesOfText.forEach((line) => {
        this.width = Math.max(this.width, this.fillMixedTextWidth(region.ctx, line.text) + 10)
      })

      this.height = 22 + (this.linesOfText.length - 1) * 20

      region.ctx.fillStyle = '#5f5445'
      region.ctx.fillRect(this.location.x - this.width / 2, this.location.y, this.width, this.height)

      region.ctx.fillStyle = 'black'
      region.ctx.fillRect(this.location.x - this.width / 2 + 1, this.location.y + 1, this.width - 2, 17)

      region.ctx.lineWidth = 1
      region.ctx.strokeStyle = 'black'
      region.ctx.strokeRect(this.location.x - this.width / 2 + 2, this.location.y + 20, this.width - 4, this.height - 22)

      for (let i = 0; i < this.linesOfText.length; i++) {
        this.drawLineOfText(region.ctx, this.linesOfText[i].text, this.width, i * 20)
      }
    }
    region.ctx.restore()
  }

  fillMixedText (ctx: CanvasRenderingContext2D, args: any, x: number, y: number, inputColor: string) {
    const defaultFillStyle = ctx.fillStyle
    const defaultFont = ctx.font

    ctx.save()
    args.forEach(({ text, fillStyle, font }: { text: string, fillStyle: string, font: string}) => {
      if (fillStyle === 'white') {
        ctx.fillStyle = inputColor
      } else {
        ctx.fillStyle = fillStyle || defaultFillStyle
      }

      ctx.font = font || defaultFont
      ctx.fillText(text, x, y)
      x += ctx.measureText(text).width
    })
    ctx.restore()
  };

  fillMixedTextWidth (ctx: CanvasRenderingContext2D, args: any) {
    const defaultFillStyle = ctx.fillStyle
    const defaultFont = ctx.font

    let x = 0
    args.forEach(({ text, fillStyle, font }: { text: string, fillStyle: string, font: string}) => {
      ctx.fillStyle = fillStyle || defaultFillStyle
      ctx.font = font || defaultFont
      x += ctx.measureText(text).width
    })
    return x
  };

  drawLineOfText (ctx: CanvasRenderingContext2D, text: string, width: number, y: number) {
    const isXAligned = this.cursorPosition.x > this.location.x - width / 2 && this.cursorPosition.x < this.location.x + width / 2
    const isYAligned = this.cursorPosition.y > this.location.y + y + 2 && this.cursorPosition.y < this.location.y + 21 + y
    const isHovered = isXAligned && isYAligned

    this.fillMixedText(ctx, text, this.location.x - width / 2 + 4, this.location.y + 15 + y, isHovered ? 'yellow' : 'white')
  }

  clicked (region: Region, x: number, y: number) {
    const index = Math.floor((y - this.location.y) / 20)
    this.linesOfText[index].action()
  }
}
