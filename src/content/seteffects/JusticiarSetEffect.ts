import { JusticiarFaceguard } from "../equipment/JusticiarFaceguard"
import { JusticiarChestguard } from "../equipment/JusticiarChestguard"
import { JusticiarLegguards } from "../equipment/JusticiarLegguards"
import { Equipment } from "../../sdk/Equipment"
import { SetEffect, SetEffectTypes } from "../../sdk/SetEffect"
import { ItemNames } from "../../sdk/ItemNames"

export class JusticiarSetEffect extends SetEffect {
  static effectName(): string {
    return SetEffectTypes.JUSTICIAR;
  }
  static itemsInSet(): ItemNames[] {
    return [
      ItemNames.JUSTICIAR_FACEGUARD,
      ItemNames.JUSTICIAR_CHESTGUARD,
      ItemNames.JUSTICIAR_LEGGUARDS
    ]
  }
}