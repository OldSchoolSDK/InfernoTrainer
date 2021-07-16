import { RangedWeapon } from "../../../../sdk/Weapons/RangedWeapon";
import XarpusBallImage from "../../assets/images/xarpusBall.png";
import { Region } from "../../../../sdk/Region";
import { XarpusSplat } from "./XarpusSplat";
import { Projectile } from "../../../../sdk/Weapons/Projectile";
import { Pathing } from "../../../../sdk/Pathing";

export class XarpusWeapon extends RangedWeapon {
    get image() {
        return XarpusBallImage;
    }

    // Xarpus' attack doesn't directly deal damag.
    attack(region, from, to, bonuses = {}) {
        let projectile = new Projectile(0, from, to, 'range', false, this.image);
        to.addProjectile(projectile);
        // Add a delayed Xarpus splat to the target location, if possible.
        if (Pathing.entitiesAtPoint(region, to.location.x, to.location.y, 1).length == 0) {
            region.addEntity(this.makeSplat(projectile.initialDelay, region, to));
        }
    }

    makeSplat(delay, region, to) {
        let splat = new XarpusSplat(delay, region, to.location, 1);
        return splat;
    }
    
    isBlockable(from, to, bonuses) {
        return false;
    }
}