
export interface Location {
  x: number;
  y: number;
}

export enum CollisionType {
  NONE = 0,
  BLOCK_MOVEMENT = 1,
  BLOCK_LOS = 2,
}

export class GameObject {
  location: Location;
  dying: number;

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
