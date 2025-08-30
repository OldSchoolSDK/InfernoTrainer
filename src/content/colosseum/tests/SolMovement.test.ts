import "../../../../test/setupFiles";

import { Player, World, Viewport, TestRegion } from "@supalosa/oldschool-trainer-sdk";
import { SolHeredit } from "../js/mobs/SolHeredit";

// sol heredit movement tests
describe("sol heredit movement", () => {
  let region: TestRegion;
  let world: World;
  let player: Player;
  let boss: SolHeredit;

  beforeAll(() => {
    region = new TestRegion(30, 30);
    world = new World();
    region.world = world;
    world.addRegion(region);
    Viewport.setupViewport(region, true);
    player = new Player(region, { x: 15, y: 15 });
    boss = new SolHeredit(region, { x: 13, y: 23 }, { aggro: player });
    boss.stunned = 0;
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);
  });

  test("sol takes two steps towards player", () => {
    boss.setAggro(player);
    region.addMob(boss);

    world.tickWorld();
    expect(player.location).toEqual({ x: 15, y: 15 });
    expect(boss.location).toEqual({ x: 13, y: 21 });
  });

  test("sol takes one step towards player", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 15, y: 15 });
    expect(boss.location).toEqual({ x: 13, y: 20 });
  });

  test("sol moves horizontally when player is at corner", () => {
    player.setLocation({ x: 12, y: 21 });
    player.moveTo(12, 21);
    world.tickWorld();
    expect(player.location).toEqual({ x: 12, y: 21 });
    expect(boss.location).toEqual({ x: 12, y: 20 });
  });

  // diagonal movement order tests
  test("sol moves straight before moving diagonally", () => {
    boss.setLocation({x: 4, y: 12})
    player.setLocation({ x: 0, y: 20 });
    player.moveTo(0, 20);
    world.tickWorld();
    expect(player.location).toEqual({ x: 0, y: 20 });
    expect(boss.location).toEqual({ x: 4, y: 14 });
  });
  
  test("sol moves in an L movement", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 3, y: 16 });
  });
  
  test("sol takes a diagonal step", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 1, y: 18 });
  });
  
  test("sol ends up north of the player", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 0, y: 19 });
  });
});
