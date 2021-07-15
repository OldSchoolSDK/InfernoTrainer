'use strict';
import { Pathing } from "./Pathing";
import { Settings } from "./Settings";
import { LineOfSight } from "./LineOfSight";
import { TwistedBow } from "../content/weapons/TwistedBow";
import MissSplat from "../assets/images/hitsplats/miss.png"
import DamageSplat from "../assets/images/hitsplats/damage.png"
import _ from "lodash";

export class Player {

  constructor(location, weapon) {
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
    this.weapon = weapon;
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

  moveTo(region, x, y) {
    this.seeking = null;
    this.manualSpellCastSelection = null;


    const clickedOnEntities = Pathing.entitiesAtPoint(region, x, y, 1);
    if (clickedOnEntities.length) {
      // Clicked on an entity, scan around to find the best spot to actually path to
      const clickedOnEntity = clickedOnEntities[0];
      const maxDist = Math.ceil(clickedOnEntity.size / 2);
      let bestDistances = [];
      let bestDistance = 9999;
      for (let yOff=-maxDist; yOff < maxDist; yOff++){
        for (let xOff=-maxDist; xOff < maxDist; xOff++){
          const potentialX = x + xOff;
          const potentialY = y + yOff;
          const e = Pathing.entitiesAtPoint(region, potentialX, potentialY, 1);
          if (e.length === 0) {
            const distance = Pathing.dist(potentialX, potentialY, x, y);
            if (distance <= bestDistance){
              if (bestDistances[0] && bestDistances[0].bestDistance > distance){
                bestDistance = distance;
                bestDistances = [];
              }
              bestDistances.push({ x: potentialX, y: potentialY, bestDistance });
            }
          }
        }
      }
      const winner = _.minBy(bestDistances, (distance) => Pathing.dist(distance.x, distance.y, this.location.x, this.location.y));
      if (winner){
        this.destinationLocation = { x: winner.x, y: winner.y };
      }
    }else{
      this.destinationLocation = {x, y};
    }
  }

  attack(region) {

    
    if (this.manualSpellCastSelection){
      this.manualSpellCastSelection.cast(region, this, this.seeking);
      this.manualSpellCastSelection = null;
    }else{
      // use equipped weapon
      this.weapon.attack(region, this, this.seeking);
    }

    // this.playAttackSound();
  }

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  movementStep(region) {
    this.lastOverhead = this.overhead; 

    this.overhead = _.find(region.player.prayers, prayer => prayer.isOverhead() && prayer.isActive); 

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
            if (Pathing.canTileBePathedTo(region, x, y, 1, true)) {
              const distance = Pathing.dist(this.location.x, this.location.y, x, y);
              if (distance > 0 && distance < bestDistance){
                bestDistance = distance;
                winner = { x, y };
              }
            }
          }
        }
        if (winner){
          this.destinationLocation = { x: winner.x, y: winner.y };
        }

      } else {
        this.hasLOS = LineOfSight.hasLineOfSightOfMob(region, this.location.x, this.location.y, this.seeking, this.attackRange());
        if (!this.hasLOS) {
          const seekingTiles = [];
          // "When clicking on an npc, object, or player, the requested tiles will be all tiles"
          // "within melee range of the npc, object, or player."
          for (let xx=-1; xx <= this.seeking.size; xx++){
            for (let yy=-1; yy <= this.seeking.size; yy++){
              // Edges only, and no corners.
              if ((xx == -1 || xx == this.seeking.size || yy == -1 || yy == this.seeking.size)
                && ((xx != yy) && (xx != -1 || yy != this.seeking.size) && (xx != this.seeking.size || yy != -1))) {
                // Don't path into an unpathable object.
                const px = this.seeking.location.x + xx;
                const py = this.seeking.location.y - yy;
                if (!Pathing.collidesWithAnyEntities(region, px, py, 1)) {
                  seekingTiles.push({
                    x: px,
                    y: py
                  });
                }
              }
            }
          }
          // Create paths to all npc tiles
          const potentialPaths = _.map(seekingTiles, (point) => Pathing.constructPath(region, this.location, { x: point.x, y: point.y }));
          const validPaths = _.filter(potentialPaths, (path) => {
            return true;
          });
          const validPathLengths = _.map(validPaths, (path) => path.length);
          // Figure out what the min distance is
          const shortestPathLength = _.min(validPathLengths);
          // Get all of the paths of the same minimum distance (can be more than 1)
          const shortestPaths = _.filter(_.map(validPathLengths, (length, index) => (length === shortestPathLength) ? seekingTiles[index] : null));
          // Take the path that is the shortest absolute distance from player
          this.destinationLocation = _.minBy(shortestPaths, (point) => Pathing.dist(this.location.x, this.location.y, point.x, point.y));
  
        }
      }
    }

    if (this.seeking && !isUnderSeekingMob && LineOfSight.hasLineOfSightOfMob(region, this.location.x, this.location.y, this.seeking, this.attackRange())){
      this.destinationLocation = this.location;
    }

    this.perceivedLocation = this.location;
    if (this.destinationLocation) {
      this.location = Pathing.path(region, this.location, this.destinationLocation, 2, this.seeking);
    }    
  }

  // Returns true if this player is in melee range of its target.
  isWithinMeleeRange() {
    const targetX = this.seeking.location.x;
    const targetY = this.seeking.location.y;
    let isWithinMeleeRange = false;

    if (targetX === this.location.x - 1 && (targetY <= this.location.y + 1 && targetY > this.location.y - this.size - 1)) {
      isWithinMeleeRange = true;
    }else if (targetY === this.location.y + 1 && (targetX >= this.location.x && targetX < this.location.x + this.size)){
      isWithinMeleeRange = true;
    }else if (targetX === this.location.x + this.size && (targetY <= this.location.y + 1 && targetY > this.location.y - this.size - 1)) {
      isWithinMeleeRange = true;
    }else if (targetY === this.location.y - this.size && (targetX >= this.location.x && targetX < this.location.x + this.size)){
      isWithinMeleeRange = true;
    }
    return isWithinMeleeRange;
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
  
  attackStep(region) {

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

    this.hasLOS = LineOfSight.hasLineOfSightOfMob(region, this.location.x, this.location.y, this.seeking, this.attackRange());
    if (this.hasLOS && this.seeking && this.cd <= 0) {
      this.attack(region)
      this.cd = this.attackSpeed();
    }
  }

  draw(region, framePercent) {

    LineOfSight.drawLOS(region, this.location.x, this.location.y, 1, this.attackRange());


    let perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, framePercent);
    let perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, framePercent);

    // Perceived location

    region.ctx.globalAlpha = .7;
    region.ctx.fillStyle = "#FFFF00"
    region.ctx.fillRect(
      perceivedX * Settings.tileSize, 
      perceivedY * Settings.tileSize, 
      Settings.tileSize, 
      Settings.tileSize
    );
    region.ctx.globalAlpha = 1;
    
    // Draw player
    region.ctx.fillStyle = "#fff";
    
    // feedback for when you shoot
    if (this.cd == this.weapon.attackSpeed) {
      region.ctx.fillStyle = "#00FFFF";
    }

    region.ctx.strokeStyle = "#FFFFFF73"
    region.ctx.lineWidth = 3;
    region.ctx.fillRect(
      this.location.x * Settings.tileSize,
      this.location.y * Settings.tileSize,
      Settings.tileSize,
      Settings.tileSize
    );

    // Destination location
    region.ctx.strokeStyle = "#FFFFFF73"
    region.ctx.lineWidth = 3;
    region.ctx.strokeRect(
      this.destinationLocation.x * Settings.tileSize, 
      this.destinationLocation.y * Settings.tileSize, 
      Settings.tileSize, 
      Settings.tileSize
    );



    region.ctx.save();

    region.ctx.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2, 
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )


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
    region.ctx.fillRect(
      (-this.size / 2) * Settings.tileSize, 
      (-this.size / 2) * Settings.tileSize,
      (this.currentStats.hitpoint / this.stats.hitpoint) * (Settings.tileSize * this.size), 
      5
    );

    

    //
    let projectileOffsets = [
      [0, 12],
      [0, 28],
      [-14, 20],
      [14, 20]
    ];

    let projectileCounter = 0;
    this.incomingProjectiles.forEach((projectile) => {
      if (projectile.delay >= 0 ) {
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


    ////

    const overheads = this.prayers.filter(prayer => prayer.isOverhead());
    if (overheads.length){

      region.ctx.drawImage(
        overheads[0].overheadImage(),
        -Settings.tileSize / 2,
        -Settings.tileSize * 3,
        Settings.tileSize,
        Settings.tileSize
      );
    }

    region.ctx.restore();

    
  }
}
