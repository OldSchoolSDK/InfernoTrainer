import { TorvaFullhelm, AmuletOfTorture, InfernalCape, DragonArrows, TorvaPlatebody, TorvaPlatelegs, PrimordialBoots, FerociousGloves, UltorRing, AvernicDefender, SuperCombatPotion, UnitOptions } from "@supalosa/oldschool-trainer-sdk";
import { SaradominBrew, SuperRestore } from "@supalosa/oldschool-trainer-sdk";
import { ScytheOfVitur, BladeOfSaeldor, Player } from "@supalosa/oldschool-trainer-sdk";

export class ColosseumLoadout {
  loadoutType: string;

  constructor(loadoutType: string) {
    this.loadoutType = loadoutType;
  }

  loadoutMaxMelee() {
    return {
      equipment: {
        weapon: new ScytheOfVitur(),
        offhand: null,
        helmet: new TorvaFullhelm(),
        necklace: new AmuletOfTorture(),
        cape: new InfernalCape(),
        ammo: new DragonArrows(),
        chest: new TorvaPlatebody(),
        legs: new TorvaPlatelegs(),
        feet: new PrimordialBoots(),
        gloves: new FerociousGloves(),
        ring: new UltorRing(),
      },
      inventory: [
        new BladeOfSaeldor(),
        new AvernicDefender(),
        null,
        null,
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperCombatPotion(),
        new SuperCombatPotion(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        null,
        null,
        null,
        null,
      ],
    };
  }

  setStats(player: Player) {
    player.stats.prayer = 99;
    player.currentStats.prayer = 99;
    player.stats.defence = 99;
    player.currentStats.defence = 99;
  }

  getLoadout(): UnitOptions {
    let loadout: UnitOptions;
    switch (this.loadoutType) {
      case "max_melee":
        loadout = this.loadoutMaxMelee();
        break;
    }
    return loadout;
  }
}
