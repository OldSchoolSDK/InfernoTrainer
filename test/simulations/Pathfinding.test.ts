import { Player } from "../../src/sdk/Player";
import { World } from "../../src/sdk/World";
import { Region } from "../../src/sdk/Region";
import { Viewport } from "../../src/sdk/Viewport";
import { Wall } from "../../src/content/Wall";
import { InvisibleMovementBlocker } from "../../src/content/MovementBlocker";
import { InfernoPillar } from "../../src/content/inferno/js/InfernoPillar";

class TestRegion extends Region {
  get width(): number {
    return 51;
  }

  get height(): number {
    return 57;
  }
}

describe("pathfinding tests", () => {
  let region: TestRegion;
  let world: World;

  beforeEach(() => {
    region = new TestRegion();
    world = new World();
    region.world = world;
    world.addRegion(region);

    for (let x = 10; x < 41; x++) {
      region.addEntity(new InvisibleMovementBlocker(region, { x, y: 13 }));
      region.addEntity(new InvisibleMovementBlocker(region, { x, y: 44 }));
    }
    for (let y = 14; y < 44; y++) {
      region.addEntity(new InvisibleMovementBlocker(region, { x: 10, y }));
      region.addEntity(new InvisibleMovementBlocker(region, { x: 40, y }));
    }

    region.addEntity(new Wall(region, { x: 21, y: 8 }));
    region.addEntity(new Wall(region, { x: 21, y: 7 }));
    region.addEntity(new Wall(region, { x: 21, y: 6 }));
    region.addEntity(new Wall(region, { x: 21, y: 5 }));
    region.addEntity(new Wall(region, { x: 21, y: 4 }));
    region.addEntity(new Wall(region, { x: 21, y: 3 }));
    region.addEntity(new Wall(region, { x: 21, y: 2 }));
    region.addEntity(new Wall(region, { x: 21, y: 1 }));
    region.addEntity(new Wall(region, { x: 21, y: 0 }));
    region.addEntity(new Wall(region, { x: 29, y: 8 }));
    region.addEntity(new Wall(region, { x: 29, y: 7 }));
    region.addEntity(new Wall(region, { x: 29, y: 6 }));
    region.addEntity(new Wall(region, { x: 29, y: 5 }));
    region.addEntity(new Wall(region, { x: 29, y: 4 }));
    region.addEntity(new Wall(region, { x: 29, y: 3 }));
    region.addEntity(new Wall(region, { x: 29, y: 2 }));
    region.addEntity(new Wall(region, { x: 29, y: 1 }));
    region.addEntity(new Wall(region, { x: 29, y: 0 }));

    Viewport.setupViewport(region, true);
  });

  test("can path in a straight line", () => {
    const player = new Player(region, { x: 14, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    player.moveTo(20, 14);

    expect(player.location).toEqual({ x: 14, y: 14 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 16, y: 14 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 18, y: 14 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 20, y: 14 });
  });

  test("can path in a diagonal line", () => {
    const player = new Player(region, { x: 14, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    player.moveTo(20, 20);

    expect(player.location).toEqual({ x: 14, y: 14 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 16, y: 16 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 18, y: 18 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 20, y: 20 });
  });

  test("can path around a pillar", () => {
    const player = new Player(region, { x: 14, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    region.addEntity(new InfernoPillar(region, { x: 16, y: 16 }));

    player.moveTo(20, 20);

    expect(player.location).toEqual({ x: 14, y: 14 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 14, y: 16 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 16, y: 17 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 18, y: 18 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 20, y: 20 });
  });

  test("can path outside the walled area", () => {
    const player = new Player(region, { x: 14, y: 20 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    player.moveTo(14, 0);

    expect(player.location).toEqual({ x: 14, y: 20 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 14, y: 18 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 14, y: 16 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 14, y: 14 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 14, y: 14 });
    // ensure the edge position (14, 14) is where the clickMarker stays
    expect(player.pathTargetLocation).toEqual({ x: 14, y: 14 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 14, y: 14 });
    expect(player.pathTargetLocation).toEqual({ x: 14, y: 14 });
  });

  test("does not path back and forth on the west side", () => {
    const player = new Player(region, { x: 12, y: 20 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    player.moveTo(8, 20);

    // Player used to oscillate back and forth on the edges
    expect(player.location).toEqual({ x: 12, y: 20 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 11, y: 20 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 11, y: 20 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 11, y: 20 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 11, y: 20 });
  });
});
