'use strict';
import _ from "lodash";

import { Settings } from "./Settings";
import { LineOfSight } from "./LineOfSight";
import { Pathing } from "./Pathing";

import { Weapon } from "./Weapons/Weapon";
import { Unit } from "./Unit";

export class Mob extends Unit{

  static attackIndicators = Object.freeze({
    NONE: 0,
    HIT: 1,
    BLOCKED: 2,
    SCAN: 3,
  });

  get type() {
    return Unit.types.MOB;
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
  
  constructor(location, options) {
    super(location, options);
    
    if (!this.mobRangeAttackAnimation && this.rangeAttackAnimation !== null) {
      this.mobRangeAttackAnimation = _.map(this.rangeAttackAnimation, image => {
        let img = new Image(Settings.tileSize * this.size, Settings.tileSize * this.size);
        img.src = image;
        return img;
      });
    }
  }


  movementStep(region) {

    if (this.dying === 0) {
      return;
    }
    this.perceivedLocation = { x:this.location.x, y: this.location.y };

    this.setHasLOS(region);
    if (this.canMove(region)) {
      var dx = this.location.x + Math.sign(this.aggro.location.x - this.location.x);
      var dy = this.location.y + Math.sign(this.aggro.location.y - this.location.y);

      if (Pathing.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1)) {
          // Random movement if player is under the mob.
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

      if (this.attackCooldownTicks > this.cooldown) {
          // No movement right after melee dig. 8 ticks after the dig it should be able to move again.
          dx = this.location.x;
          dy = this.location.y;
      }

      const both = Pathing.canTileBePathedTo(region, dx, dy, this.size, this.consumesSpace);
      const xSpace = Pathing.canTileBePathedTo(region, dx, this.location.y, this.size, this.consumesSpace);
      const ySpace = Pathing.canTileBePathedTo(region, this.location.x, dy, this.size, this.consumesSpace);
      const cornerFilter = this.size > 1 ? (xSpace || ySpace) : (xSpace && ySpace);
      if (both && cornerFilter) {
        this.location.x = dx;
        this.location.y = dy;
      } else if (xSpace) {
        this.location.x = dx;
      } else if (ySpace) {
        this.location.y = dy;
      }

    }

    this.frozen--;
  }
  // todo: Rename this possibly? it returns the attack style if it's possible
  canMeleeIfClose() {
    return false;
  }

  attackStep(region, playerPrayers = []) {
    if (this.currentAnimationTickLength > 0) {
      if (--this.currentAnimationTickLength == 0) {
        this.currentAnimation = null;
      }
    }

    if (this.dying === 0) {
      return;
    }
    
    this.processIncomingAttacks();
    this.attackIfPossible(region);
    this.detectDeath();
  }
  

  get attackStyle() {
    return 'slash';
  }


  attackIfPossible(region){

    this.attackCooldownTicks--;

    this.hadLOS = this.hasLOS;
    this.setHasLOS(region);

    let weaponIsAreaAttack = this.weapons[this.attackStyle].isAreaAttack;
    let isUnderAggro = false;
    if (!weaponIsAreaAttack) {
      isUnderAggro = Pathing.collisionMath(this.location.x, this.location.y, this.size, this.aggro.location.x, this.aggro.location.y, 1);
    }
    this.attackFeedback = Mob.attackIndicators.NONE;

    if (!isUnderAggro && this.hasLOS && this.attackCooldownTicks <= 0){
      this.attack(region);
    }
  }

  magicMaxHit() {
    return 0;
  }

  attack(region){
    let attackStyle = this.attackStyle;

    if (this.canMeleeIfClose() && Weapon.isMeleeAttackStyle(attackStyle) === false){
      if (this.isWithinMeleeRange() && Math.random() < 0.5) { 
        attackStyle = this.canMeleeIfClose();
      }
    }

    // if (!this.weapons[attackStyle])
    // {
    //   console.log('WEAPON FAILURE?', this, attackStyle);
    //   klsfjlksdjf; // Intentionally crash JS so no values update
    // }
    
    if (this.weapons[attackStyle].isBlockable(this, this.aggro, {attackStyle})){
      this.attackFeedback = Mob.attackIndicators.BLOCKED;
    }else{
      this.attackFeedback = Mob.attackIndicators.HIT;
    }
    this.weapons[attackStyle].attack(region, this, this.aggro, { attackStyle, magicBaseSpellDamage: this.magicMaxHit() })

    // hack hack
    if (attackStyle == 'range' && !this.currentAnimation) {
      this.currentAnimation = this.mobRangeAttackAnimation;
      this.currentAnimationTickLength = 1;
    }

    this.playAttackSound();

    this.attackCooldownTicks = this.cooldown;
  }

  get consumesSpace() {
    return this;
  }

  playAttackSound (){
    if (Settings.playsAudio){
      new Audio(this.sound).play();
    }
  }

  get displayName(){
    return "Jal-No-Name";
  }

  get combatLevel() {
    return 99
  }

  get combatLevelColor() {
    return 'red';
  }

  contextActions(region, x, y){
    return [
      {
        text: [{text: "Attack ", fillStyle: "white"}, {text: this.displayName, fillStyle: "yellow"},{text: ` (level ${this.combatLevel})`, fillStyle: this.combatLevelColor}],
        action: () => {
          region.redClick();
          region.playerAttackClick(this);
        }
      }
    ]
  }

  draw(region, framePercent) {

    LineOfSight.drawLOS(region, this.location.x, this.location.y, this.size, this.attackRange, "#FFFFFF73", this.type === Unit.types.MOB);
        
    let perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, framePercent);
    let perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, framePercent);
    region.ctx.save();
    region.ctx.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2, 
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )


    if (this.dying > -1) {
      region.ctx.fillStyle = "#964B00";
    }else if (this.attackFeedback === Mob.attackIndicators.BLOCKED){
      region.ctx.fillStyle = "#00FF00";
    } else if (this.attackFeedback === Mob.attackIndicators.HIT){
      region.ctx.fillStyle = "#FF0000";
    } else if (this.attackFeedback === Mob.attackIndicators.SCAN){
      region.ctx.fillStyle = "#FFFF00";
    } else if (this.hasLOS){
      region.ctx.fillStyle = "#FF7300";
    } else {
      region.ctx.fillStyle="#FFFFFF22";
    }

    // Draw mob
    region.ctx.fillRect(
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    );

    let currentImage = this.unitImage;
    if (this.currentAnimation != null) {
      const animationLength = this.currentAnimation.length;
      // TODO multi-tick animations.
      const currentFrame = Math.floor(framePercent * animationLength);
      if (currentFrame < animationLength) {
        currentImage = this.currentAnimation[currentFrame];
      } else {
        this.currentAnimation = null;
      }
    }

    if (this.shouldShowAttackAnimation()){
      this.attackAnimation(region, framePercent);
    }

    region.ctx.restore();

    region.ctx.save();

    region.ctx.translate(
      perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2, 
      (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2
    )
    if (Settings.rotated === 'south'){
      region.ctx.rotate(Math.PI)
    }
    if (Settings.rotated === 'south'){
      region.ctx.scale(-1, 1);
    }

    region.ctx.drawImage(
      currentImage,
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    );
    if (Settings.rotated === 'south'){
      region.ctx.scale(-1, 1);
    }

    if (LineOfSight.hasLineOfSightOfMob(region, this.aggro.location.x, this.aggro.location.y, this, region.player.attackRange)){
      region.ctx.strokeStyle = "#00FF0073"
      region.ctx.lineWidth = 1;
      region.ctx.strokeRect(
        -(this.size * Settings.tileSize) / 2,
        -(this.size * Settings.tileSize) / 2,
        this.size * Settings.tileSize,
        this.size * Settings.tileSize
      );
    }
    



    this.drawHPBar(region);

    this.drawIncomingProjectiles(region);

    this.drawOverheadPrayers(region);

    region.ctx.restore();
  }

}
