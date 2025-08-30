"use strict"

import { InvisibleMovementBlocker, TileMarkerModel } from "@supalosa/oldschool-trainer-sdk";

export class WallMan extends InvisibleMovementBlocker {

    override get color() {
        return "#000000";
    }

    override create3dModel() {
        return TileMarkerModel.forRenderable(this, null);
    }
}