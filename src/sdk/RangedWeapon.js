import { Weapon } from "./Weapon";

export default class RangedWeapon extends Weapon {
  attack(from, to){

    const prayerBonus = 1;
    const isAccurate = false;
    const voidModifier = 1;
    const gearBonus = 1;

    const rangedStrength = Math.floor((Math.floor(from.currentStats.ranged) * prayerBonus) + (isAccurate ? 3 : 0) + 8) * voidModifier;

    const maxHit = Math.floor(0.5 + ((rangedStrength * (from.bonuses.other.rangedStrength + 64) / 640) * gearBonus));

    const rangedAttack = Math.floor((Math.floor(from.currentStats.ranged) * prayerBonus) + (isAccurate ? 3 : 0) + 8) * voidModifier;

    const attackRoll = Math.floor(rangedAttack * (from.bonuses.attack.ranged + 64) * gearBonus)

    const defenceRoll = (to.currentStats.defence + 9) * (to.bonuses.defence.ranged + 64)

    let hitChance = 0;
    if (attackRoll > defenceRoll) {
      hitChance = 1 - (defenceRoll + 2) / (2 * attackRoll + 1);
    }else{
      hitChance = attackRoll / (2 * defenceRoll + 1)
    }

    let damage;
    if (Math.random() > hitChance) {
      damage = 0;
    }else{
      damage = Math.random() * maxHit;
    }

    to.addProjectile(new Projectile(damage, from, to, 'range'));
  }
}
