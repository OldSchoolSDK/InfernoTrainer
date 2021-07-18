import AttackXpDropImage from "../assets/images/xpdrops/attack.png";
import StrengthXpDropImage from "../assets/images/xpdrops/strength.png";
import DefenceXpDropImage from "../assets/images/xpdrops/defence.png";
import RangeXpDropImage from "../assets/images/xpdrops/range.png";
import MagicXpDropImage from "../assets/images/xpdrops/magic.png";
import HitpointXpDropImage from "../assets/images/xpdrops/hitpoint.png";

export class XpDropController {
  static controller = new XpDropController();

  static outlineColor = "#3A3021"
  static inlineColor = "#5D5344";
  static fillColor = "#5D534473" // guess ATM

  static skills = [ 
    { type: "attack", imgSrc: AttackXpDropImage },
    { type: "strength", imgSrc: StrengthXpDropImage },
    { type: "defence", imgSrc: DefenceXpDropImage },
    { type: "range", imgSrc: RangeXpDropImage },
    { type: "magic", imgSrc: MagicXpDropImage },
    { type: "hitpoint", imgSrc: HitpointXpDropImage }
  ];

  constructor(){
    this.canvas = new OffscreenCanvas(100, 200)
    this.ctx = this.canvas.getContext('2d')

    this.drops = []
  }

  registerXpDrop(dropsInTick){

    this.drops.push(dropsInTick);
  }

  tick(){
    this.drops = this.drops.map((drop) => {
      drop.delay--;
      return drop;
    })
    this.drops = _.filter(this.drops, (drop) => drop.delay > -1);
  }

  draw(destinationCanvas, x, y, framePercent){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.font = '16px Stats_11'
    this.ctx.textAlign = 'left'
    this.drops.forEach((dropsOnTick) =>{
      const textSize = 18;
      const delay = dropsOnTick.delay;
      const drops = dropsOnTick.xpDrops;
      const skills = Object.keys(drops);
      skills.forEach((skill, index) =>{
        const skillInfo = _.find(XpDropController.skills, {type: skill});
        if (skillInfo.image.loaded){
          this.ctx.drawImage(skillInfo.image, 0, (delay + index - framePercent) * textSize - 13, 16, 16)
        }
        this.ctx.fillText(drops[skill], 20, (delay + index - framePercent) * textSize);
      })
    })
    destinationCanvas.drawImage(this.canvas, x, y);

  }
}


XpDropController.skills.forEach((skill) => {
  skill.image = new Image();
  skill.image.src = skill.imgSrc;
  skill.image.onload = () => {
    skill.image.loaded = true;
  }
});
