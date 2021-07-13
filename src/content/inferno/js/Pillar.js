'use strict';

import Constants from "../../../sdk/Constants";
import { Entity } from "../../../sdk/Entity";
import Point from "../../../sdk/Utils/Point";

import MissSplat from "../../../assets/images/hitsplats/miss.png"
import DamageSplat from "../../../assets/images/hitsplats/damage.png"

export class Pillar extends Entity{

  constructor(point, size) {
    super(point, size);
    this.incomingProjectiles = []    
    this.cd = 0;



    this.missedHitsplatImage = new Image();
    this.missedHitsplatImage.src = MissSplat;
    this.damageHitsplatImage = new Image();
    this.damageHitsplatImage.src = DamageSplat;
    

    // non boosted numbers
    this.stats = {
      hitpoint: 255
    };

    // with boosts
    this.currentStats = {
      defence: 0,
      hitpoint: 255
    };

    this.bonuses = {
      attack: { },
      defence: { 
        crush: -20
      },
      other: { }
    };

  }

  tick(stage) {

    this.incomingProjectiles = _.filter(this.incomingProjectiles, (projectile) => projectile.delay > -1);

    this.incomingProjectiles.forEach((projectile) => {
      projectile.delay--;
      if (projectile.delay <= 0) {
        this.currentStats.hitpoint -= projectile.damage;
      }
    });
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint);
    
    if (this.currentStats.hitpoint <= 0) {
      return this.dead(stage);
    }
    
  }


  draw(stage) {
    stage.ctx.fillStyle = "#000073";

    stage.ctx.fillRect(
      this.location.x * Constants.tileSize,
      (this.location.y - this.size + 1) * Constants.tileSize,
      this.size * Constants.tileSize,
      this.size * Constants.tileSize
    );


    stage.ctx.fillStyle = "red";
    stage.ctx.fillRect(
      this.location.x * Constants.tileSize, 
      ((this.location.y - this.size + 1) * Constants.tileSize), 
      Constants.tileSize * this.size, 
      5
    );
    stage.ctx.fillStyle = "green";
    stage.ctx.fillRect(
      this.location.x * Constants.tileSize, 
      ((this.location.y - this.size + 1) * Constants.tileSize), 
      (this.currentStats.hitpoint / this.stats.hitpoint) * (Constants.tileSize * this.size), 
      5
    );
    
    let projectileOffsets = [
      [0, 0],
      [0, -16],
      [-12, -8],
      [12, -8]
    ];

    let projectileCounter = 0;
    this.incomingProjectiles.forEach((projectile) => {
      if (projectile.delay > 0 ) {
        return;
      }
      if (projectileCounter > 3){
        return;
      }
      projectileCounter++;
      const image = (projectile.damage === 0) ? this.missedHitsplatImage : this.damageHitsplatImage;
      if (!projectile.offsetX && !projectile.offsetY){
        projectile.offsetX = projectileOffsets[0][0];
        projectile.offsetY = projectileOffsets[0][1];
      }
    
      projectileOffsets = _.remove(projectileOffsets, (offset) => {
        return offset[0] !== projectile.offsetX || offset[1] !== projectile.offsetY;
      });

      stage.ctx.drawImage(
        image,
        (this.location.x + (this.size / 2) ) * Constants.tileSize + projectile.offsetX - 12,
        (this.location.y - this.size + 1) * Constants.tileSize + projectile.offsetY,
        24,
        23
      );
      stage.ctx.fillStyle = "#FFFFFF";
      stage.ctx.font = "16px Stats_11";
      stage.ctx.textAlign="center";
      stage.ctx.fillText(
        projectile.damage, 
        (this.location.x + (this.size / 2) ) * Constants.tileSize + projectile.offsetX,
        (this.location.y - this.size + 1) * Constants.tileSize + projectile.offsetY + 15
      );
      stage.ctx.textAlign="left";
    });
  }


  dead(stage){
    this.dying = 3;
    // TODO: needs to AOE the nibblers around it 
  }

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  static addPillarsToStage(stage) {
    [
      new Point(0, 9),
      new Point(17, 7),
      new Point(10, 23)
    ].forEach((position) => stage.addEntity(new Pillar(position, 3)));    
  }
}
