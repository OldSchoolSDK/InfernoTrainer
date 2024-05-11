import {
  ScytheOfVitur,
  TorvaFullhelm,
  OccultNecklace,
  InfernalCape,
  DragonArrows,
  TorvaPlatebody,
  TorvaPlatelegs,
  PrimordialBoots,
  ZaryteVambraces,
  RingOfSufferingImbued,
  TwistedBow,
  MasoriBodyF,
  DizanasQuiver,
  PegasianBoots,
  NecklaceOfAnguish,
  MasoriChapsF,
  MasoriMaskF,
  SaradominBrew,
  SuperRestore,
  BastionPotion,
  StaminaPotion,
  BlackChinchompa,
  Blowpipe,
  BrowserUtils,
  KodaiWand,
  CrystalShield,
  AncestralRobetop,
  AncestralRobebottom,
  JusticiarChestguard,
  JusticiarLegguards,
  CrystalHelm,
  AvasAssembler,
  HolyBlessing,
  BarrowsGloves,
  CrystalBody,
  BowOfFaerdhinen,
  CrystalLegs,
  AncientStaff,
  SaradominCoif,
  RubyBoltsE,
  AhrimsRobetop,
  AhrimsRobeskirt,
  RuneCrossbow,
  DiamondBoltsE,
  JusticiarFaceguard,
  SaradominBody,
  SaradominChaps,
  RuneKiteshield,
  DagonhaiRobeTop,
  RangerBoots,
  MagesBook,
  AvasAccumulator,
  BlackDhideChaps,
  BlackDhideVambraces,
  Item,
  ItemName,
  Player,
  UnitOptions,
  Weapon,
  Chest,
  Legs,
  SlayerHelmet,
  RobinHoodHat,
  GuthixRobeTop,
} from "@supalosa/oldschool-trainer-sdk";
import { filter, indexOf, map } from "lodash";

export class InfernoLoadout {
  wave: number;
  loadoutType: string;
  onTask: boolean;

  constructor(wave: number, loadoutType: string, onTask: boolean) {
    this.wave = wave;
    this.loadoutType = loadoutType;
    this.onTask = onTask;
  }

  loadoutMaxMelee() {
    return {
      equipment: {
        weapon: new ScytheOfVitur(),
        offhand: null,
        helmet: new TorvaFullhelm(),
        necklace: new OccultNecklace(), // TODO
        cape: new InfernalCape(),
        ammo: new DragonArrows(),
        chest: new TorvaPlatebody(),
        legs: new TorvaPlatelegs(),
        feet: new PrimordialBoots(),
        gloves: new ZaryteVambraces(), // TODO
        ring: new RingOfSufferingImbued(), // TODO
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
  }

  loadoutMaxTbowSpeedrunner() {
    return {
      ...this.loadoutMaxTbow(),
      inventory: [
        new BlackChinchompa(),
        new Blowpipe(),
        new MasoriBodyF(),
        new TwistedBow(!!BrowserUtils.getQueryVar("geno")),
        new BastionPotion(),
        new NecklaceOfAnguish(),
        new MasoriChapsF(),
        null,
        new BastionPotion(),
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
        new BastionPotion(),
      ],
    };
  }

  loadoutMaxTbow() {
    return {
      equipment: {
        weapon: new KodaiWand(),
        offhand: new CrystalShield(),
        helmet: new MasoriMaskF(),
        necklace: new OccultNecklace(),
        cape: new DizanasQuiver(),
        ammo: new DragonArrows(),
        chest: new AncestralRobetop(),
        legs: new AncestralRobebottom(),
        feet: new PegasianBoots(),
        gloves: new ZaryteVambraces(),
        ring: new RingOfSufferingImbued(),
      },
      inventory: [
        new Blowpipe(),
        new MasoriBodyF(),
        new TwistedBow(),
        new JusticiarChestguard(),
        new NecklaceOfAnguish(),
        new MasoriChapsF(),
        null,
        new JusticiarLegguards(),
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
  }

  loadoutMaxFbow() {
    return {
      equipment: {
        weapon: new KodaiWand(),
        offhand: new CrystalShield(),
        helmet: new CrystalHelm(),
        necklace: new OccultNecklace(),
        cape: new AvasAssembler(),
        ammo: new HolyBlessing(),
        chest: new AncestralRobetop(),
        legs: new AncestralRobebottom(),
        feet: new PegasianBoots(),
        gloves: new BarrowsGloves(),
        ring: new RingOfSufferingImbued(),
      },
      inventory: [
        new Blowpipe(),
        new CrystalBody(),
        new BowOfFaerdhinen(),
        new JusticiarChestguard(),
        new NecklaceOfAnguish(),
        new CrystalLegs(),
        null,
        new JusticiarLegguards(),
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
  }

  // loadoutBudgetFbow() {

  // }

  loadoutRcb() {
    return {
      equipment: {
        weapon: new AncientStaff(),
        offhand: new CrystalShield(),
        helmet: new SaradominCoif(),
        necklace: new OccultNecklace(),
        cape: new AvasAssembler(),
        ammo: new RubyBoltsE(),
        chest: new AhrimsRobetop(),
        legs: new AhrimsRobeskirt(),
        feet: new PegasianBoots(),
        gloves: new BarrowsGloves(),
        ring: new RingOfSufferingImbued(),
      },
      inventory: [
        new Blowpipe(),
        new RuneCrossbow(),
        new DiamondBoltsE(),
        new JusticiarFaceguard(),
        new NecklaceOfAnguish(),
        new SaradominBody(),
        new SaradominChaps(),
        new JusticiarChestguard(),
        null,
        new SaradominBrew(),
        new SuperRestore(),
        new JusticiarLegguards(),
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
        new BastionPotion(),
        new StaminaPotion(),
        new SuperRestore(),
        new SuperRestore(),
      ],
    };
  }

  loadoutZerker() {
    return {
      equipment: {
        weapon: new KodaiWand(),
        offhand: new RuneKiteshield(),
        helmet: new SaradominCoif(),
        necklace: new OccultNecklace(),
        cape: new AvasAssembler(),
        ammo: new DragonArrows(),
        chest: new DagonhaiRobeTop(),
        legs: new SaradominChaps(),
        feet: new RangerBoots(),
        gloves: new BarrowsGloves(),
        ring: new RingOfSufferingImbued(),
      },
      inventory: [
        new Blowpipe(),
        new TwistedBow(),
        null,
        null,
        new NecklaceOfAnguish(),
        new SaradominBody(),
        null,
        null,
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
  }

  loadoutPure() {
    return {
      equipment: {
        weapon: new KodaiWand(),
        offhand: new MagesBook(),
        helmet: new RobinHoodHat(),
        necklace: new OccultNecklace(),
        cape: new AvasAccumulator(),
        ammo: new DragonArrows(),
        chest: new GuthixRobeTop(),
        legs: new BlackDhideChaps(),
        feet: new RangerBoots(),
        gloves: new BlackDhideVambraces(),
        ring: new RingOfSufferingImbued(),
      },
      inventory: [
        new Blowpipe(),
        new TwistedBow(),
        null,
        null,
        new NecklaceOfAnguish(),
        null,
        null,
        null,
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
        new BastionPotion(),
        new StaminaPotion(),
        new SuperRestore(),
        new SuperRestore(),
      ],
    };
  }

  findItemByName(list: Item[], name: ItemName) {
    return indexOf(map(list, "itemName"), name);
  }

  findAnyItemWithName(list: Item[], names: ItemName[]) {
    return (
      filter(
        names.map((name: ItemName) => {
          return this.findItemByName(list, name);
        }),
        (index: number) => index !== -1,
      )[0] || -1
    );
  }

  setStats(player: Player) {
    player.stats.prayer = 99;
    player.currentStats.prayer = 99;
    player.stats.defence = 99;
    player.currentStats.defence = 99;
    switch (this.loadoutType) {
      case "zerker":
        player.stats.prayer = 52;
        player.currentStats.prayer = 52;
        player.stats.defence = 45;
        player.currentStats.defence = 45;
        break;
      case "pure":
        player.stats.prayer = 52;
        player.currentStats.prayer = 52;
        player.stats.defence = 1;
        player.currentStats.defence = 1;
        break;
    }
  }

  getLoadout(): UnitOptions {
    let loadout: UnitOptions;
    switch (this.loadoutType) {
      case "max_tbow_speed":
        loadout = this.loadoutMaxTbowSpeedrunner();
        break;
      case "max_tbow":
        loadout = this.loadoutMaxTbow();
        break;
      case "max_fbow":
        loadout = this.loadoutMaxFbow();
        break;
      case "zerker":
        loadout = this.loadoutZerker();
        break;
      case "pure":
        loadout = this.loadoutPure();
        break;
      case "rcb":
        loadout = this.loadoutRcb();
        break;
      case "max_melee":
        loadout = this.loadoutMaxMelee();
        break;
    }

    if (this.wave > 66 && this.wave <= 69) {
      // switch necklace to range dps necklace
      loadout.inventory[this.findItemByName(loadout.inventory, ItemName.NECKLACE_OF_ANGUISH)] = new OccultNecklace();
      loadout.equipment.necklace = new NecklaceOfAnguish();

      // Swap out staff with zuk/jad dps weapon
      const staff = loadout.equipment.weapon;
      const bow = this.findAnyItemWithName(loadout.inventory, [
        ItemName.TWISTED_BOW,
        ItemName.BOWFA,
        ItemName.RUNE_CROSSBOW,
      ]);
      loadout.equipment.weapon = loadout.inventory[bow] as Weapon;
      loadout.inventory[bow] = staff;
      if (loadout.equipment.offhand && loadout.equipment.weapon.isTwoHander) {
        loadout.inventory[loadout.inventory.indexOf(null)] = loadout.equipment.offhand;
        loadout.equipment.offhand = null;
      }

      // Swap out chest
      const mageChest = loadout.equipment.chest;
      const rangeChest = this.findAnyItemWithName(loadout.inventory, [
        ItemName.MASORI_BODY_F,
        ItemName.ARMADYL_CHESTPLATE,
        ItemName.SARADOMIN_D_HIDE_BODY,
        ItemName.CRYSTAL_BODY,
      ]);
      if (rangeChest !== -1) {
        loadout.equipment.chest = loadout.inventory[rangeChest] as Chest;
        loadout.inventory[rangeChest] = mageChest;
      }

      // Swap out body
      const mageLegs = loadout.equipment.legs;
      const rangeLegs = this.findAnyItemWithName(loadout.inventory, [
        ItemName.MASORI_CHAPS_F,
        ItemName.ARMADYL_CHAINSKIRT,
        ItemName.SARADOMIN_D_HIDE_CHAPS,
        ItemName.CRYSTAL_LEGS,
      ]);
      if (rangeLegs !== -1) {
        loadout.equipment.legs = loadout.inventory[rangeLegs] as Legs;
        loadout.inventory[rangeLegs] = mageLegs;
      }
    }

    if (this.onTask && this.loadoutType !== "pure") {
      loadout.equipment.helmet = new SlayerHelmet();
    }

    return loadout;
  }
}
