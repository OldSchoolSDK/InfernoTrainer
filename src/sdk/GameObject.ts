import { CollisionType } from "./Collision";

export interface Location {
  x: number;
  y: number;
}

export class GameObject {
  location: Location;
  dying: number = -1;

  get size () {
    return 1;
  }

  get type () {
    return -1;
  }

  get collisionType() {
    return CollisionType.BLOCK_LOS;
  }

  constructor(){
    
  }
}
