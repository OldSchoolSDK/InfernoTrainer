import { JusticiarFaceguard } from "../equipment/JusticiarFaceguard"
import { JusticiarChestguard } from "../equipment/JusticiarChestguard"
import { JusticiarLegguards } from "../equipment/JusticiarLegguards"
import { Equipment } from "../../sdk/Equipment"
import { SetEffect, SetEffectTypes } from "../../sdk/SetEffect"

export class JusticiarSetEffect extends SetEffect {
  static effectName(): string {
    return SetEffectTypes.JUSTICIAR;
  }
  static itemsInSet(): string[] {
    return [
      "Justiciar Faceguard",
      "Justiciar Chestguard",
      "Justiciar Legguards"
    ]
  }
}