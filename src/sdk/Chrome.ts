import { Settings } from './Settings';

export class Chrome {

  static size() {
    const width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - (Settings.menuVisible ? 220 : 0);
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;  
    return {width, height};
  }
}