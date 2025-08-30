import { World, Mob, InvisibleMovementBlocker, Viewport, Player, TwistedBow, TestRegion } from "@supalosa/oldschool-trainer-sdk";

import { Wall } from "../../src/content/inferno/js/Wall";
import { TzKalZuk } from "../../src/content/inferno/js/mobs/TzKalZuk";

// Zuk LOS (dragging behaviour) tests
describe("player LOS in zuk fight", () => {
  let region: TestRegion;
  let world: World;

  let zuk: Mob;

  beforeEach(() => {
    region = new TestRegion(51, 57);
    world = new World();
    region.world = world;
    world.addRegion(region);

    zuk = new TzKalZuk(region, { x: 22, y: 8 }, {});
    region.addMob(zuk);

    // The arena still needs to be closed off to prevent the player from pathing "around" the walls.
    // Seems like this is most accurate if it's the exact size of the real arena.
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

  test("player has line of sight at left safespot", () => {
    const player = new Player(region, { x: 14, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const twistedBow = new TwistedBow();
    twistedBow.inventoryLeftClick(player);

    player.setAggro(zuk);

    expect(player.location).toEqual({ x: 14, y: 14 });
    expect(player.attackDelay).toBe(0);
    world.tickWorld(1);
    expect(player.attackDelay).toBe(twistedBow.attackSpeed);
    expect(player.location).toEqual({ x: 14, y: 14 });
  });

  test("player has line of sight at middle-left safespot", () => {
    const player = new Player(region, { x: 20, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const twistedBow = new TwistedBow();
    twistedBow.inventoryLeftClick(player);

    player.setAggro(zuk);

    expect(player.location).toEqual({ x: 20, y: 14 });
    expect(player.attackDelay).toBe(0);
    world.tickWorld(1);
    expect(player.attackDelay).toBe(twistedBow.attackSpeed);
    expect(player.location).toEqual({ x: 20, y: 14 });
  });

  test("player has line of sight at middle-right safespot", () => {
    const player = new Player(region, { x: 30, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const twistedBow = new TwistedBow();
    twistedBow.inventoryLeftClick(player);

    player.setAggro(zuk);

    expect(player.location).toEqual({ x: 30, y: 14 });
    expect(player.attackDelay).toBe(0);
    world.tickWorld(1);
    expect(player.attackDelay).toBe(twistedBow.attackSpeed);
    expect(player.location).toEqual({ x: 30, y: 14 });
  });

  test("player has line of sight at right safespot", () => {
    const player = new Player(region, { x: 36, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const twistedBow = new TwistedBow();
    twistedBow.inventoryLeftClick(player);

    player.setAggro(zuk);

    expect(player.location).toEqual({ x: 36, y: 14 });
    expect(player.attackDelay).toBe(0);
    world.tickWorld(1);
    expect(player.attackDelay).toBe(twistedBow.attackSpeed);
    expect(player.location).toEqual({ x: 36, y: 14 });
  });

  test("player is dragged from dead tiles on left side", () => {
    const player = new Player(region, { x: 16, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const twistedBow = new TwistedBow();
    twistedBow.inventoryLeftClick(player);

    player.setAggro(zuk);

    expect(player.location).toEqual({ x: 16, y: 14 });
    expect(player.attackDelay).toBe(0);
    world.tickWorld();
    // The player should look like they are pathing towards this position. In reality
    // they gain LOS at x = 20.
    expect(player.pathTargetLocation).toEqual({ x: 22, y: 14 });
    expect(player.attackDelay).toBe(-1);
    expect(player.location).toEqual({ x: 18, y: 14 });
    world.tickWorld();
    expect(player.attackDelay).toBe(twistedBow.attackSpeed);
    expect(player.location).toEqual({ x: 20, y: 14 });
  });

  test("player is dragged from dead tiles on right side", () => {
    const player = new Player(region, { x: 34, y: 14 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const twistedBow = new TwistedBow();
    twistedBow.inventoryLeftClick(player);

    player.setAggro(zuk);

    expect(player.location).toEqual({ x: 34, y: 14 });
    expect(player.attackDelay).toBe(0);
    world.tickWorld();
    expect(player.pathTargetLocation).toEqual({ x: 28, y: 14 });
    expect(player.attackDelay).toBe(-1);
    expect(player.location).toEqual({ x: 32, y: 14 });
    world.tickWorld();
    expect(player.attackDelay).toBe(twistedBow.attackSpeed);
    expect(player.location).toEqual({ x: 30, y: 14 });
  });
});
