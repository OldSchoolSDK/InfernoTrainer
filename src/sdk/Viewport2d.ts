"use strict";
import { Player } from "./Player";
import { World } from "./World";
import { Viewport, ViewportDelegate } from "./Viewport";
import { Region } from "./Region";
import { Chrome } from "./Chrome";
import { Settings } from "./Settings";
import { Location } from "./Location";
import { Renderable } from "./Renderable";
import { Pathing } from "./Pathing";

export class Viewport2d implements ViewportDelegate {
  draw(world: World, region: Region) {
    region.context.save();
    region.drawWorldBackground();
    region.drawGroundItems(region.context);

    // Draw all things on the map
    const renderables: Renderable[] = [...region.entities];

    if (world.getReadyTimer <= 0) {
      renderables.push(...region.mobs);
      renderables.push(...region.newMobs);
    }
    renderables.push(...region.players);
    renderables.forEach((r) => {
      const location = r.getPerceivedLocation(world.tickPercent);
      r.draw(world.tickPercent, region.context, location);
    });

    region.entities.forEach((entity) => entity.drawUILayer(world.tickPercent));

    if (world.getReadyTimer === 0) {
      const getOffset = (r: Renderable) => {
        const perceivedLocation = r.getPerceivedLocation(world.tickPercent);
        const perceivedX = perceivedLocation.x;
        const perceivedY = perceivedLocation.y;

        return {
          x: perceivedX * Settings.tileSize + (r.size * Settings.tileSize) / 2,
          y:
            (perceivedY - r.size + 1) * Settings.tileSize +
            (r.size * Settings.tileSize) / 2,
        };
      };
      region.mobs.forEach((mob) =>
        mob.drawUILayer(
          world.tickPercent,
          getOffset(mob),
          mob.region.context,
          Settings.tileSize
        )
      );

      region.players.forEach((player: Player) => {
        player.drawUILayer(
          world.tickPercent,
          getOffset(player),
          player.region.context,
          Settings.tileSize
        );
      });
    }

    region.context.restore();

    const { viewportX, viewportY } = Viewport.viewport.getViewport(
      world.tickPercent
    );
    return {
      canvas: region.canvas,
      uiCanvas: null,
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
