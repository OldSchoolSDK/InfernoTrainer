

import MissSplat from "../assets/images/hitsplats/miss.png"
import DamageSplat from "../assets/images/hitsplats/damage.png"
import { Settings } from "./Settings";

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

  addProjectile(projectile) {
    this.incomingProjectiles.push(projectile);
  }

  setLocation(location) {
      this.location = location;
  }

  attackAnimation(region, framePercent){
    // override pls
  }
}