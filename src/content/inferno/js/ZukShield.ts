import { Assets, Mob, ImageLoader, Location, Projectile, Random, LineOfSightMask, Region, UnitOptions, UnitBonuses, DelayedAction, Unit, CollisionType, Settings, GLTFModel, EntityNames } from "@supalosa/oldschool-trainer-sdk";
import { UnitStats } from "@supalosa/oldschool-trainer-sdk/lib/src/sdk/UnitStats";

import { find } from "lodash";
import { JalXil } from "./mobs/JalXil";


const MissSplat = Assets.getAssetUrl("assets/images/hitsplats/miss.png");
const DamageSplat = Assets.getAssetUrl("assets/images/hitsplats/damage.png");

const ShieldModel = Assets.getAssetUrl("models/7707_33036.glb");

export class ZukShield extends Mob {
  incomingProjectiles: Projectile[] = [];
  missedHitsplatImage: HTMLImageElement;
  damageHitsplatImage: HTMLImageElement;
  stats: UnitStats;
  currentStats: UnitStats;

  movementDirection: boolean = Random.get() < 0.5 ? true : false;

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  constructor(region: Region, location: Location, options: UnitOptions) {
    super(region, location, options);

    this.freeze(1);
    this.missedHitsplatImage = ImageLoader.createImage(MissSplat);
    this.damageHitsplatImage = ImageLoader.createImage(DamageSplat);

    // non boosted numbers
    this.stats = {
      attack: 0,
      strength: 0,
      defence: 0,
      range: 0,
      magic: 0,
      hitpoint: 600,
    };

    // with boosts
    this.currentStats = {
      attack: 0,
      strength: 0,
      defence: 0,
      range: 0,
      magic: 0,
      hitpoint: 600,
    };
  }

  get bonuses(): UnitBonuses {
    return {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      defence: {
        stab: 0,
        slash: 0,
        crush: 0,
        magic: 0,
        range: 0,
      },
      other: {
        meleeStrength: 0,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0,
      },
      targetSpecific: {
        undead: 0,
        slayer: 0,
      },
    };
  }

  dead() {
    super.dead();
    this.dying = 3;
    DelayedAction.registerDelayedAction(
      new DelayedAction(() => {
        this.region.removeMob(this);
        const ranger = find(this.region.mobs, (mob: Mob) => {
          return mob.mobName() === EntityNames.JAL_XIL;
        }) as JalXil;
        if (ranger) {
          ranger.setAggro(this.aggro as Unit);
        }
        const mager = find(this.region.mobs, (mob: Mob) => {
          return mob.mobName() === EntityNames.JAL_ZEK;
        }) as JalXil;
        if (mager) {
          mager.setAggro(this.aggro as Unit);
        }
      }, 2),
    );
  }

  override visible() {
    // always visible, even during countdown
    return true;
  }

  get drawOutline() {
    return false;
  }

  contextActions() {
    return [];
  }
  mobName() {
    return EntityNames.INFERNO_SHIELD;
  }

  get selectable() {
    return false;
  }

  canBeAttacked() {
    return false;
  }
  movementStep() {
    this.processIncomingAttacks();

    this.perceivedLocation = { x: this.location.x, y: this.location.y };

    if (this.frozen <= 0) {
      if (this.movementDirection) {
        this.location.x++;
      } else {
        this.location.x--;
      }
      if (this.location.x < 11) {
        this.freeze(5);
        this.movementDirection = !this.movementDirection;
      }
      if (this.location.x > 35) {
        this.freeze(5);
        this.movementDirection = !this.movementDirection;
      }
    }

    if (this.currentStats.hitpoint <= 0) {
      return this.dead();
    }
  }

  drawHitsplat(projectile: Projectile): boolean {
    return projectile.attackStyle !== "typeless";
  }

  get size() {
    return 5;
  }

  get color() {
    return "#FF7300";
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  entityName() {
    return EntityNames.INFERNO_SHIELD;
  }

  canMove() {
    return false;
  }

  attackIfPossible() {
    // Shield can't attack.
  }

  getPerceivedRotation(tickPercent: any) {
    return -Math.PI / 2;
  }

  drawUnderTile() {
    this.region.context.fillStyle = this.color;
    // Draw mob
    this.region.context.fillRect(
      -(3 * Settings.tileSize) / 2,
      -(3 * Settings.tileSize) / 2,
      3 * Settings.tileSize,
      3 * Settings.tileSize,
    );
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, ShieldModel);
  }

  get animationIndex() {
    return 0; // idle
  }

  override get deathAnimationId() {
    return 1;
  }
}
