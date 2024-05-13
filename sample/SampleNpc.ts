import { Assets, BasicModel, GLTFModel, MeleeWeapon, Mob } from "../src";

export class SampleNpc extends Mob {
  override mobName() {
    return "Sample NPC";
  }

  override get combatLevel() {
    return 200;
  }

  override setStats() {
    this.weapons = {
      slash: new MeleeWeapon(),
    };

    this.stats = {
      attack: 50,
      strength: 50,
      defence: 50,
      range: 50,
      magic: 50,
      hitpoint: 500,
    };
    this.currentStats = JSON.parse(JSON.stringify(this.stats));
  }

  override get bonuses() {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      defence: {
        stab: 65,
        slash: 65,
        crush: 65,
        magic: 30,
        range: 5,
      },
      other: {
        meleeStrength: 40,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0,
      },
    };
  }

  override get attackSpeed() {
    return 4;
  }
  
  attackStyleForNewAttack() {
    return "slash";
  }

  get attackRange() {
    return 1;
  }

  get size() {
    return 4;
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, Assets.getAssetUrl("models/verzik.glb"));
  }
}
