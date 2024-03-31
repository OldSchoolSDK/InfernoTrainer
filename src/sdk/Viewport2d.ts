"use strict";
import { Player } from "./Player";
import { World } from "./World";
import { ViewportDelegate } from "./Viewport";
import { Region } from "./Region";

export class Viewport2d implements ViewportDelegate {
  drawRegion(world: World, region: Region) {
    region.context.save();
    region.drawWorldBackground();
    region.drawGroundItems(region.context);

    // Draw all things on the map
    region.entities.forEach((entity) => entity.draw(world.tickPercent));

    if (world.getReadyTimer <= 0) {
      region.mobs.forEach((mob) => mob.draw(world.tickPercent));
      region.newMobs.forEach((mob) => mob.draw(world.tickPercent));
    }

    region.players.forEach((player: Player) => {
      player.draw(world.tickPercent);
    });

    region.entities.forEach((entity) => entity.drawUILayer(world.tickPercent));

    if (world.getReadyTimer === 0) {
      region.mobs.forEach((mob) => mob.drawUILayer(world.tickPercent));

      region.players.forEach((player: Player) => {
        player.drawUILayer(world.tickPercent);
      });
    }

    region.context.restore();
  }
}
