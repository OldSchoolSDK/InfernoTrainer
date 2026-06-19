"use strict";

import {
  CollisionType,
  Entity,
  LineOfSightMask,
  Location,
  Player,
  Region,
} from "osrs-sdk";

export class AttackCooldownOverlay extends Entity {
  private player: Player;
  private visibleAfterAttack = false;

  constructor(region: Region, player: Player) {
    super(region, { ...player.location });
    this.player = player;
  }

  get collisionType() {
    return CollisionType.NONE;
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  get selectable() {
    return false;
  }

  get size() {
    return 1;
  }

  show() {
    this.visibleAfterAttack = true;
  }

  sync() {
    this.location = { ...this.player.location };

    if (this.player.attackDelay <= 0) {
      this.visibleAfterAttack = false;
    }
  }

  getPerceivedLocation(tickPercent: number) {
    return this.player.getPerceivedLocation(tickPercent);
  }

  getTrueLocation() {
    return this.player.location;
  }

  draw() {
    // Do not draw anything on the ground tile.
  }

  drawUILayer(
    tickPercent: number,
    offset: Location,
    context: OffscreenCanvasRenderingContext2D,
    scale: number,
  ) {
    if (!this.visibleAfterAttack || this.player.attackDelay <= 0) {
      return;
    }

    const text = String(this.player.attackDelay);

    context.save();
    context.translate(offset.x, offset.y);

    context.font = "bold 28px OSRS";
    context.textAlign = "center";
    context.lineWidth = 5;

    // Black outline
    context.strokeStyle = "black";
    context.strokeText(text, 0, -scale * 2.6);

    // Main number
    context.fillStyle = this.player.attackDelay === 1 ? "#00ff00" : "#ffff00";
    context.fillText(text, 0, -scale * 2.6);

    context.restore();
  }
}