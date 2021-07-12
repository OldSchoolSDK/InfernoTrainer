import Projectile from "./Projectile";
import { Weapon } from "./Weapon";

export default class RangedWeapon extends Weapon {
  attack(from, to, bonuses = {}){
    if (from.isMob === false){
      const offensivePrayer = _.find(from.prayers, (prayer) => prayer.feature() === 'offensiveRange');
      if (offensivePrayer) {
        bonuses.offensivePrayer = offensivePrayer;
      }
    }
    bonuses.isAccurate = bonuses.isAccurate || false;
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1;
    bonuses.gearMultiplier = bonuses.gearMultiplier || 1;
    to.addProjectile(new Projectile(this._rollAttack(from, to, bonuses), from, to, 'range'));
  }

  _rollAttack(from, to, bonuses){
    return (Math.random() > this._hitChance(from, to, bonuses)) ? 0 : Math.floor(Math.random() * this._maxHit(from, to, bonuses));
  }

  _hitChance(from, to, bonuses) {
    const attackRoll = this._attackRoll(from, to, bonuses) ;
    const defenceRoll = this._defenceRoll(from, to, bonuses);
    return (attackRoll > defenceRoll) ? (1 - (defenceRoll + 2) / (2 * attackRoll + 1)) : (attackRoll / (2 * defenceRoll + 1));    
  }

  _rangedAttack(from, to, bonuses){
    const prayerMultiplier = 1;
    if (bonuses.offensivePrayer){
      if (bonuses.offensivePrayer.Name === 'Sharp Eye'){
        prayerMultiplier = 1.05;
      }else if (bonuses.offensivePrayer.Name === 'Hawk Eye'){
        prayerMultiplier = 1.1;
      }else if (bonuses.offensivePrayer.Name === 'Eagle Eye'){
        prayerMultiplier = 1.15;
      }else if (bonuses.offensivePrayer.Name === 'Rigour'){
        prayerMultiplier = 1.2;
      }
    }

    return Math.floor((Math.floor(from.currentStats.range) * prayerMultiplier) + (bonuses.isAccurate ? 3 : 0) + 8) * bonuses.voidMultiplier;
  }
  
  _maxHit(from, to, bonuses) {

    const prayerMultiplier = 1;
    if (bonuses.offensivePrayer) {
      if (bonuses.offensivePrayer.Name === 'Sharp Eye'){
        prayerMultiplier = 1.05;
      }else if (bonuses.offensivePrayer.Name === 'Hawk Eye'){
        prayerMultiplier = 1.1;
      }else if (bonuses.offensivePrayer.Name === 'Eagle Eye'){
        prayerMultiplier = 1.15;
      }else if (bonuses.offensivePrayer.Name === 'Rigour'){
        prayerMultiplier = 1.23;
      } 
    }


    const rangedStrength = Math.floor((Math.floor(from.currentStats.range) * prayerMultiplier) + (bonuses.isAccurate ? 3 : 0) + 8) * bonuses.voidMultiplier;
    return Math.floor(Math.floor(0.5 + ((rangedStrength * (from.bonuses.other.rangedStrength + 64) / 640) * bonuses.gearMultiplier)) * this._damageMultiplier(from, to, bonuses));
  }

  _attackRoll(from, to, bonuses){
    return Math.floor(Math.floor(this._rangedAttack(from, to, bonuses) * (from.bonuses.attack.range + 64) * bonuses.gearMultiplier) * this._accuracyMultiplier(from, to, bonuses));
  }

  _defenceRoll(from, to, bonuses) {

    const prayerMultiplier = 1;
    if (bonuses.offensivePrayer){
      if (bonuses.offensivePrayer.Name === 'Thick Skin'){
        prayerMultiplier = 1.05;
      }else if (bonuses.offensivePrayer.Name === 'Mystic Will'){
        prayerMultiplier = 1.05;
      }else if (bonuses.offensivePrayer.Name === 'Rock Skin'){
        prayerMultiplier = 1.1;
      }else if (bonuses.offensivePrayer.Name === 'Mystic Lore'){
        prayerMultiplier = 1.1;
      }else if (bonuses.offensivePrayer.Name === 'Steel Skin'){
        prayerMultiplier = 1.15;
      }else if (bonuses.offensivePrayer.Name === 'Mystic Might'){
        prayerMultiplier = 1.15;
      } else if (bonuses.offensivePrayer.Name === 'Chivalry'){
        prayerMultiplier = 1.2;
      }else if (bonuses.offensivePrayer.Name === 'Piety'){
        prayerMultiplier = 1.25;
      } else if (bonuses.offensivePrayer.Name === 'Rigour'){
        prayerMultiplier = 1.25;
      } else if (bonuses.offensivePrayer.Name === 'Augury'){
        prayerMultiplier = 1.25;
      } 
    }

    return (to.currentStats.defence * prayerMultiplier + 9) * (to.bonuses.defence.range + 64);
  }

  _accuracyMultiplier(from, to, bonuses) {
    return 1 // Used for tbow passive effect
  }

  _damageMultiplier(from, to, bonuses) {
    return 1 // Used for tbow passive effect
  }
}
