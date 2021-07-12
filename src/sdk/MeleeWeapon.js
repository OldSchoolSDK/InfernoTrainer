import Projectile from "./Projectile";
import { Weapon } from "./Weapon";

export default class MeleeWeapon extends Weapon {
  attack(from, to, bonuses = {}){
    bonuses.effectivePrayers = {};
    if (from.isMob === false){
      const offensiveAttack = _.find(from.prayers, (prayer) => prayer.feature() === 'offensiveAttack');
      if (offensiveAttack) {
        bonuses.effectivePrayers['attack'] = offensiveAttack;
      }
      
      const offensiveStrength = _.find(from.prayers, (prayer) => prayer.feature() === 'offensiveStrength');
      if (offensiveStrength) {
        bonuses.effectivePrayers['strength'] = offensiveStrength;
      }
      
      const defence = _.find(from.prayers, (prayer) => prayer.feature() === 'defence');
      if (defence) {
        bonuses.effectivePrayers['defence'] = defence;
      }
      
    }

    bonuses.attackStyle = bonuses.attackStyle || 'slash';
    bonuses.styleBonus = bonuses.styleBonus || 0;
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1;
    bonuses.gearMultiplier = bonuses.gearMultiplier || 1;
    to.addProjectile(new Projectile(this._rollAttack(from, to, bonuses), from, to, bonuses.attackStyle ));
  }

  _rollAttack(from, to, bonuses){
    return (Math.random() > this._hitChance(from, to, bonuses)) ? 0 : Math.floor(Math.random() * this._maxHit(from, to, bonuses));
  }

  _strengthLevel(from, to, bonuses){
    let prayerMultiplier = 1;
    const strengthPrayer = bonuses.effectivePrayers['strength'];

    if (strengthPrayer){
      if (strengthPrayer.name === 'Burst of Strength'){
        prayerMultiplier = 1.05;
      }else if (strengthPrayer.name === 'Superhuman Strength'){
        prayerMultiplier = 1.1;
      }else if (strengthPrayer.name === 'Ultimate Strength'){
        prayerMultiplier = 1.15;
      }else if (strengthPrayer.name === 'Chivalry'){
        prayerMultiplier = 1.18;
      }else if (strengthPrayer.name === 'Piety'){
        prayerMultiplier = 1.23;
      }
    }
    return Math.floor((Math.floor(from.currentStats.strength * prayerMultiplier) + bonuses.styleBonus + 8) * bonuses.voidMultiplier);
  }

  _maxHit(from, to, bonuses) {
    return Math.floor(Math.floor((this._strengthLevel(from,to,bonuses) * (from.bonuses.other.meleeStrength + 64) + 320) / 640) * bonuses.gearMultiplier)
  }

  _attackLevel(from, to, bonuses) {
    const attackPrayer = bonuses.effectivePrayers['attack'];
    let prayerMultiplier = 1;
    if (attackPrayer){
      if (attackPrayer.name === 'Clarity of Thought'){
        prayerMultiplier = 1.05;
      }else if (attackPrayer.name === 'Improved Reflexes'){
        prayerMultiplier = 1.1;
      }else if (attackPrayer.name === 'Incredible Reflexes'){
        prayerMultiplier = 1.15;
      }else if (attackPrayer.name === 'Chivalry'){
        prayerMultiplier = 1.15;
      }else if (attackPrayer.name === 'Piety'){
        prayerMultiplier = 1.2;
      }
    }

    return Math.floor((Math.floor(from.currentStats.attack * prayerMultiplier) + bonuses.styleBonus + 8) * bonuses.voidMultiplier);
  }

  _attackRoll(from, to, bonuses) {
    return Math.floor((this._attackLevel(from, to, bonuses) * (from.bonuses.attack.slash + 64)) * bonuses.gearMultiplier);
  }

  _defenceRoll(from, to, bonuses) {
    if (to.isMob) {
      return (to.currentStats.defence + 9) * (to.bonuses.defence.slash + 64);
    }else{
      return this._defenceLevel(from, to, bonuses) * (from.bonuses.defence.slash + 64);
    }
  }
  _defenceLevel(from, to, bonuses) {

    const defencePrayer = bonuses.effectivePrayers['defence'];
    let prayerMultiplier = 1;
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
      } else if (defencePrayer.name === 'Chivalry'){
        prayerMultiplier = 1.2;
      }else if (defencePrayer.name === 'Piety'){
        prayerMultiplier = 1.25;
      } else if (defencePrayer.name === 'Rigour'){
        prayerMultiplier = 1.25;
      } else if (defencePrayer.name === 'Augury'){
        prayerMultiplier = 1.25;
      } 
    }
    return (Math.floor(from.currentStats.defence * prayerMultiplier) + bonuses.styleBonus + 8);
  }

  _hitChance(from, to, bonuses) {
    const attackRoll = this._attackRoll(from, to, bonuses) ;
    const defenceRoll = this._defenceRoll(from, to, bonuses);
    return (attackRoll > defenceRoll) ? (1 - (defenceRoll + 2) / (2 * attackRoll + 1)) : (attackRoll / (2 * defenceRoll + 1))
  }
}

