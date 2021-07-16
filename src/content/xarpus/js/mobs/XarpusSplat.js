import { Entity } from "../../../../sdk/Entity";

// Xarpus Splats appear after some delay.
export class XarpusSplat extends Entity {
    constructor(tickDelay, region, point, size) {
      super(region, point, size);
      this.tickDelay = 0;
      this.isVisible = false;
    }

    get collisionType() {
        return Entity.collisionType.NONE;
    }

    get color() {
        return "#00AA0073";
    }

    tick(region) {
        super.tick(region);
        this.isVisible = (this.tickDelay--) <= 0;
    }

    draw(tickPercent) {
        if (this.isVisible) {
            super.draw(tickPercent);
        }
    }
}