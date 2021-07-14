'use strict';

export class Point {
  constructor(x, y) {
    if (isNaN(x) || isNaN(y)){
      console.log(`We received points that are not numbers. (X: ${x}, Y: ${y})`)
    }
    this.x = x;
    this.y = y;
  }

  static compare(p1, p2) {
    return p1 && p2 && p1.x === p2.x && p1.y === p2.y;
  }

  toString() {
    return `(X: ${this.x}, Y: ${this.y})`;
  }
}
