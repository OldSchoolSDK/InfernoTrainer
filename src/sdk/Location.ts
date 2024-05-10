import { minBy } from "lodash";

export interface Location {
  x: number;
  y: number;
}

// Note: this coordinate system differs from THREE.js - x,y is same as the 2d x,y, and z is the plane.
export interface Location3 {
  x: number;
  y: number;
  z: number;
}

export interface Locatable {
  location: Location;
  size: number;
}

export class LocationUtils {
  
  static closestPointTo(x: number, y: number, mob: Locatable) {
    const corners = [];
    for (let xx = 0; xx < mob.size; xx++) {
      for (let yy = 0; yy < mob.size; yy++) {
        corners.push({
          x: mob.location.x + xx,
          y: mob.location.y - yy,
        });
      }
    }

    return minBy(corners, (point: Location) => LocationUtils.dist(x, y, point.x, point.y));
  }

  static dist(x: number, y: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));
  }

  static angle(x: number, y: number, x2: number, y2: number) {
    return Math.atan2(y2 - y, x2 - x);
  }
}