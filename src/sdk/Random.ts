export class Random {
  static memory: number = 0;
  static randomFn = () => Math.random();
  static setRandom(type: string) {
    if (type === 'sin') {
      Random.randomFn = () => {
        Random.memory = (Random.memory + 13.37) % 180;
        return Math.abs(Math.sin(Random.memory * 0.0174533));
      }
    }
  }

  static get() {
    return Random.randomFn();
  }
}