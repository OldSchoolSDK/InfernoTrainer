const LOADING_SOUND = null;

export class SoundCache {

  static soundCache = {};

  static context = new AudioContext();
  static cachedSounds: {[src: string]: AudioBuffer} = {};
  
  static getCachedSound (src: string): HTMLAudioElement {
    if (!src) {
      return null;
    }

    if (this.soundCache[src]) {
      return this.soundCache[src];
    }
    
    return this.soundCache[src] = new Audio(src);
  }

  static async preload(src: string) {
    if (SoundCache.cachedSounds[src] === LOADING_SOUND) {
      return null;
    }
    SoundCache.cachedSounds[src] = LOADING_SOUND;
    const response = await window.fetch(src);
    const buffer = await response.arrayBuffer();
    const audioBuffer = await SoundCache.context.decodeAudioData(buffer);
    SoundCache.cachedSounds[src] = audioBuffer;
  }

  static play(src: string, volume = 1) {
    if (this.cachedSounds[src] === undefined) {
      new Promise(() => SoundCache.preload(src));
      return;
    }
    if (!this.cachedSounds[src]) {
      return;
    }
    const source = SoundCache.context.createBufferSource();
    source.buffer = this.cachedSounds[src];
    let connect: AudioNode = SoundCache.context.destination;
    if (volume !== 1) {
      const gainNode = SoundCache.context.createGain();
      gainNode.gain.value = volume;
      source.connect(gainNode);
      gainNode.connect(SoundCache.context.destination);
      connect = gainNode;
    }
    source.connect(connect);
    source.start();

  }
}