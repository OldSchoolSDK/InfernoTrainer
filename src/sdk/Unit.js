

import MissSplat from "../assets/images/hitsplats/miss.png"
import DamageSplat from "../assets/images/hitsplats/damage.png"
import { Settings } from "./Settings";
import { LineOfSight } from "./LineOfSight";
import _ from "lodash";

export class Unit {
  static types = Object.freeze({
    MOB: 0,
    PLAYER: 1,
    ENTITY: 2
  });

  constructor(location, options) {

    this.prayers = [];
    this.lastOverhead = null;
    this.aggro = options.aggro || null;
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
    

    if (!this.unitImage){
      this.unitImage = new Image(Settings.tileSize * this.size, Settings.tileSize * this.size);
      this.unitImage.src = this.image;
    }

    this.currentAnimation = null;
    this.currentAnimationTickLength = 0;
    this.setStats();
    this.currentStats.hitpoint = this.stats.hitpoint;

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

  isDying() {
    return (this.dying > 0);
  }

  removedFromRegion(region){

  }

  // Returns true if the NPC can move towards the unit it is aggro'd against.
  canMove(region) {
    return (!this.hasLOS && this.frozen <= 0 && !this.isDying())
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
  
  shouldShowAttackAnimation() {
    return this.attackCooldownTicks === this.cooldown && this.dying === -1
  }

  setHasLOS(region){
    if (this.aggro === region.player) {
      this.hasLOS = LineOfSight.hasLineOfSightOfPlayer(region, this.location.x, this.location.y, this.size, this.attackRange, true)
    } else if (this.type === Unit.types.PLAYER) {
      this.hasLOS = LineOfSight.hasLineOfSightOfMob(region, this.location.x, this.location.y, this.aggro, this.attackRange);
    } else if (this.aggro.type === Unit.types.MOB){
      this.hasLOS = LineOfSight.hasLineOfSightOfMob(region, this.location.x, this.location.y, this.aggro, this.size, this.type === Unit.types.MOB);
    } else if (this.aggro.isEntity) {
      this.hasLOS = false;
    }
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

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  setLocation(location) {
      this.location = location;
  }

  setPrayers(prayers){
    this.prayers = prayers;
  }

  attackAnimation(region, framePercent){
    // override pls
  }

  drawHPBar(region){

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
    
  }

  drawIncomingProjectiles(region) {
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

  }

  drawOverheadPrayers(region) {

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
  }
}