'use strict';
import _ from "lodash";
import chebyshev from "chebyshev";

import Constants from "./Constants";
import LineOfSight from "./LineOfSight";
import Pathing from "./Pathing";
import Projectile from "./Projectile";

import MissSplat from "../assets/images/hitsplats/miss.png"
import DamageSplat from "../assets/images/hitsplats/damage.png"
import { Weapon } from "./Weapon";

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
  
  constructor(location) {

    this.setStats();
    this.location = location;
    this.cd = 0;
    this.currentStats.hitpoint = this.stats.hitpoint;
    this.hasLOS = false;
    this.incomingProjectiles = [];


    this.missedHitsplatImage = new Image();
    this.missedHitsplatImage.src = MissSplat;
    this.damageHitsplatImage = new Image();
    this.damageHitsplatImage.src = DamageSplat;
    

    if (!this.mobImage){
      this.mobImage = new Image(Constants.tileSize * this.size, Constants.tileSize * this.size);
      this.mobImage.src = this.image;
    }
  }

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  setLocation(location) {
      this.location = location;
  }

  movementStep(stage) {

    let isUnderPlayer = Pathing.collisionMath(this.location.x, this.location.y, this.size, stage.player.location.x, stage.player.location.y, 1);

    this.hasLOS = LineOfSight.hasLineOfSightOfPlayer(stage, this.location.x, this.location.y, this.size, this.attackRange, true)
    if (!this.hasLOS) {
        var dx = this.location.x + Math.sign(stage.player.location.x - this.location.x);
        var dy = this.location.y + Math.sign(stage.player.location.y - this.location.y);

        if (Pathing.collisionMath(this.location.x, this.location.y, this.size, stage.player.location.x, stage.player.location.y, 1)) {
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
        } else if (Pathing.collisionMath(dx, dy, this.size, stage.player.location.x, stage.player.location.y, 1)) {
            //allows corner safespotting
            dy = this.location.y;
        }

        if (this.cd > this.cooldown) {
            // No movement right after melee dig. 8 ticks after the dig it should be able to move again.
            dx = this.location.x;
            dy = this.location.y;
        }

        if (Pathing.canTileBePathedTo(stage, dx, dy, this.size, this)) {
          this.location.x = dx;
          this.location.y = dy;
        } else if (Pathing.canTileBePathedTo(stage, dx, this.location.y, this.size, this)) {
          this.location.x = dx;
        } else if (Pathing.canTileBePathedTo(stage, this.location.x, dy, this.size, this)) {
          this.location.y = dy;
        }
  
      }
  }

  dead(stage) {
    stage.removeMob(this);
  }

  canMeleeIfClose() {
    return false;
  }

  attackStep(stage, playerPrayers) {

    this.incomingProjectiles = _.filter(this.incomingProjectiles, (projectile) => projectile.delay > -1);

    this.incomingProjectiles.forEach((projectile) => {
      projectile.delay--;
      if (projectile.delay == 0) {
        this.currentStats.hitpoint -= projectile.damage;
      }
    });
    this.currentStats.hitpoint = Math.max(0, this.currentStats.hitpoint);
    
    if (this.currentStats.hitpoint <= 0) {
      return this.dead(stage);
    }
    
    this.cd--;

    this.hadLOS = this.hasLOS;
    this.hasLOS = LineOfSight.hasLineOfSightOfPlayer(stage, this.location.x, this.location.y, this.size, this.attackRange, true);

    this.attackFeedback = Mob.attackIndicators.NONE;

    this.attackIfPossible(stage);
  }

  attackStyle() {
    return 'slash';
  }

  meleeDistanceAttackStyle() {
    return 'slash';
  }

  attackIfPossible(stage){
    let isUnderPlayer = Pathing.collisionMath(this.location.x, this.location.y, this.size, stage.player.location.x, stage.player.location.y, 1);

    if (!isUnderPlayer && this.hasLOS && this.cd <= 0){
      this.attack(stage);
    }
  }


  attack(stage){
    let attackStyle = this.attackStyle();

    if (this.canMeleeIfClose() && Weapon.isMeleeAttackStyle(attackStyle) === false){
      const playerX = stage.player.location.x;
      const playerY = stage.player.location.y;
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
        attackStyle = this.meleeDistanceAttackStyle();
      }
    }


    let damage = 0;
    let prayerAttackBlockStyle = attackStyle;
    if (Weapon.isMeleeAttackStyle(attackStyle)) { 
      prayerAttackBlockStyle = 'melee'; // because protect melee scans for the style as melee, generalize them
    }
    const protectionPrayerActive = _.find(stage.player.prayers, prayer => prayer.feature() === prayerAttackBlockStyle);
    if (protectionPrayerActive){
      this.attackFeedback = Mob.attackIndicators.BLOCKED;
    }else{
      this.weapons[attackStyle].attack(this, stage.player, { attackStyle })
      this.attackFeedback = Mob.attackIndicators.HIT;
    }
    
    stage.player.addProjectile(new Projectile(damage, this, stage.player, attackStyle));
    this.playAttackSound();

    this.cd = this.cooldown;
  }

  shouldShowAttackAnimation() {
    return this.cd === this.cooldown
  }

  playAttackSound (){
    if (Constants.playsAudio){
      new Audio(this.sound).play();
    }
  }

  draw(stage, framePercent) {

    LineOfSight.drawMobLOS(stage, this.location.x, this.location.y, this.size, this.attackRange, "#FFFFFF33");
        
    if (this.attackFeedback === Mob.attackIndicators.BLOCKED){
      stage.ctx.fillStyle = "#00FF00";
    } else if (this.attackFeedback === Mob.attackIndicators.HIT){
      stage.ctx.fillStyle = "#FF0000";
    } else if (this.attackFeedback === Mob.attackIndicators.SCAN){
      stage.ctx.fillStyle = "#FFFF00";
    } else if (this.hasLOS){
      stage.ctx.fillStyle = "#FF7300";
    } else {
      stage.ctx.fillStyle="#FFFFFF73";
    }

    stage.ctx.fillRect(
      this.location.x * Constants.tileSize,
      (this.location.y - this.size + 1) * Constants.tileSize,
      this.size * Constants.tileSize,
      this.size * Constants.tileSize
    );

    stage.ctx.save();

    stage.ctx.translate(this.location.x * Constants.tileSize + (this.size * Constants.tileSize) / 2, (this.location.y - this.size + 1) * Constants.tileSize + (this.size * Constants.tileSize) / 2)

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



    if (LineOfSight.hasLineOfSightOfMob(stage, stage.player.location.x, stage.player.location.y, this, this.size)){
      stage.ctx.strokeStyle = "#00FF0073"
      stage.ctx.lineWidth = 3;
      stage.ctx.strokeRect(
        this.location.x * Constants.tileSize,
        (this.location.y - this.size + 1) * Constants.tileSize,
        this.size * Constants.tileSize,
        this.size * Constants.tileSize
      );
    }

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

}
