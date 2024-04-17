export class Sound {
  constructor(
    public src,
    public volume = 1,
  ) {}
}

export class SoundCache {
  static preload() {
    return;
  }
  static play() {
    return;
  }
}
