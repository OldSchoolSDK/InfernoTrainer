
export interface Location {
  x: number;
  y: number;
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

  constructor(){
    
  }

}
