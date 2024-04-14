import { Player } from "../../src/sdk/Player";
import { World } from "../../src/sdk/World";
import { TwistedBow } from "../../src/content/weapons/TwistedBow";
import { Region } from "../../src/sdk/Region";
import { Viewport } from "../../src/sdk/Viewport";
import { Wall } from "../../src/content/Wall";
import { TzKalZuk } from "../../src/content/inferno/js/mobs/TzKalZuk";
import { Mob } from "../../src/sdk/Mob";
import { InvisibleMovementBlocker } from "../../src/content/MovementBlocker";
import { InfernoPillar } from "../../src/content/inferno/js/InfernoPillar";
import { JalXil } from "../../src/content/inferno/js/mobs/JalXil";

class TestRegion extends Region {
  get width(): number {
    return 51;
  }

  get height(): number {
    return 57;
  }
}

// check that we accurately drag around pillars in the expected direction
describe("drag tests", () => {
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

    region.addEntity(new InfernoPillar(region, { x: 28, y: 21 }));

    Viewport.setupViewport(region, true);
  });

  test("drag east when clicking front npc", () => {
    // player is right up against the pillar and clicks front 3x3 npc
    const player = new Player(region, { x: 29, y: 18 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const jalxil = new JalXil(region, { x: 29, y: 24 }, { aggro: player });
    region.addMob(jalxil);

    player.setAggro(jalxil);

    expect(player.location).toEqual({ x: 29, y: 18 });
    world.tickWorld();
    // jal xil didn't move
    expect(jalxil.location).toEqual({ x: 29, y: 24 });
    expect(player.pathTargetLocation).toEqual({ x: 31, y: 21 });
    expect(player.location).toEqual({ x: 31, y: 18 });
  });

  test("drag forward and east when clicking front npc from one tile back", () => {
    // player is one tile back from the pillar and clicks front 3x3 npc
    const player = new Player(region, { x: 29, y: 17 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const jalxil = new JalXil(region, { x: 29, y: 24 }, { aggro: player });
    region.addMob(jalxil);

    player.setAggro(jalxil);

    expect(player.location).toEqual({ x: 29, y: 17 });
    world.tickWorld();
    // jal xil didn't move
    expect(jalxil.location).toEqual({ x: 29, y: 24 });
    expect(player.pathTargetLocation).toEqual({ x: 31, y: 21 });
    expect(player.location).toEqual({ x: 31, y: 18 });
  });

  test("drag forward and east twice when clicking front npc from three tiles back", () => {
    // player is three tiles back from the pillar and clicks front 3x3 npc
    const player = new Player(region, { x: 29, y: 15 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    const jalxil = new JalXil(region, { x: 29, y: 24 }, { aggro: player });
    region.addMob(jalxil);

    player.setAggro(jalxil);

    expect(player.location).toEqual({ x: 29, y: 15 });
    world.tickWorld();
    expect(jalxil.location).toEqual({ x: 29, y: 24 });
    // player steps forward and east one tile
    expect(player.location).toEqual({ x: 30, y: 17 });
    expect(player.pathTargetLocation).toEqual({ x: 31, y: 21 });
    world.tickWorld();
    // jal xil moves to follow one tick later
    expect(jalxil.location).toEqual({ x: 30, y: 24 });
    expect(player.location).toEqual({ x: 31, y: 19 });
  });

  test("drag west when clicking back npc", () => {
    // player is right up against the pillar and clicks back 3x3 npc
    const player = new Player(region, { x: 29, y: 18 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    region.addMob(new JalXil(region, { x: 29, y: 24 }, { aggro: player }));
    const backJalXil = new JalXil(region, { x: 29, y: 27 }, { aggro: player });
    region.addMob(backJalXil);

    player.setAggro(backJalXil);

    expect(player.location).toEqual({ x: 29, y: 18 });
    world.tickWorld();
    // jal xil didn't move
    expect(backJalXil.location).toEqual({ x: 29, y: 27 });
    expect(player.pathTargetLocation).toEqual({ x: 29, y: 24 });
    expect(player.location).toEqual({ x: 27, y: 18 });
    world.tickWorld();
    expect(backJalXil.location).toEqual({ x: 28, y: 27 });
  });

  test("drag forward and west when clicking back npc from one tile back", () => {
    // player is 1 tile back against the pillar and clicks back 3x3 npc
    const player = new Player(region, { x: 29, y: 17 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    region.addMob(new JalXil(region, { x: 29, y: 24 }, { aggro: player }));
    const backJalXil = new JalXil(region, { x: 29, y: 27 }, { aggro: player });
    region.addMob(backJalXil);

    player.setAggro(backJalXil);

    expect(player.location).toEqual({ x: 29, y: 17 });
    world.tickWorld();
    // jal xil didn't move
    expect(backJalXil.location).toEqual({ x: 29, y: 27 });
    expect(player.pathTargetLocation).toEqual({ x: 29, y: 24 });
    expect(player.location).toEqual({ x: 27, y: 18 });
    world.tickWorld();
    expect(backJalXil.location).toEqual({ x: 28, y: 27 });
  });

  test("drag forward and west twice when clicking back npc from three tiles back", () => {
    // player is  tile back against the pillar and clicks back 3x3 npc
    const player = new Player(region, { x: 29, y: 15 });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);

    region.addMob(new JalXil(region, { x: 29, y: 24 }, { aggro: player }));
    const backJalXil = new JalXil(region, { x: 29, y: 27 }, { aggro: player });
    region.addMob(backJalXil);

    player.setAggro(backJalXil);

    expect(player.location).toEqual({ x: 29, y: 15 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 28, y: 17 });
    expect(player.pathTargetLocation).toEqual({ x: 29, y: 24 });
    world.tickWorld();
    expect(player.location).toEqual({ x: 27, y: 19 });
  });
});
