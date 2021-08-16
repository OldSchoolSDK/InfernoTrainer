import { Unit, UnitEquipment, UnitOptions } from "../../../sdk/Unit";

import { JusticiarFaceguard } from '../../equipment/JusticiarFaceguard';
import { NecklaceOfAnguish } from '../../equipment/NecklaceOfAnguish';
import { ArmadylChestplate } from '../../equipment/ArmadylChestplate';
import { ArmadylChainskirt } from '../../equipment/ArmadylChainskirt';
import { PegasianBoots } from '../../equipment/PegasianBoots';
import { AvasAssembler } from '../../equipment/AvasAssembler';
import { AvasAccumulator } from '../../equipment/AvasAccumulator';
import { HolyBlessing } from '../../equipment/HolyBlessing';
import { OccultNecklace } from '../../equipment/OccultNecklace';
import { BarrowsGloves } from '../../equipment/BarrowsGloves';
import { RingOfSufferingImbued } from '../../equipment/RingOfSufferingImbued';
import { SlayerHelmet } from '../../equipment/SlayerHelmet';
import { CrystalHelm } from '../../equipment/CrystalHelm';
import { CrystalBody } from '../../equipment/CrystalBody';
import { CrystalLegs } from '../../equipment/CrystalLegs';
import { CrystalShield } from '../../equipment/CrystalShield';
import { BowOfFaerdhinen } from '../../weapons/BowOfFaerdhinen';
import { JusticiarChestguard } from '../../equipment/JusticiarChestguard'
import { JusticiarLegguards } from '../../equipment/JusticiarLegguards'
import { KodaiWand } from '../../weapons/KodaiWand'
import { DragonArrows } from '../../equipment/DragonArrows'
import { RobinhoodHat } from '../../equipment/RobinHoodHat'
import { GuthixRobetop } from '../../equipment/GuthixRobeTop'
import { RangerBoots } from '../../equipment/RangerBoots'
import { RuneKiteshield } from '../../equipment/RuneKiteshield'
import { DagonhaiRobeTop } from '../../equipment/DagonhaiRobeTop'
import { SaradominBody } from '../../equipment/SaradominBody'
import { SaradominChaps } from '../../equipment/SaradominChaps'
import { SaradominCoif } from '../../equipment/SaradominCoif'
import { SaradominDhideBoots } from '../../equipment/SaradominDhideBoots'
import { MagesBook } from '../../equipment/MagesBook'
import { BlackDhideChaps } from '../../equipment/BlackDhideChaps'
import { BlackDhideVambraces } from '../../equipment/BlackDhideVambraces'
import { AncestralRobetop } from '../../equipment/AncestralRobetop'
import { AncestralRobebottom } from '../../equipment/AncestralRobebottom'
import { StaminaPotion } from '../../items/StaminaPotion'
import { SaradominBrew } from '../../items/SaradominBrew'
import { SuperRestore } from '../../items/SuperRestore'
import { BastionPotion } from '../../items/BastionPotion'

import { TwistedBow } from '../../weapons/TwistedBow'
import { Blowpipe } from '../../weapons/Blowpipe'
import { Weapon } from "../../../sdk/gear/Weapon";
import { Offhand } from "../../../sdk/gear/Offhand";
import { Necklace } from "../../../sdk/gear/Necklace";
import { ItemName } from "../../../sdk/ItemName";
import { Item } from "../../../sdk/Item";
import { filter, indexOf, map } from "lodash";
import { Chest } from "../../../sdk/gear/Chest";
import { Legs } from "../../../sdk/gear/Legs";
import { Player } from "../../../sdk/Player";

export class InfernoLoadout {

  wave: number;
  loadoutType: string;
  onTask: boolean;

  constructor(wave: number, loadoutType: string, onTask: boolean) {
    this.wave = wave;
    this.loadoutType = loadoutType;
    this.onTask = onTask;
  }


  loadoutMaxTbow() {
    return { 
      equipment: { 
        weapon: new KodaiWand(),
        offhand: new CrystalShield(),
        helmet: new JusticiarFaceguard(),
        necklace: new OccultNecklace(),
        cape: new AvasAssembler(),
        ammo: new DragonArrows(),
        chest: new AncestralRobetop(),
        legs: new AncestralRobebottom(),
        feet: new PegasianBoots(),
        gloves: new BarrowsGloves(),
        ring: new RingOfSufferingImbued(), 
      },
      inventory: [ 
        new Blowpipe(), new ArmadylChestplate(), new TwistedBow(), new JusticiarChestguard(),
        new NecklaceOfAnguish(), new ArmadylChainskirt(), null, new JusticiarLegguards(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
        new BastionPotion(), new StaminaPotion(), new SuperRestore(), new SuperRestore(), 
      ]
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
        new Blowpipe(), new CrystalBody(), new BowOfFaerdhinen(), new JusticiarChestguard(),
        new NecklaceOfAnguish(), new CrystalLegs(), null, new JusticiarLegguards(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
        new BastionPotion(), new StaminaPotion(), new SuperRestore(), new SuperRestore(), 
      ]
    };
  }

  // loadoutBudgetFbow() {

  // }

  // loadoutRcb() {

  // }

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
        new Blowpipe(), new TwistedBow(), null, null,
        new NecklaceOfAnguish(), new SaradominBody(), null, null,
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
        new BastionPotion(), new StaminaPotion(), new SuperRestore(), new SuperRestore(), 
      ]
    };
  }

  loadoutPure() {

    return { 
      equipment: { 
        weapon: new KodaiWand(),
        offhand: new MagesBook(),
        helmet: new RobinhoodHat(),
        necklace: new OccultNecklace(),
        cape: new AvasAccumulator(),
        ammo: new DragonArrows(),
        chest: new GuthixRobetop(),
        legs: new BlackDhideChaps(),
        feet: new RangerBoots(),
        gloves: new BlackDhideVambraces(),
        ring: new RingOfSufferingImbued(), 
      },
      inventory: [ 
        new Blowpipe(), new TwistedBow(), null, null,
        new NecklaceOfAnguish(), null, null, null,
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
        new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
        new BastionPotion(), new StaminaPotion(), new SuperRestore(), new SuperRestore(), 
        new BastionPotion(), new StaminaPotion(), new SuperRestore(), new SuperRestore(), 
      ]
    };
  }

  findItemByName(list: Item[], name: ItemName) {
    return indexOf(map(list, 'itemName'), name)
  }

  findAnyItemWithName(list: Item[], names: ItemName[]) {
    return filter(names.map((name: ItemName) => {
      return this.findItemByName(list, name);
    }), (index: number) => index !== -1)[0] || -1;
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
    }


    if (this.wave > 66) {

      // switch necklace to range dps necklace
      loadout.inventory[this.findItemByName(loadout.inventory, ItemName.NECKLACE_OF_ANGUISH)] = new OccultNecklace();
      loadout.equipment.necklace = new NecklaceOfAnguish();


      // Swap out staff with zuk/jad dps weapon
      const staff = loadout.equipment.weapon;
      const bow = this.findAnyItemWithName(loadout.inventory, [ItemName.TWISTED_BOW, ItemName.BOWFA])
      loadout.equipment.weapon = loadout.inventory[bow] as Weapon;
      loadout.inventory[bow] = staff;
      if (loadout.equipment.offhand && loadout.equipment.weapon.isTwoHander) {
        loadout.inventory[loadout.inventory.indexOf(null)] = loadout.equipment.offhand;
        loadout.equipment.offhand = null;
      }


      // Swap out chest
      const mageChest = loadout.equipment.chest;
      const rangeChest = this.findAnyItemWithName(loadout.inventory, [ItemName.ARMADYL_CHESTPLATE, ItemName.SARADOMIN_D_HIDE_BODY, ItemName.CRYSTAL_BODY])
      if (rangeChest !== -1){
        loadout.equipment.chest = loadout.inventory[rangeChest] as Chest;
        loadout.inventory[rangeChest] = mageChest;
      }

      // Swap out body
      const mageLegs = loadout.equipment.legs;
      const rangeLegs = this.findAnyItemWithName(loadout.inventory, [ItemName.ARMADYL_CHAINSKIRT, ItemName.SARADOMIN_D_HIDE_CHAPS, ItemName.CRYSTAL_LEGS])
      if (rangeLegs !== -1){
        loadout.equipment.legs = loadout.inventory[rangeLegs] as Legs;
        loadout.inventory[rangeLegs] = mageLegs;
      }

    }

    if (this.onTask && this.loadoutType !== 'pure') {
      loadout.equipment.helmet = new SlayerHelmet();
    }

    return loadout;
  }
  
}

function pluck(): import("lodash").List<unknown> {
  throw new Error("Function not implemented.");
}
