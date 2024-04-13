import { SetEffect, SetEffectTypes } from "../../sdk/SetEffect";
import { ItemName } from "../../sdk/ItemName";

export class JusticiarSetEffect extends SetEffect {
  static effectName(): string {
    return SetEffectTypes.JUSTICIAR;
  }
  static itemsInSet(): ItemName[] {
    return [ItemName.JUSTICIAR_FACEGUARD, ItemName.JUSTICIAR_CHESTGUARD, ItemName.JUSTICIAR_LEGGUARDS];
  }
}
