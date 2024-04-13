import { RangedWeapon } from "./RangedWeapon";

// A Range weapon that can hit any unit in the radius, without requiring direct LOS of the target.
// Example: Dinh's Bulwark, Verzik auto attacks.
export class AoeRangedWeapon extends RangedWeapon {
  get isAreaAttack() {
    return true;
  }
}
