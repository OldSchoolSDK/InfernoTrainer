import { JusticiarFaceguard } from "../equipment/JusticiarFaceguard"
import { JusticiarChestguard } from "../equipment/JusticiarChestguard"
import { JusticiarLegguards } from "../equipment/JusticiarLegguards"
import { Equipment } from "../../sdk/Equipment"
import { SetEffect } from "../../sdk/SetEffect"

export class JusticiarSetEffect extends SetEffect {
  static itemsInSet(): Equipment[] {
    return [
      new JusticiarFaceguard(),
      new JusticiarChestguard(),
      new JusticiarLegguards()
    ]
  }
}