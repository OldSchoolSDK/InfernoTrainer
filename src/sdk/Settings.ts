'use strict'

import { PlayerStats, SerializePlayerStats, DeserializePlayerStats } from "./PlayerStats";
import { Location } from './Location';

export class Settings {
  static tileSize = parseInt(window.localStorage.getItem('tile_size')) || 24;
  static fps = 50;
  static tickMs = 600;
  static playsAudio: boolean;
  static inputDelay: number;
  static rotated: string;
  static region: string;
  static displayXpDrops: boolean
  static lockPOV: boolean
  static displayFeedback: boolean
  static metronome: boolean

  static inventory_key: string;
  static spellbook_key: string;
  static equipment_key: string;
  static prayer_key: string;
  static combat_key: string;
  static tile_markers: Location[];


  static loadout: string;
  static onTask: boolean;
  static player_stats: PlayerStats;
  static is_keybinding = false;

  static displayPlayerLoS = false;
  static displayMobLoS = false;
  static menuVisible: boolean; 


  static minimapScale = Settings.mobileOrTabletCheck() ? 0.75 : 1;
  static controlPanelScale = Settings.mobileOrTabletCheck() ? 0.75 : 1;

  static _isMobileResult = null;
  static mobileOrTabletCheck() {
    if (Settings._isMobileResult !== null) {
      return Settings._isMobileResult;
    }
    let check = false;
    const w = window as any;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||w.opera);
    Settings._isMobileResult = check;
    return check;
  };

  static persistToStorage () {
    // window.localStorage.setItem('tileSize', Settings.tileSize);
    // window.localStorage.setItem('framesPerTick', Settings.framesPerTick);
    window.localStorage.setItem('playsAudio', String(Settings.playsAudio))
    window.localStorage.setItem('inputDelay', String(Settings.inputDelay))
    window.localStorage.setItem('rotated', Settings.rotated)
    window.localStorage.setItem('region', Settings.region)
    window.localStorage.setItem('displayXpDrops', String(Settings.displayXpDrops))

    window.localStorage.setItem('inventory_key', Settings.inventory_key)
    window.localStorage.setItem('spellbook_key', Settings.spellbook_key)
    window.localStorage.setItem('equipment_key', Settings.equipment_key)
    window.localStorage.setItem('prayer_key', Settings.prayer_key)
    window.localStorage.setItem('combat_key', Settings.combat_key)
    window.localStorage.setItem('stats', SerializePlayerStats(Settings.player_stats))
    window.localStorage.setItem('loadout', Settings.loadout)
    window.localStorage.setItem('onTask', String(Settings.onTask))
    window.localStorage.setItem('displayPlayerLoS', String(Settings.displayPlayerLoS))
    window.localStorage.setItem('displayMobLoS', String(Settings.displayMobLoS))
    window.localStorage.setItem('metronome', String(Settings.metronome))
    window.localStorage.setItem('displayFeedback', String(Settings.displayFeedback))
    window.localStorage.setItem('tile_markers', JSON.stringify(Settings.tile_markers))
    window.localStorage.setItem('lockPOV', JSON.stringify(Settings.lockPOV))
    window.localStorage.setItem('menuVisible', String(Settings.menuVisible))
  }

  static readFromStorage () {
    Settings.playsAudio = window.localStorage.getItem('playsAudio') === 'true' || false
    // Settings.tileSize = parseInt(window.localStorage.getItem('tileSize')) || 23;
    // Settings.framesPerTick = parseInt(window.localStorage.getItem('framesPerTick')) || 30;
    Settings.inputDelay = parseInt(window.localStorage.getItem('inputDelay')) || 100
    Settings.rotated = window.localStorage.getItem('rotated') || 'south'
    Settings.loadout = window.localStorage.getItem('loadout') || 'max_tbow';
    Settings.onTask = window.localStorage.getItem('onTask') === 'true' || false;
    Settings.displayPlayerLoS = window.localStorage.getItem('displayPlayerLoS') === 'true' || false;
    Settings.displayMobLoS = window.localStorage.getItem('displayMobLoS') === 'true' || false;
    Settings.lockPOV = false; //window.localStorage.getItem('lockPOV') !== 'false' || false;
    Settings.displayFeedback = !(window.localStorage.getItem('displayFeedback') === 'false' || false);
    Settings.metronome = window.localStorage.getItem('metronome') === 'true' || false;

    Settings.region = 'inferno'
    Settings.displayXpDrops = !(window.localStorage.getItem('displayXpDrops') === 'false' || false)

    Settings.inventory_key = window.localStorage.getItem('inventory_key') || 'F4'
    Settings.spellbook_key = window.localStorage.getItem('spellbook_key') || 'F2'
    Settings.equipment_key = window.localStorage.getItem('equipment_key') || 'F1'
    Settings.prayer_key = window.localStorage.getItem('prayer_key') || 'F3'
    Settings.combat_key = window.localStorage.getItem('combat_key') || 'F5'
    Settings.player_stats = DeserializePlayerStats(window.localStorage.getItem('stats'))
    Settings.tile_markers = JSON.parse(window.localStorage.getItem('tile_markers'))
    console.log('reading');
    if (window.localStorage.getItem('menuVisible') === 'true') {
      Settings.menuVisible = true;
    }else if (window.localStorage.getItem('menuVisible') === 'false') {
      Settings.menuVisible = false;
    }else{
      Settings.menuVisible = (Settings.mobileOrTabletCheck() === false);
    }
  }
}
