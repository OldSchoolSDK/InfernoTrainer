export class Random {
  static memory: number = 0;
  static randomFn = () => Math.random();
  static setRandom(fn: () => number) {
    Random.randomFn = fn;
  }

  static get() {
    return Random.randomFn();
  }
}