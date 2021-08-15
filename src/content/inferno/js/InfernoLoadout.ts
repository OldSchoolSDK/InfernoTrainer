import { UnitOptions } from "../../../sdk/Unit";

import { JusticiarFaceguard } from '../../equipment/JusticiarFaceguard';
import { NecklaceOfAnguish } from '../../equipment/NecklaceOfAnguish';
import { ArmadylChestplate } from '../../equipment/ArmadylChestplate';
import { ArmadylChainskirt } from '../../equipment/ArmadylChainskirt';
import { PegasianBoots } from '../../equipment/PegasianBoots';
import { AvasAssembler } from '../../equipment/AvasAssembler';
import { HolyBlessing } from '../../equipment/HolyBlessing';
import { BarrowsGloves } from '../../equipment/BarrowsGloves';
import { RingOfSufferingImbued } from '../../equipment/RingOfSufferingImbued';
import { RingOfEndurance } from '../../equipment/RingOfEndurance';
import { CrystalShield } from '../../equipment/CrystalShield';
import { JusticiarChestguard } from '../../equipment/JusticiarChestguard'
import { JusticiarLegguards } from '../../equipment/JusticiarLegguards'
import { KodaiWand } from '../../weapons/KodaiWand'
import { DevoutBoots } from '../../equipment/DevoutBoots'
import { AncestralRobetop } from '../../equipment/AncestralRobetop'
import { AncestralRobebottom } from '../../equipment/AncestralRobebottom'
import { StaminaPotion } from '../../items/StaminaPotion'
import { SaradominBrew } from '../../items/SaradominBrew'
import { SuperRestore } from '../../items/SuperRestore'
import { BastionPotion } from '../../items/BastionPotion'

import { TwistedBow } from '../../weapons/TwistedBow'
import { Blowpipe } from '../../weapons/Blowpipe'

export class InfernoLoadout {

  constructor(wave: number, loadoutType: string) {

  }

  getLoadout(): UnitOptions {
    return { equipment: { 
      weapon: new KodaiWand(),
      offhand: new CrystalShield(),
      helmet: new JusticiarFaceguard(),
      necklace: new NecklaceOfAnguish(),
      cape: new AvasAssembler(),
      ammo: new HolyBlessing(),
      chest: new AncestralRobetop(),
      legs: new ArmadylChainskirt(),
      feet: new PegasianBoots(),
      gloves: new BarrowsGloves(),
      ring: new RingOfSufferingImbued(), 
    },
    inventory: [ 
      new Blowpipe(), new ArmadylChestplate(), new TwistedBow(), new JusticiarChestguard(),
      null, new AncestralRobebottom(), null, new JusticiarLegguards(),
      new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
      new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(),
      new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
      new SaradominBrew(), new SaradominBrew(), new SuperRestore(), new SuperRestore(), 
      new BastionPotion(), new StaminaPotion(), new SuperRestore(), new SuperRestore(), 
    ]
  }
  }
  
}