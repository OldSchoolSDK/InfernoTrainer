import AttackXpDropImage from "../assets/images/xpdrops/attack.png";
import StrengthXpDropImage from "../assets/images/xpdrops/strength.png";
import DefenceXpDropImage from "../assets/images/xpdrops/defence.png";
import RangeXpDropImage from "../assets/images/xpdrops/range.png";
import MagicXpDropImage from "../assets/images/xpdrops/magic.png";
import HitpointXpDropImage from "../assets/images/xpdrops/hitpoint.png";
import _ from "lodash";

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
    this.canvas = new OffscreenCanvas(110, 200)
    this.ctx = this.canvas.getContext('2d')

    this.drops = [{},{},{},{}]
    this.lastDropSkill = null;
  }

  registerXpDrop(drop){
    this.drops.push(drop)
    if (drop.skill){
      this.lastDropSkill = drop.skill;
    }
  }

  tick(){
    this.drops.shift();
    if (this.drops.length < 4){
      this.drops.push({});
    }
  }

  draw(destinationCanvas, x, y, framePercent){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const skillInfo = _.find(XpDropController.skills, {type: this.lastDropSkill});

    if (skillInfo && skillInfo.type){

      // Draw overall XP box at top
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = XpDropController.outlineColor
      this.ctx.strokeRect(0, 0, 110, 42)
      this.ctx.strokeStyle = XpDropController.inlineColor
      this.ctx.strokeRect(1, 1, 109, 41)
      this.ctx.strokeRect(1, 30, 108, 11)
      this.ctx.fillStyle = XpDropController.fillColor
      this.ctx.fillRect(2, 2, 108, 40)
      this.ctx.fillStyle = "#000000"
      this.ctx.fillRect(2, 31, 106, 9)
      this.ctx.fillStyle = "#00BF00"
      this.ctx.fillRect(3, 32, 90, 7)


      this.ctx.fillStyle = '#FFFFFF'
      this.ctx.font = '16px Stats_11'
      this.ctx.textAlign = 'left'

      this.ctx.drawImage(skillInfo.image, 4, 2, 26, 26)
      this.ctx.fillStyle = '#000000'

      this.ctx.fillText("200,000,000", 35, 21);
      this.ctx.fillStyle = '#FFFFFF'
      this.ctx.fillText("200,000,000", 34, 20);
    }



    const xpDropYOffset = 85;
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.font = '16px Stats_11'
    this.ctx.textAlign = 'right'
    this.drops.forEach((drop, index) =>{
      const textSize = 20;
      if (!drop.skill){
        return;
      }
      const skill = drop.skill

      const skillInfo = _.find(XpDropController.skills, {type: skill});
      if (skillInfo.image.loaded){
        this.ctx.drawImage(
          skillInfo.image, 
          110 - this.ctx.measureText(drop.xp).width - 20, 
          (index - framePercent) * textSize - 13 + xpDropYOffset, 16, 16)
      }
      
      this.ctx.fillText(drop.xp, 110, (index - framePercent) * textSize + xpDropYOffset);

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
