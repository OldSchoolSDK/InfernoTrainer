import { Weapon } from "./Weapon";

export default class MeleeWeapon extends Weapon {
  attack(from, to, bonuses = {}){

    bonuses.prayerMultiplier = bonuses.prayerMultiplier || 1;
    bonuses.styleBonus = bonuses.styleBonus || 0;
    bonuses.voidMultiplier = bonuses.voidMultiplier || 1;
    bonuses.gearMultiplier = bonuses.gearMultiplier || 1;
    to.addProjectile(new Projectile(this._rollAttack(from, to, bonuses), from, to, 'melee'));

  }

  _rollAttack(from, to, bonuses){
    return (Math.random() > this._hitChance(from, to, bonuses)) ? 0 : Math.floor(Math.random() * this._maxHit(from, to, bonuses));
  }

  _strengthLevel(from, to, bonuses){
    return Math.floor((Math.floor(from.currentStats.strength * bonuses.prayerMultiplier) + bonuses.styleBonus + 8) * bonuses.voidMultiplier);
  }

  _maxHit(from, to, bonuses) {
    return Math.floor(Math.floor((this._strengthLevel(from,to,bonuses) * (from.bonuses.other.meleeStrength + 64) + 320) / 640) * bonuses.gearMultiplier)
  }

  _attackLevel(from, to, bonuses) {
    return Math.floor((Math.floor(from.currentStats.attack * bonuses.prayerMultiplier) + bonuses.styleBonus + 8) * bonuses.voidMultiplier);
  }

  _attackRoll(from, to, bonuses) {
    return Math.floor((this._attackLevel(from, to, bonuses) + (from.bonuses.attack.slash + 64)) * bonuses.gearMultiplier);
  }

  _defenceRoll(from, to, bonuses) {
    let defenceRoll = 0;
    if (to.isMob()) {
      return (to.currentStats.defence + 9) * (to.bonuses.defence.slash + 64);
    }else{
      return this._defenceLevel(from, to, bonuses) * (to.bonuses.defence.slash + 64);
    }
  }
  _defenceLevel(from, to, bonuses) {
    return (Math.floor(from.currentStats.defence * bonuses.prayerMultiplier) + bonuses.styleBonus + 8);
  }

  _hitChance(from, to, bonuses) {
    return (attackRoll > defenceRoll) ? (1 - (defenceRoll + 2) / (2 * attackRoll + 1)) : (attackRoll / (2 * defenceRoll + 1))
  }
}

