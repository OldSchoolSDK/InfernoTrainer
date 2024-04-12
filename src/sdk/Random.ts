export class Random {
  static memory = 0;
  static callCount = 0;
  static randomFn = () => Math.random();
  static setRandom(fn: () => number) {
    Random.randomFn = fn;
  }

  static reset() {
    Random.memory = 0;
    Random.callCount = 0;
  }

  static get() {
    this.callCount++;
    return Random.randomFn();
  }
}
