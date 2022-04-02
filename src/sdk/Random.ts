export class Random {
  static memory = 0;
  static callCount = 0;
  static randomFn = () => Math.random();
  static setRandom(fn: () => number) {
    Random.randomFn = fn;
  }

  static get() {
    this.callCount++;
    return Random.randomFn();
  }
}