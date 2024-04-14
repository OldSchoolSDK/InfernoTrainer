import { Unit, UnitTypes } from "../Unit";
import { XpDrop } from "../XpDrop";
import { ProjectileOptions } from "./Projectile";
import { AttackBonuses, Weapon } from "../gear/Weapon";
import { EquipmentTypes } from "../Equipment";

export class MagicWeapon extends Weapon {
  get type() {
    return EquipmentTypes.WEAPON;
  }

  attack(from: Unit, to: Unit, bonuses: AttackBonuses = {}, options: ProjectileOptions = {}): boolean {
    return super.attack(from, to, bonuses, options);
  }

  calculateHitDelay(distance: number) {
    return Math.floor((1 + distance) / 3) + 1;
  }

  grantXp(from: Unit) {
    if (from.type === UnitTypes.PLAYER && this.damage > 0) {
      from.grantXp(new XpDrop("hitpoint", this.damage * 1.33));
      from.grantXp(new XpDrop("magic", this.damage * 2));
    }
  }

  isBlockable(from: Unit, to: Unit, bonuses: AttackBonuses) {
    this._calculatePrayerEffects(from, to, bonuses);

    if (bonuses.effectivePrayers.overhead && bonuses.effectivePrayers.overhead.feature() === "magic") {
      return true;
    }
    return false;
  }

  _calculatePrayerEffects(from: Unit, to: Unit, bonuses: AttackBonuses) {
    bonuses.effectivePrayers = {};
    if (from.type !== UnitTypes.MOB && from.prayerController) {
      const offensiveMagic = from.prayerController.matchFeature("offensiveMagic");
      if (offensiveMagic) {
        bonuses.effectivePrayers.magic = offensiveMagic;
      }
      const defence = from.prayerController.matchFeature("defence");
      if (defence) {
        bonuses.effectivePrayers.defence = defence;
      }
    }
    if (to.type !== UnitTypes.MOB && to.prayerController) {
      const overhead = to.prayerController.overhead();
      if (overhead) {
        bonuses.effectivePrayers.overhead = overhead;
      }
    }
  }

  _magicLevel(from: Unit, to: Unit, bonuses: AttackBonuses) {
    let prayerMultiplier = 1;
    const magicPrayer = bonuses.effectivePrayers.magic;

    if (magicPrayer) {
      if (magicPrayer.name === "Mystic Will") {
        prayerMultiplier = 1.05;
      } else if (magicPrayer.name === "Mystic Lore") {
        prayerMultiplier = 1.1;
      } else if (magicPrayer.name === "Mystic Might") {
        prayerMultiplier = 1.15;
      } else if (magicPrayer.name === "Augury") {
        prayerMultiplier = 1.2;
      }
    }
    return Math.floor(
      Math.floor(from.currentStats.magic * prayerMultiplier) * bonuses.voidMultiplier +
        (bonuses.isAccurate ? 2 : 0) +
        9,
    );
  }

  _equipmentBonus(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return from.bonuses.attack.magic;
  }

  _magicDamageBonusMultiplier(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return from.bonuses.other.magicDamage;
  }

  _attackRoll(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return Math.floor(
      this._magicLevel(from, to, bonuses) * (this._equipmentBonus(from, to, bonuses) + 64) * bonuses.gearMageMultiplier,
    );
  }

  _defenceRoll(from: Unit, to: Unit, bonuses: AttackBonuses) {
    let prayerMultiplier = 1;
    const defencePrayer = bonuses.effectivePrayers.defence;

    if (defencePrayer) {
      if (defencePrayer.name === "Thick Skin") {
        prayerMultiplier = 1.05;
      } else if (defencePrayer.name === "Mystic Will") {
        prayerMultiplier = 1.05;
      } else if (defencePrayer.name === "Rock Skin") {
        prayerMultiplier = 1.1;
      } else if (defencePrayer.name === "Mystic Lore") {
        prayerMultiplier = 1.1;
      } else if (defencePrayer.name === "Steel Skin") {
        prayerMultiplier = 1.15;
      } else if (defencePrayer.name === "Mystic Might") {
        prayerMultiplier = 1.15;
      } else if (defencePrayer.name === "Chivalry") {
        prayerMultiplier = 1.2;
      } else if (defencePrayer.name === "Piety") {
        prayerMultiplier = 1.25;
      } else if (defencePrayer.name === "Rigour") {
        prayerMultiplier = 1.25;
      } else if (defencePrayer.name === "Augury") {
        prayerMultiplier = 1.25;
      }
    }

    return (9 + to.currentStats.magic * prayerMultiplier) * (to.bonuses.defence.magic + 64);
  }

  _maxHit(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return Math.floor(this._baseSpellDamage(from, to, bonuses) * this._magicDamageBonusMultiplier(from, to, bonuses));
    // TODO: Most of this isn't implemented
    // Spell Base damage +3 if casting bolt spells with chaos gauntlets
    // Answer * (1 + magic damage bonus)
    // Round the answer down to the nearest integer
    // Answer * salve amulet bonus (Salve bonus does not stack with slayer bonus, skip to step 7 if using salve amulet)
    // Round the answer down to the nearest integer
    // Answer * slayer bonus
    // Round the answer down to the nearest integer
    // Answer * Tome of fire bonus
    // Round the answer down to the nearest integer
    // Answer * castle wars bonus
    // Round the answer down to the nearest integer
    // That is the max hit
  }

  _baseSpellDamage(from: Unit, to: Unit, bonuses: AttackBonuses) {
    return bonuses.magicBaseSpellDamage; // Jal-Zek specific number for now.
  }
}
