'use strict'

import ScytheInventImage from '../../assets/images/weapons/scytheOfVitur.png'
import { World } from '../../sdk/World'
import { Unit } from '../../sdk/Unit'
import { MeleeWeapon } from '../../sdk/weapons/MeleeWeapon'
import { AttackBonuses } from '../../sdk/gear/Weapon'

export class ScytheOfVitur extends MeleeWeapon {

  constructor() {
    super();
    this.bonuses = {
      attack: {
        stab: 70,
        slash: 110,
        crush: 30,
        magic: -6,
        range: 0
      },
      defence: {
        stab: -2,
        slash: 8,
        crush: 10,
        magic: 0,
        range: 0
      },
      other: {
        meleeStrength: 75,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0
      },
      targetSpecific: {
        undead: 0,
        slayer: 0
      }
    };
  }


  get isTwoHander(): boolean {
    return true;
  }
  
  get attackRange () {
    return 1
  }

  get attackSpeed () {
    return 5
  }

  get inventoryImage () {
    return ScytheInventImage
  }
  get itemName(): string {
    return "Scythe of Vitur"
  }
  

  // Scythe attacks in a 1x3 arc in front of the player.
  // TODO: Refactor/change method so that it can actually hit multiple targets.
  attack (world: World, from: Unit, to: Unit, bonuses: AttackBonuses = {}) {
    // As there is no concept of player direction yet, we dynamically calculate this based on the relative location of
    // the attacker.
    // Find the closest tile on the npc to us.
    const targetTile = to.getClosestTileTo(from.location.x, from.location.y)
    const extraHitLocations = [
      [[-1, -1], [1, -1]], // North
      [[1, 1], [1, -1]], // East
      [[-1, 1], [1, 1]], // South
      [[-1, 1], [-1, -1]] // West
    ]
    const dx = from.location.x - targetTile[0]
    const dy = from.location.y - targetTile[1]
    let direction
    if (dx < 0) {
      direction = 1 // East
    } else if (dx > 0) {
      direction = 3 // West
    } else if (dy < 0) {
      direction = 2 // South
    } else {
      direction = 0 // North
    }
    // Full damage attack, but each subsequent hit does half of the last.
    super.attack(world, from, to, bonuses)
    extraHitLocations[direction].forEach(hit => {
      if (to.isOnTile(from.location.x + hit[0], from.location.y + hit[1])) {
        const extraHitBonuses = {
          overallMultiplier: 0.5
        }
        super.attack(world, from, to, extraHitBonuses)
      }
    })
  }
}
