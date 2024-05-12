import {
  AmuletOfTorture,
  BastionPotion,
  CardinalDirection,
  DizanasQuiver,
  DragonArrows,
  FerociousGloves,
  InfernalCape,
  MasoriBodyF,
  MasoriChapsF,
  MasoriMaskF,
  NecklaceOfAnguish,
  PegasianBoots,
  Player,
  PrimordialBoots,
  Region,
  SaradominBrew,
  ScytheOfVitur,
  StaminaPotion,
  SuperRestore,
  TorvaFullhelm,
  TorvaPlatebody,
  TorvaPlatelegs,
  TwistedBow,
  UltorRing,
} from "../src";
import { SampleNpc } from "./SampleNpc";

export class SampleRegion extends Region {
  get initialFacing() {
    return CardinalDirection.NORTH;
  }

  getName() {
    return "Sample";
  }

  get width(): number {
    return 51;
  }

  get height(): number {
    return 57;
  }

  initialiseRegion(): { player: Player } {
    const player = new Player(this, {
      x: 25,
      y: 25,
    });
    this.addPlayer(player);
    const loadout = {
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
        new TwistedBow(),
        new MasoriBodyF(),
        new DizanasQuiver(),
        new PegasianBoots(),
        new NecklaceOfAnguish(),
        new MasoriChapsF(),
        new MasoriMaskF(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new BastionPotion(),
        new StaminaPotion(),
        new SuperRestore(),
        new SuperRestore(),
      ],
    };
    player.setUnitOptions(loadout);

    this.addMob(new SampleNpc(this, { x: 25, y: 20 }, {}));
    return { player };
  }
}
