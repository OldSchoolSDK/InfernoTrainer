import { Weapon } from "./Weapon";

export default class RangedWeapon extends Weapon {
  attack(from, to, bonuses = {}){
    bonuses.prayerMultiplier = bonuses.prayerMultiplier || 1;
    bonuses.isAccurate = bonuses.isAccurate || false;
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1;
    bonuses.gearMultiplier = bonuses.gearMultiplier || 1;
    to.addProjectile(new Projectile(this._rollAttack(from, to, bonuses), from, to, 'range'));
  }

  _rollAttack(from, to, bonuses){
    return (Math.random() > this._hitChance(from, to, bonuses)) ? 0 : Math.floor(Math.random() * this._maxHit(from, to, bonuses));
  }

  _rangedAttack(from, to, bonuses){
    return Math.floor((Math.floor(from.currentStats.ranged) * bonuses.prayerMultiplier) + (bonuses.isAccurate ? 3 : 0) + 8) * bonuses.voidMultiplier;
  }

  _maxHit(from, to, bonuses) {
    const rangedStrength = Math.floor((Math.floor(from.currentStats.ranged) * bonuses.prayerMultiplier) + (bonuses.isAccurate ? 3 : 0) + 8) * bonuses.voidMultiplier;
    return Math.floor(0.5 + ((rangedStrength * (from.bonuses.other.rangedStrength + 64) / 640) * bonuses.gearMultiplier));
  }

  _attackRoll(from, to, bonuses){
    return Math.floor(this._rangedAttack(from, to, bonuses) * (from.bonuses.attack.ranged + 64) * bonuses.gearMultiplier)
  }

  _defenceRoll(from, to, bonuses) {
    return (to.currentStats.defence + 9) * (to.bonuses.defence.ranged + 64);
  }

  _hitChance(from, to, bonuses) {
    const attackRoll = this._attackRoll(from, to, bonuses) ;
    const defenceRoll = this._defenceRoll(from, to, bonuses);
    return (attackRoll > defenceRoll) ? (1 - (defenceRoll + 2) / (2 * attackRoll + 1)) : (attackRoll / (2 * defenceRoll + 1));    
  }
}
