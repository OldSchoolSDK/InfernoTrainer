import Projectile from "./Projectile";
import { Weapon } from "./Weapon";

export default class RangedWeapon extends Weapon {
  attack(from, to, bonuses = {}){
    bonuses.effectivePrayers = {};
    if (from.isMob === false){
      const offensiveRange = _.find(from.prayers, (prayer) => prayer.feature() === 'offensiveRange');
      if (offensiveRange) {
        bonuses.effectivePrayers['range'] = offensiveRange;
      }
      const defence = _.find(from.prayers, (prayer) => prayer.feature() === 'defence');
      if (defence) {
        bonuses.effectivePrayers['defence'] = defence;
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
    let prayerMultiplier = 1;
    const rangePrayer = bonuses.effectivePrayers['range'];

    if (rangePrayer){
      if (rangePrayer.name === 'Sharp Eye'){
        prayerMultiplier = 1.05;
      }else if (rangePrayer.name === 'Hawk Eye'){
        prayerMultiplier = 1.1;
      }else if (rangePrayer.name === 'Eagle Eye'){
        prayerMultiplier = 1.15;
      }else if (rangePrayer.name === 'Rigour'){
        prayerMultiplier = 1.2;
      }
    }

    return Math.floor((Math.floor(from.currentStats.range) * prayerMultiplier) + (bonuses.isAccurate ? 3 : 0) + 8) * bonuses.voidMultiplier;
  }
  
  _maxHit(from, to, bonuses) {
    let prayerMultiplier = 1;
    const rangePrayer = bonuses.effectivePrayers['range'];
    if (rangePrayer){
      if (rangePrayer.name === 'Sharp Eye'){
        prayerMultiplier = 1.05;
      }else if (rangePrayer.name === 'Hawk Eye'){
        prayerMultiplier = 1.1;
      }else if (rangePrayer.name === 'Eagle Eye'){
        prayerMultiplier = 1.15;
      }else if (rangePrayer.name === 'Rigour'){
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

    let prayerMultiplier = 1;
    const defencePrayer = bonuses.effectivePrayers['defence'];

    if (defencePrayer){
      if (defencePrayer.name === 'Thick Skin'){
        prayerMultiplier = 1.05;
      }else if (defencePrayer.name === 'Mystic Will'){
        prayerMultiplier = 1.05;
      }else if (defencePrayer.name === 'Rock Skin'){
        prayerMultiplier = 1.1;
      }else if (defencePrayer.name === 'Mystic Lore'){
        prayerMultiplier = 1.1;
      }else if (defencePrayer.name === 'Steel Skin'){
        prayerMultiplier = 1.15;
      }else if (defencePrayer.name === 'Mystic Might'){
        prayerMultiplier = 1.15;
      }else if (defencePrayer.name === 'Chivalry'){
        prayerMultiplier = 1.2;
      }else if (defencePrayer.name === 'Piety'){
        prayerMultiplier = 1.25;
      }else if (defencePrayer.name === 'Rigour'){
        prayerMultiplier = 1.25;
      }else if (defencePrayer.name === 'Augury'){
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
