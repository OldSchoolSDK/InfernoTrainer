
import { CollisionType } from '../../../sdk/Collision';
import { Entity } from '../../../sdk/Entity'
import { Settings } from '../../../sdk/Settings'

export class ZukShield extends Entity {

  movementDirection: boolean = Math.random() < 0.5 ? true : false;
  frozen: number = 1;

  get collisionType() {
    return CollisionType.NONE;
  }

  tick () {
    if (this.frozen <= 0 ){
      if (this.movementDirection) {
        this.location.x++;
      }else{
        this.location.x--;
      }
      if (this.location.x < 12) {
        this.frozen = 5;
        this.movementDirection = !this.movementDirection;
      }
      if (this.location.x > 36) {
        this.frozen = 5;
        this.movementDirection = !this.movementDirection;
      }      
    }

    this.frozen--;
  }

  get size() {
    return 3;
  }

  drawUILayer(tickPercent: number){

  }

  
  draw (tickPercent: number) {
    this.world.worldCtx.fillStyle = '#000073'

    this.world.worldCtx.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize
    )
  }

}