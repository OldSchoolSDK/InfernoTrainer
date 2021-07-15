

import MissSplat from "../assets/images/hitsplats/miss.png"
import DamageSplat from "../assets/images/hitsplats/damage.png"
import { Settings } from "./Settings";
import { LineOfSight } from "./LineOfSight";

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
    }else if (this.aggro.type === Unit.types.MOB){
      this.hasLOS = LineOfSight.hasLineOfSightOfMob(region, this.location.x, this.location.y, this.aggro, this.size, this.type === Unit.types.MOB);
    }else if (this.aggro.isEntity) {
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
}