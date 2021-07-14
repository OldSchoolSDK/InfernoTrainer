'use strict';
import Pathing from "./Pathing";
import Constants from "./Constants";
import Point from "./Utils/Point";
import LineOfSight from "./LineOfSight";
import { TwistedBow } from "../content/weapons/TwistedBow";
import MissSplat from "../assets/images/hitsplats/miss.png"
import DamageSplat from "../assets/images/hitsplats/damage.png"

export default class Player {

  constructor(location) {
    this.prayers = [];

    this.dying = -1;
    // non boosted numbers
    this.stats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99
    };

    // with boosts
    this.currentStats = {
      attack: 99,
      strength: 99,
      defence: 99,
      range: 99,
      magic: 99,
      hitpoint: 99
    };

    this.bonuses = {
      attack: {
        stab: -1,
        slash: -1,
        crush: -1,
        magic: 53,
        range: 128
      },
      defence: {
        stab: 213,
        slash: 202,
        crush: 219,
        magic: 135,
        range: 215
      },
      other: {
        meleeStrength: 15,
        rangedStrength: 62,
        magicDamage: 1.27,
        prayer: 12
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    }

    this.lastOverhead = null;
    this.location = location;
    this.seeking = false;
    this.perceivedLocation = location;
    this.destinationLocation = -1;
    this.path = null;
    this.weapon = new TwistedBow();
    this.incomingProjectiles = [];


    this.cd = 0;
    
    this.missedHitsplatImage = new Image();
    this.missedHitsplatImage.src = MissSplat;
    this.damageHitsplatImage = new Image();
    this.damageHitsplatImage.src = DamageSplat;
    
  }

  get isMob() {
    return false;
  }
  
  get size() {
    return 1;
  }

  moveTo(x, y) {
    this.manualSpellCastSelection = null;
    this.destinationLocation = new Point(x, y);
  }

  attack(stage) {

    
    if (this.manualSpellCastSelection){
      this.manualSpellCastSelection.cast(stage, this, this.seeking);
      this.manualSpellCastSelection = null;
    }else{
      // use equipped weapon
      this.weapon.attack(stage, this, this.seeking);
    }

    // this.playAttackSound();
  }

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  movementStep(stage) {
    this.lastOverhead = this.overhead; 

    this.overhead = _.find(stage.player.prayers, prayer => prayer.isOverhead() && prayer.isActive); 

    if (this.lastOverhead && !this.overhead){
      this.lastOverhead.playOffSound();
    }else if (this.lastOverhead !== this.overhead ){
      this.overhead.playOnSound();
    }

    let isUnderSeekingMob = false;

    if (this.seeking && this.seeking.dying > -1){
      this.seeking = null;
    }

    if (this.seeking) {
      isUnderSeekingMob = Pathing.collisionMath(this.location.x, this.location.y, 1, this.seeking.location.x, this.seeking.location.y, this.seeking.size);

      if (isUnderSeekingMob) {
        const maxDist = Math.ceil(this.seeking.size / 2);
        let bestDistance = 9999;
        let winner = null;
        for (let yy=-maxDist; yy < maxDist; yy++){
          for (let xx=-maxDist; xx < maxDist; xx++){
            const x = this.location.x + xx;
            const y = this.location.y + yy;
            if (Pathing.canTileBePathedTo(stage, x, y, 1, true)) {
              const distance = Pathing.dist(this.location.x, this.location.y, x, y);
              if (distance > 0 && distance < bestDistance){
                bestDistance = distance;
                winner = { x, y };
              }
            }
          }
        }
        if (winner){
          this.destinationLocation = new Point(winner.x, winner.y);
        }

      }else {
        this.hasLOS = LineOfSight.hasLineOfSightOfMob(stage, this.location.x, this.location.y, this.seeking, this.attackRange());
        if (!this.hasLOS){
          const seekingTiles = [];
          for (let xx=0; xx < this.seeking.size; xx++){
            for (let yy=0; yy < this.seeking.size; yy++){
              seekingTiles.push({
                x: this.seeking.location.x + xx, 
                y: this.seeking.location.y - yy
              });
            }
          }
          // Create paths to all npc tiles
          const potentialPaths = _.map(seekingTiles, (point) => Pathing.constructPath(stage, this.location, new Point(point.x, point.y)).length);
          // Figure out what the min distance is
          const shortestPathLength = _.min(potentialPaths);
          // Get all of the paths of the same minimum distance (can be more than 1)
          const shortestPaths = _.filter(_.map(potentialPaths, (length, index) => (length === shortestPathLength) ? seekingTiles[index] : null));
          // Take the path that is the shortest absolute distance from player
          this.destinationLocation = _.minBy(shortestPaths, (point) => Pathing.dist(this.location.x, this.location.y, point.x, point.y));
  
        }
      }
    }

    if (this.seeking && !isUnderSeekingMob && LineOfSight.hasLineOfSightOfMob(stage, this.location.x, this.location.y, this.seeking, this.attackRange())){
      this.destinationLocation = this.location;
    }

    this.perceivedLocation = this.location;
    if (Point.compare(this.location, this.destinationLocation) === false) {
      this.location = Pathing.path(stage, this.location, this.destinationLocation, 2, this.seeking);
    }
    
  }

  setPrayers(prayers){
    this.prayers = prayers;
  }

  attackRange() {
    if (this.manualSpellCastSelection) {
      return this.manualSpellCastSelection.attackRange;
    }
    return this.weapon.attackRange;
  }

  attackSpeed() {
    if (this.manualSpellCastSelection) {
      return this.manualSpellCastSelection.attackSpeed;
    }
    return this.weapon.attackSpeed;
  }
  
  attackStep(stage) {

    this.incomingProjectiles = _.filter(this.incomingProjectiles, (projectile) => projectile.delay > -1);

    this.incomingProjectiles.forEach((projectile) => {
      projectile.delay--;
      if (projectile.delay < 0) {
        this.currentStats.hitpoint -= projectile.damage;
      }
    });
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint);
    
    this.cd--;
    if (!this.seeking){
      return;
    }

    this.hasLOS = LineOfSight.hasLineOfSightOfMob(stage, this.location.x, this.location.y, this.seeking, this.attackRange());
    if (this.hasLOS && this.seeking && this.cd <= 0) {
      this.attack(stage)
      this.cd = this.attackSpeed();
    }
  }

  draw(stage, framePercent) {

    LineOfSight.drawLOS(stage, this.location.x, this.location.y, 1, this.attackRange());

    // Draw player
    stage.ctx.fillStyle = "#fff";
    
    // feedback for when you shoot
    if (this.cd == this.weapon.attackSpeed) {
      stage.ctx.fillStyle = "#00FFFF";
    }


    stage.ctx.strokeStyle = "#FFFFFF73"
    stage.ctx.lineWidth = 3;
    stage.ctx.strokeRect(
      this.location.x * Constants.tileSize,
      this.location.y * Constants.tileSize,
      Constants.tileSize,
      Constants.tileSize
    );

    let perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, framePercent);
    let perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, framePercent);

    // Perceived location

    stage.ctx.globalAlpha = .7;
    stage.ctx.fillStyle = "#FFFF00"
    stage.ctx.fillRect(
      perceivedX * Constants.tileSize, 
      perceivedY * Constants.tileSize, 
      Constants.tileSize, 
      Constants.tileSize
    );
    stage.ctx.globalAlpha = 1;
    ////
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
        perceivedX * Constants.tileSize + projectile.offsetX,
        (perceivedY) * Constants.tileSize + projectile.offsetY - 8,
        24,
        23
      );


      stage.ctx.fillStyle = "#FFFFFF";
      stage.ctx.font = "16px Stats_11";
      stage.ctx.textAlign="center";
      stage.ctx.fillText(
        projectile.damage, 
        perceivedX * Constants.tileSize + projectile.offsetX + 12,
        (perceivedY) * Constants.tileSize + projectile.offsetY + 15 - 8
      );
      stage.ctx.textAlign="left";

      
    });
    ////


    stage.ctx.fillStyle = "red";
    stage.ctx.fillRect(perceivedX * Constants.tileSize, (perceivedY * Constants.tileSize) - Constants.tileSize, Constants.tileSize, 5);
    stage.ctx.fillStyle = "green";
    stage.ctx.fillRect(perceivedX * Constants.tileSize, (perceivedY * Constants.tileSize) - Constants.tileSize, Math.min(1, (this.currentStats.hitpoint / this.stats.hitpoint)) * Constants.tileSize, 5);


    const overheads = this.prayers.filter(prayer => prayer.isOverhead());
    if (overheads.length){

      stage.ctx.drawImage(
        overheads[0].overheadImage(),
        perceivedX * Constants.tileSize,
        (perceivedY - 2) * Constants.tileSize,
        Constants.tileSize,
        Constants.tileSize
      );
    }


    // Destination location
    if (Point.compare(this.location, this.destinationLocation) === false) {
      // Draw highlighted tile
      stage.ctx.strokeStyle = "#FFFFFF73"
      stage.ctx.lineWidth = 3;
      stage.ctx.strokeRect(
        this.destinationLocation.x * Constants.tileSize, 
        this.destinationLocation.y * Constants.tileSize, 
        Constants.tileSize, 
        Constants.tileSize
      );
    }
    
  }
}
