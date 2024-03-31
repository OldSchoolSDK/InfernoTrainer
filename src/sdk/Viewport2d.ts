"use strict";
import { Player } from "./Player";
import { World } from "./World";
import { Viewport, ViewportDelegate } from "./Viewport";
import { Region } from "./Region";
import { Chrome } from "./Chrome";
import { Settings } from "./Settings";
import { Location } from "./Location";

export class Viewport2d implements ViewportDelegate {
  draw(world: World, region: Region) {
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
        const perceivedLocation = player.getPerceivedLocation(
          world.tickPercent
        );
        const perceivedX = perceivedLocation.x;
        const perceivedY = perceivedLocation.y;

        const offset = {
          x:
            perceivedX * Settings.tileSize +
            (player.size * Settings.tileSize) / 2,
          y:
            (perceivedY - player.size + 1) * Settings.tileSize +
            (player.size * Settings.tileSize) / 2,
        };

        player.drawUILayer(world.tickPercent, offset);
      });
    }

    region.context.restore();

    const { viewportX, viewportY } = Viewport.viewport.getViewport(
      world.tickPercent
    );
    return {
      canvas: region.canvas,
      flip: Settings.rotated === "south",
      offsetX: -viewportX * Settings.tileSize,
      offsetY: -viewportY * Settings.tileSize,
    };
  }

  translateClick(offsetX, offsetY, world, viewport) {
    const { viewportX, viewportY } = viewport.getViewport(world.tickPercent);
    let x: number = offsetX + viewportX * Settings.tileSize;
    let y: number = offsetY + viewportY * Settings.tileSize;

    if (Settings.rotated === "south") {
      x =
        viewport.width * Settings.tileSize -
        offsetX +
        viewportX * Settings.tileSize;
      y =
        viewport.height * Settings.tileSize -
        offsetY +
        viewportY * Settings.tileSize;
    }
    return {
      type: "coordinate" as const,
      location: {
        x,
        y,
      },
    };
  }
}
