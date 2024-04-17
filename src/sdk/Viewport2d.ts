"use strict";
import { Player } from "./Player";
import { World } from "./World";
import { Viewport, ViewportDelegate } from "./Viewport";
import { CardinalDirection, Region } from "./Region";
import { Settings } from "./Settings";
import { Renderable } from "./Renderable";
import { Unit } from "./Unit";
import { Pathing } from "./Pathing";

export class Viewport2d implements ViewportDelegate {
  async initialise(world: World, region: Region) {
    // do nothing, but maybe we should buffer the world background
    return;
  }

  draw(world: World, region: Region) {
    region.context.save();
    region.drawWorldBackground(region.context, Settings.tileSize);
    region.drawGroundItems(region.context);

    // Draw all things on the map
    const renderables: Renderable[] = [...region.entities];
    const units: Unit[] = [];

    if (world.getReadyTimer <= 0) {
      units.push(...region.mobs);
      units.push(...region.newMobs);
    }
    units.push(...region.players);
    renderables.concat(units).forEach((r) => {
      const location = r.getPerceivedLocation(world.tickPercent);
      r.draw(world.tickPercent, region.context, location, Settings.tileSize);
    });

    region.entities.forEach((entity) => entity.drawUILayer(world.tickPercent));
    if (world.getReadyTimer === 0) {
      const getOffset = (r: Renderable) => {
        const perceivedLocation = r.getPerceivedLocation(world.tickPercent);
        const perceivedX = perceivedLocation.x;
        const perceivedY = perceivedLocation.y;

        return {
          x: perceivedX * Settings.tileSize + (r.size * Settings.tileSize) / 2,
          y: (perceivedY - r.size + 1) * Settings.tileSize + (r.size * Settings.tileSize) / 2,
        };
      };
      region.mobs.forEach((mob) =>
        mob.drawUILayer(world.tickPercent, getOffset(mob), mob.region.context, Settings.tileSize, true),
      );

      region.players.forEach((player: Player) => {
        player.drawUILayer(world.tickPercent, getOffset(player), player.region.context, Settings.tileSize, true);
      });

      units.forEach((unit) => {
        if (unit.dying === -1) {
          this.drawIncomingProjectiles(unit, unit.region.context, world.tickPercent);
        }
      });
    }

    region.context.restore();

    const { viewportX, viewportY } = Viewport.viewport.getViewport(world.tickPercent);
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
      x = viewport.width * Settings.tileSize - offsetX + viewportX * Settings.tileSize;
      y = viewport.height * Settings.tileSize - offsetY + viewportY * Settings.tileSize;
    }
    return {
      type: "coordinate" as const,
      location: {
        x: x / Settings.tileSize,
        y: y / Settings.tileSize,
      },
    };
  }

  // The rendering context is the world.
  drawIncomingProjectiles(
    unit: Unit,
    context: OffscreenCanvasRenderingContext2D,
    tickPercent: number,
    scale: number = Settings.tileSize,
  ) {
    const { incomingProjectiles } = unit;
    incomingProjectiles.forEach((projectile) => {
      if (projectile.options.hidden) {
        return;
      }

      if (projectile.remainingDelay < 0) {
        return;
      }

      const startX = projectile.currentLocation.x;
      const startY = projectile.currentLocation.y;
      const endX = projectile.to.location.x + projectile.to.size / 2;
      const endY = projectile.to.location.y - projectile.to.size / 2 + 1;

      const perceivedX = Pathing.linearInterpolation(startX, endX, tickPercent / (projectile.remainingDelay + 1));
      const perceivedY = Pathing.linearInterpolation(startY, endY, tickPercent / (projectile.remainingDelay + 1));

      context.save();
      context.translate(perceivedX * Settings.tileSize, perceivedY * Settings.tileSize);

      if (projectile.image) {
        context.rotate(Math.PI);
        context.drawImage(projectile.image, -scale / 2, -scale / 2, scale, scale);
      } else {
        context.beginPath();

        context.fillStyle = "#D1BB7773";
        if (
          projectile.attackStyle === "slash" ||
          projectile.attackStyle === "crush" ||
          projectile.attackStyle === "stab"
        ) {
          context.fillStyle = "#FF000073";
        } else if (projectile.attackStyle === "range") {
          context.fillStyle = "#00FF0073";
        } else if (projectile.attackStyle === "magic") {
          context.fillStyle = "#0000FF73";
        } else if (projectile.attackStyle === "heal") {
          context.fillStyle = "#9813aa73";
        } else {
          console.log("[WARN] This style is not accounted for in custom coloring: ", projectile.attackStyle);
        }
        context.arc(0, 0, 5, 0, 2 * Math.PI);
        context.fill();
      }
      context.restore();
    });
  }

  setMapRotation(direction: CardinalDirection) {
    if (direction === CardinalDirection.SOUTH) {
      Settings.rotated = "south";
    } else if (direction === CardinalDirection.NORTH) {
      Settings.rotated = "north";
    }
  }

  getMapRotation(): number {
    return Settings.rotated === "south" ? Math.PI : 0;
  }
}
