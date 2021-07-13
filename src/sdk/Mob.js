'use strict';
import _ from "lodash";

import Constants from "./Constants";
import LineOfSight from "./LineOfSight";
import Pathing from "./Pathing";
import Projectile from "./Weapons/Projectile";

import MissSplat from "../assets/images/hitsplats/miss.png"
import DamageSplat from "../assets/images/hitsplats/damage.png"
import { Weapon } from "./Weapons/Weapon";
import Point from "./Utils/Point";

export class Mob {

  static attackIndicators = Object.freeze({
    NONE: 0,
    HIT: 1,
    BLOCKED: 2,
    SCAN: 3,
  });

  get isMob() {
    return true;
  }

  get cooldown() {
    return 0;
  }

  get attackRange() {
    return 0;
  }

  get maxHit() {
    return 0;
  }

  get size() {
    return 0;
  }

  get image() {
    return null;
  }

  get sound() {
    return null;
  }

  get color() {
    return "#FFFFFF";
  }

  attackAnimation(stage, framePercent){
    // override pls
  }

  setStats () {

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
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      }
    }
  }
  
  constructor(location, aggro) {
    this.aggro = aggro;
    this.perceivedLocation = location;
    this.location = location;
    this.cd = 0;
    this.hasLOS = false;
    this.frozen = 0;
    this.dying = -1;
    this.incomingProjectiles = [];


    this.missedHitsplatImage = new Image();
    this.missedHitsplatImage.src = MissSplat;
    this.damageHitsplatImage = new Image();
    this.damageHitsplatImage.src = DamageSplat;
    

    if (!this.mobImage){
      this.mobImage = new Image(Constants.tileSize * this.size, Constants.tileSize * this.size);
      this.mobImage.src = this.image;
    }
    this.setStats();
    this.currentStats.hitpoint = this.stats.hitpoint;

  }

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  setLocation(location) {
      this.location = location;
  }

  setHasLOS(stage){
    if (this.aggro === stage.player) {
      this.hasLOS = LineOfSight.hasLineOfSightOfPlayer(stage, this.location.x, this.location.y, this.size, this.attackRange, true)
    }else if (this.aggro.isMob){
      this.hasLOS = LineOfSight.hasLineOfSightOfMob(stage, this.location.x, this.location.y, this.aggro, this.size, true);
    }else if (this.aggro.isEntity) {
      this.hasLOS = false;
    }
  }

  movementStep(stage) {

    if (this.dying === 0) {
      return;
    }
    this.perceivedLocation = new Point(this.location.x, this.location.y);

    this.setHasLOS(stage);
    if (!this.hasLOS && this.frozen <= 0 && this.dying == -1) {
      var dx = this.location.x + Math.sign(this.aggro.location.x - this.location.x);
      var dy = this.location.y + Math.sign(this.aggro.location.y - this.location.y);

      if (Pathing.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
          // Random movement if player is under the mob
          if (Math.random() < 0.5) {
              dy = this.location.y;
              if (Math.random() < 0.5) {
                  dx = this.location.x + 1
              } else {
                  dx = this.location.x - 1
              }
          } else {
              dx = this.location.x;
              if (Math.random() < 0.5) {
                  dy = this.location.y + 1
              } else {
                  dy = this.location.y - 1
              }
          }
      } else if (Pathing.collisionMath(dx, dy, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
          //allows corner safespotting
          dy = this.location.y;
      }

      if (this.cd > this.cooldown) {
          // No movement right after melee dig. 8 ticks after the dig it should be able to move again.
          dx = this.location.x;
          dy = this.location.y;
      }

      const both = Pathing.canTileBePathedTo(stage, dx, dy, this.size, this.consumesSpace);
      const xSpace = Pathing.canTileBePathedTo(stage, dx, this.location.y, this.size, this.consumesSpace);
      const ySpace = Pathing.canTileBePathedTo(stage, this.location.x, dy, this.size, this.consumesSpace);

      if (both && xSpace && ySpace) {
        this.location.x = dx;
        this.location.y = dy;
      } else if (ySpace) {
        this.location.y = dy;
      } else if (xSpace) {
        this.location.x = dx;
      }

    }

    this.frozen--;
  }

  dead(stage) {
    this.perceivedLocation = this.location;
    this.dying = 3;
  }

  // todo: Rename this possibly? it returns the attack style if it's possible
  canMeleeIfClose() {
    return false;
  }

  attackStep(stage, playerPrayers = []) {

    this.incomingProjectiles = _.filter(this.incomingProjectiles, (projectile) => projectile.delay > -1);
    
    if (this.dying === 0) {
      return;
    }

    this.incomingProjectiles.forEach((projectile) => {
      projectile.delay--;
      if (projectile.delay == 0) {
        this.currentStats.hitpoint -= projectile.damage;
      }
    });
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint);
    
    if (this.dying === -1 && this.currentStats.hitpoint <= 0) {
      return this.dead(stage);
    }
    
    this.cd--;

    this.hadLOS = this.hasLOS;
    this.setHasLOS(stage);

    this.attackIfPossible(stage);
    if (this.dying > 0){
      this.dying--;
    }
    if (this.dying === 0 ){
      this.removedFromStage(stage);
    }
  }

  removedFromStage(stage){

  }

  attackStyle() {
    return 'slash';
  }


  attackIfPossible(stage){
    let isUnderAggro = Pathing.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1);
    this.attackFeedback = Mob.attackIndicators.NONE;

    if (!isUnderAggro && this.hasLOS && this.cd <= 0){
      this.attack(stage);
    }
  }

  magicMaxHit() {
    return 0;
  }

  attack(stage){
    let attackStyle = this.attackStyle();

    if (this.canMeleeIfClose() && Weapon.isMeleeAttackStyle(attackStyle) === false){
      const playerX = this.aggro.location.x;
      const playerY = this.aggro.location.y;
      let isWithinMeleeRange = false;

      if (playerX === this.location.x - 1 && (playerY <= this.location.y + 1 && playerY > this.location.y - this.size - 1)) {
        isWithinMeleeRange = true;
      }else if (playerY === this.location.y + 1 && (playerX >= this.location.x && playerX < this.location.x + this.size)){
        isWithinMeleeRange = true;
      }else if (playerX === this.location.x + this.size && (playerY <= this.location.y + 1 && playerY > this.location.y - this.size - 1)) {
        isWithinMeleeRange = true;
      }else if (playerY === this.location.y - this.size && (playerX >= this.location.x && playerX < this.location.x + this.size)){
        isWithinMeleeRange = true;
      }
      if (isWithinMeleeRange && Math.random() < 0.5) { 
        attackStyle = this.canMeleeIfClose();
      }
    }

    if (this.weapons[attackStyle].isBlockable(this, this.aggro, {attackStyle})){
      this.attackFeedback = Mob.attackIndicators.BLOCKED;
    }else{
      this.attackFeedback = Mob.attackIndicators.HIT;
    }
    this.weapons[attackStyle].attack(stage, this, this.aggro, { attackStyle, magicBaseSpellDamage: this.magicMaxHit() })

    this.playAttackSound();

    this.cd = this.cooldown;
  }

  shouldShowAttackAnimation() {
    return this.cd === this.cooldown && this.dying === -1
  }

  get consumesSpace() {
    return this;
  }

  playAttackSound (){
    if (Constants.playsAudio){
      new Audio(this.sound).play();
    }
  }

  draw(stage, framePercent) {


    LineOfSight.drawMobLOS(stage, this.location.x, this.location.y, this.size, this.attackRange, "#FFFFFF33");
        
    if (this.dying > -1) {
      stage.ctx.fillStyle = "#964B00";
    }else if (this.attackFeedback === Mob.attackIndicators.BLOCKED){
      stage.ctx.fillStyle = "#00FF00";
    } else if (this.attackFeedback === Mob.attackIndicators.HIT){
      stage.ctx.fillStyle = "#FF0000";
    } else if (this.attackFeedback === Mob.attackIndicators.SCAN){
      stage.ctx.fillStyle = "#FFFF00";
    } else if (this.hasLOS){
      stage.ctx.fillStyle = "#FF7300";
    } else {
      stage.ctx.fillStyle="#FFFFFF22";
    }

    stage.ctx.save();


    let perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, framePercent);
    let perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, framePercent);

    stage.ctx.save();
    
    stage.ctx.translate(perceivedX * Constants.tileSize + (this.size * Constants.tileSize) / 2, (perceivedY - this.size + 1) * Constants.tileSize + (this.size * Constants.tileSize) / 2)



    stage.ctx.fillRect(
      -(this.size * Constants.tileSize) / 2,
      -(this.size * Constants.tileSize) / 2,
      this.size * Constants.tileSize,
      this.size * Constants.tileSize
    );

    if (this.shouldShowAttackAnimation()){
      this.attackAnimation(stage, framePercent);
    }

    stage.ctx.drawImage(
      this.mobImage,
      -(this.size * Constants.tileSize) / 2,
      -(this.size * Constants.tileSize) / 2,
      this.size * Constants.tileSize,
      this.size * Constants.tileSize
    );

    stage.ctx.restore();

    stage.ctx.translate(perceivedX * Constants.tileSize + (this.size * Constants.tileSize) / 2, (perceivedY - this.size + 1) * Constants.tileSize + (this.size * Constants.tileSize) / 2)

    stage.ctx.fillStyle = "red";
    stage.ctx.fillRect(
      -(this.size * Constants.tileSize) / 2,
      -(this.size * Constants.tileSize) / 2,
      Constants.tileSize * this.size, 
      5
    );
    stage.ctx.fillStyle = "green";
    stage.ctx.fillRect(
      -(this.size * Constants.tileSize) / 2,
      -(this.size * Constants.tileSize) / 2,
      (this.currentStats.hitpoint / this.stats.hitpoint) * (Constants.tileSize * this.size), 
      5
    );
    

    if (LineOfSight.hasLineOfSightOfMob(stage, this.aggro.location.x, this.aggro.location.y, this, stage.player.attackRange())){
      stage.ctx.strokeStyle = "#00FF0073"
      stage.ctx.lineWidth = 1;
      stage.ctx.strokeRect(
        -(this.size * Constants.tileSize) / 2,
        -(this.size * Constants.tileSize) / 2,
        this.size * Constants.tileSize,
        this.size * Constants.tileSize
      );
    }



    
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
        
        -12,
        -((this.size) * Constants.tileSize) / 2,
        24,
        23
      );
      stage.ctx.fillStyle = "#FFFFFF";
      stage.ctx.font = "16px Stats_11";
      stage.ctx.textAlign="center";
      stage.ctx.fillText(
        projectile.damage, 
        0,
        -((this.size) * Constants.tileSize) / 2 + 15,
      );
      stage.ctx.textAlign="left";
    });


    stage.ctx.restore();
  }

}
