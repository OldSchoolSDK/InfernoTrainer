import { Mob } from "../Mob";
import { MeleeWeapon } from "../weapons/MeleeWeapon";
import { RangedWeapon } from "../weapons/RangedWeapon";

// this is a JalXil in all but name, from the old test
export class TestNpc extends Mob {
    constructor(region, location, options) {
      super(region, location, options);
    }
  
    override setStats() {
      this.stunned = 1;
      this.weapons = {
        crush: new MeleeWeapon(),
        range: new RangedWeapon(),
      };
  
      // non boosted numbers
      this.stats = {
        attack: 140,
        strength: 180,
        defence: 60,
        range: 250,
        magic: 90,
        hitpoint: 125,
      };
  
      // with boosts
      this.currentStats = JSON.parse(JSON.stringify(this.stats));
    }
  
    override get bonuses() {
      return {
        attack: {
          stab: 0,
          slash: 0,
          crush: 0,
          magic: 0,
          range: 40,
        },
        defence: {
          stab: 0,
          slash: 0,
          crush: 0,
          magic: 0,
          range: 0,
        },
        other: {
          meleeStrength: 0,
          rangedStrength: 50,
          magicDamage: 0,
          prayer: 0,
        },
      };
    }
  
    override get attackSpeed() {
      return 4;
    }
  
    override get attackRange() {
      return 15;
    }
  
    override get size() {
      return 3;
    }
  
    override attackStyleForNewAttack() {
      return "range";
    }
  
    override canMeleeIfClose() {
      return "crush" as const;
    }
  }