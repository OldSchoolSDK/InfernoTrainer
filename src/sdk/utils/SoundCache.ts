export class SoundCache {
  static soundCache = {};

  static getCachedSound(src: string): HTMLAudioElement {
    if (!src) {
      return null;
    }

    if (this.soundCache[src]) {
      return this.soundCache[src];
    }

    return (this.soundCache[src] = new Audio(src));
  }
}
