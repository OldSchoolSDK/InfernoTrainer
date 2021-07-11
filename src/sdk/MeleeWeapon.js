import { Weapon } from "./Weapon";

export default class MeleeWeapon extends Weapon {
  attack(from, to){
    const prayerBonus = 1;
    const styleBonus = 3;
    const voidBonus = 1;
    const gearBonus = 1;

    const strengthLevel = Math.floor((Math.floor(from.currentStats.strength * prayerBonus) + styleBonus + 8) * voidBonus);

    const maxHit = Math.floor(Math.floor((strengthLevel * (from.bonuses.other.meleeStrength + 64) + 320) / 640) * gearBonus)

    const attackLevel = Math.floor((Math.floor(from.currentStats.attack * prayerBonus) + styleBonus + 8) * voidBonus);

    // todo: Take weapon style into account
    const attackRoll = Math.floor((attackLevel + (from.bonuses.attack.slash + 64)) * gearBonus)
    
    let defenceRoll = 0;
    if (to.isMob()) {
      defenceRoll = (to.currentStats.defence + 9) * (to.bonuses.defence.slash + 64);
    }else{
      const defenceLevel = (Math.floor(from.currentStats.defence * prayerBonus) + styleBonus + 8);

      defenceRoll = defenceLevel * (to.bonuses.defence.slash + 64);
    }
    
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

    to.addProjectile(new Projectile(damage, from, to, 'melee'));

  }
}

