'use strict';

import { Settings } from "../../../sdk/Settings";
import { Entity } from "../../../sdk/Entity";

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

  tick(region) {

    this.incomingProjectiles = _.filter(this.incomingProjectiles, (projectile) => projectile.delay > -1);

    this.incomingProjectiles.forEach((projectile) => {
      projectile.delay--;
      if (projectile.delay <= 0) {
        this.currentStats.hitpoint -= projectile.damage;
      }
    });
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint);
    
    if (this.currentStats.hitpoint <= 0) {
      return this.dead(region);
    }
    
  }


  draw(region) {
    region.ctx.fillStyle = "#000073";

    region.ctx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    );





    region.ctx.save();

    region.ctx.translate(
      (this.location.x * Settings.tileSize + this.size * Settings.tileSize / 2),
      ((this.location.y + 1) * Settings.tileSize - ((this.size) * Settings.tileSize) / 2),
    );

    if (Settings.rotated === 'south'){
      region.ctx.rotate(Math.PI)
    }

    region.ctx.fillStyle = "red";
    region.ctx.fillRect(
      (-this.size / 2) * Settings.tileSize, 
      (-this.size / 2) * Settings.tileSize,
      Settings.tileSize * this.size, 
      5
    );



    region.ctx.fillStyle = "green";
    const w = (this.currentStats.hitpoint / this.stats.hitpoint) * (Settings.tileSize * this.size);
    region.ctx.fillRect(
      (-this.size / 2) * Settings.tileSize,
      (-this.size / 2) * Settings.tileSize,
      w, 
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

      region.ctx.drawImage(
        image,
        projectile.offsetX - 12, 
        -((this.size + 1) * Settings.tileSize) / 2  - projectile.offsetY,
        24,
        23
      );
      region.ctx.fillStyle = "#FFFFFF";
      region.ctx.font = "16px Stats_11";
      region.ctx.textAlign="center";
      region.ctx.fillText(
        projectile.damage, 
        projectile.offsetX, 
        -((this.size + 1) * Settings.tileSize) / 2  - projectile.offsetY + 15,
      );
      region.ctx.textAlign="left";
    });
    region.ctx.restore();
  }


  dead(region){
    this.dying = 3;
    // TODO: needs to AOE the nibblers around it 
  }

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  static addPillarsToRegion(region) {
    [
      { x: 0, y: 9},
      { x: 17, y: 7},
      { x: 10, y: 23}
    ].forEach((position) => region.addEntity(new Pillar(position, 3)));    
  }
}
