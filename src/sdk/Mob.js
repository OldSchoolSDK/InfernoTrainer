'use strict';
import _ from "lodash";

import { Settings } from "./Settings";
import { LineOfSight } from "./LineOfSight";
import { Pathing } from "./Pathing";

import MissSplat from "../assets/images/hitsplats/miss.png"
import DamageSplat from "../assets/images/hitsplats/damage.png"
import { Weapon } from "./Weapons/Weapon";

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

  // TODO more modular
  get rangeAttackAnimation() {
    return null;
  }

  get sound() {
    return null;
  }

  get color() {
    return "#FFFFFF";
  }

  attackAnimation(region, framePercent){
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
    this.attackCooldownTicks = 0;
    this.hasLOS = false;
    this.frozen = 0;
    // Number of ticks until NPC dies. If -1, the NPC is not dying.
    this.dying = -1;
    this.incomingProjectiles = [];


    this.missedHitsplatImage = new Image();
    this.missedHitsplatImage.src = MissSplat;
    this.damageHitsplatImage = new Image();
    this.damageHitsplatImage.src = DamageSplat;
    

    if (!this.mobImage){
      this.mobImage = new Image(Settings.tileSize * this.size, Settings.tileSize * this.size);
      this.mobImage.src = this.image;
    }
    if (!this.mobRangeAttackAnimation && this.rangeAttackAnimation !== null) {
      this.mobRangeAttackAnimation = _.map(this.rangeAttackAnimation, image => {
        let img = new Image(Settings.tileSize * this.size, Settings.tileSize * this.size);
        img.src = image;
        return img;
      });
    }
    this.currentAnimation = null;
    this.currentAnimationTickLength = 0;
    this.setStats();
    this.currentStats.hitpoint = this.stats.hitpoint;

  }

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  setLocation(location) {
      this.location = location;
  }

  setHasLOS(region){
    if (this.aggro === region.player) {
      this.hasLOS = LineOfSight.hasLineOfSightOfPlayer(region, this.location.x, this.location.y, this.size, this.attackRange, true)
    }else if (this.aggro.isMob){
      this.hasLOS = LineOfSight.hasLineOfSightOfMob(region, this.location.x, this.location.y, this.aggro, this.size, true);
    }else if (this.aggro.isEntity) {
      this.hasLOS = false;
    }
  }

  isDying() {
    return (this.dying > 0);
  }

  // Returns true if the NPC can move towards the unit it is aggro'd against.
  getCanMove(region) {
    return (!this.hasLOS && this.frozen <= 0 && !this.isDying())
  }

  movementStep(region) {

    if (this.dying === 0) {
      return;
    }
    this.perceivedLocation = { x:this.location.x, y: this.location.y };

    this.setHasLOS(region);
    if (this.getCanMove(region)) {
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

  dead(region) {
    this.perceivedLocation = this.location;
    this.dying = 3;
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
      return this.dead(region);
    }
    
    this.attackCooldownTicks--;

    this.hadLOS = this.hasLOS;
    this.setHasLOS(region);

    this.attackIfPossible(region);
    if (this.dying > 0){
      this.dying--;
    }
    if (this.dying === 0 ){
      this.removedFromRegion(region);
    }
  }

  removedFromRegion(region){

  }

  attackStyle() {
    return 'slash';
  }

  attackIfPossible(region){
    let weaponIsAreaAttack = this.weapons[this.attackStyle()].isAreaAttack;
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

  // Returns true if this mob is in melee range of its target.
  isWithinMeleeRange() {
    const targetX = this.aggro.location.x;
    const targetY = this.aggro.location.y;
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

  // Returns true if this mob is on the specified tile.
  isOnTile(x, y) {
    return (x >= this.location.x && x <= this.location.x + this.size) && (y <= this.location.y && y >= this.location.y - this.size);
  }

  // Returns the closest tile on this mob to the specified point.
  getClosestTileTo(x, y) {
    // We simply clamp the target point to our own boundary box.
    return [_.clamp(x, this.location.x, this.location.x + this.size), _.clamp(y, this.location.y, this.location.y - this.size)];
  }

  attack(region){
    let attackStyle = this.attackStyle();

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
      console.log("animate range");
      this.currentAnimation = this.mobRangeAttackAnimation;
      this.currentAnimationTickLength = 1;
    }

    this.playAttackSound();

    this.attackCooldownTicks = this.cooldown;
  }

  shouldShowAttackAnimation() {
    return this.attackCooldownTicks === this.cooldown && this.dying === -1
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


    LineOfSight.drawMobLOS(region, this.location.x, this.location.y, this.size, this.attackRange, "#FFFFFF33");
        
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

    let perceivedX = Pathing.linearInterpolation(this.perceivedLocation.x, this.location.x, framePercent);
    let perceivedY = Pathing.linearInterpolation(this.perceivedLocation.y, this.location.y, framePercent);

    region.ctx.save();
    
    region.ctx.translate(perceivedX * Settings.tileSize + (this.size * Settings.tileSize) / 2, (perceivedY - this.size + 1) * Settings.tileSize + (this.size * Settings.tileSize) / 2)



    region.ctx.fillRect(
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    );

    let currentImage = this.mobImage;
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
      region.ctx.scale(-1, -1);
    }

    region.ctx.drawImage(
      currentImage,
      -(this.size * Settings.tileSize) / 2,
      -(this.size * Settings.tileSize) / 2,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    );
    if (Settings.rotated === 'south'){
      region.ctx.scale(-1, -1);
    }




    if (LineOfSight.hasLineOfSightOfMob(region, this.aggro.location.x, this.aggro.location.y, this, region.player.attackRange())){
      region.ctx.strokeStyle = "#00FF0073"
      region.ctx.lineWidth = 1;
      region.ctx.strokeRect(
        -(this.size * Settings.tileSize) / 2,
        -(this.size * Settings.tileSize) / 2,
        this.size * Settings.tileSize,
        this.size * Settings.tileSize
      );
    }
    


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

      let hitsplatOriginX = 0 + projectile.offsetX;
      let hitsplatOriginY = 0 + projectile.offsetY;

      region.ctx.drawImage(
        image,
        hitsplatOriginX - 12,
        hitsplatOriginY - 12,
        24,
        23
      );
      region.ctx.fillStyle = "#FFFFFF";
      region.ctx.font = "16px Stats_11";
      region.ctx.textAlign="center";
      region.ctx.fillText(
        projectile.damage, 
        hitsplatOriginX,
        hitsplatOriginY + 3,
      );
      region.ctx.textAlign="left";
    });

    region.ctx.restore();
  }

}
