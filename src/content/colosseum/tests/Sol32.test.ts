import { BladeOfSaeldor, Player, ScytheOfVitur, TestRegion, Viewport, World } from "@supalosa/oldschool-trainer-sdk";

import { Attacks, SolHeredit } from "../js/mobs/SolHeredit";

// sol heredit 32-tick reproduction of kiwi iskadda's fight in https://www.youtube.com/watch?v=b7Iv7cf-taQ
describe("sol heredit attacks", () => {
  let region: TestRegion;
  let world: World;
  let player: Player;
  let boss: SolHeredit;
  const fourTickWeapon = new BladeOfSaeldor();
  const fiveTickWeapon = new ScytheOfVitur();

  beforeAll(() => {
    region = new TestRegion(40, 40);
    world = new World();
    region.world = world;
    world.addRegion(region);
    Viewport.setupViewport(region, true);
    player = new Player(region, { x: 27, y: 29 });
    boss = new SolHeredit(region, { x: 25, y: 24 }, { aggro: player });
    region.addPlayer(player);
    Viewport.viewport.setPlayer(player);
    boss.setAggro(player);
    region.addMob(boss);
    boss.stunned = 4;
    fourTickWeapon.inventoryLeftClick(player);
    player.setLocation({ x: 27, y: 29 });
  });

  test("tick 1", () => {
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 27, y: 29 });
    player.setAggro(boss);
  });

  test("tick 2", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 27, y: 27 });
  });

  test("tick 3", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 27, y: 25 });
    expect(player.attackDelay).toEqual(4);
    fiveTickWeapon.inventoryLeftClick(player);
    player.moveTo(24, 22);
  });

  test("tick 4", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 25, y: 23 });
  });

  test("tick 5", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 24, y: 22 });
    player.setAggro(boss);
    boss.forceAttack = Attacks.SPEAR;
  });

  test("tick 6", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(boss.attackDelay).toEqual(7);
  });

  test("tick 7", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.attackDelay).toEqual(5);
    player.moveTo(23, 22);
  });

  test("tick 8", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 23, y: 22 });
    player.setAggro(boss);
  });

  test("tick 9", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 24, y: 22 });
    expect(player.currentStats.hitpoint).toEqual(99);
    player.moveTo(24, 21);
  });

  test("tick 10", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 24, y: 21 });
    expect(player.currentStats.hitpoint).toEqual(99);
    player.setAggro(boss);
  });

  test("tick 11", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 24, y: 21 });
  });

  test("tick 12", () => {
    // hit the boss here
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 24, y: 21 });
    expect(player.attackDelay).toEqual(5);
  });

  test("tick 13", () => {
    // phased the boss here - "Not bad. Let's try something else..."
    boss.currentStats.hitpoint = 1337;
    // TODO implement phase transition
    boss.stunned = 6;
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.location).toEqual({ x: 24, y: 21 });
  });

  test("tick 14", () => {
    world.tickWorld();
    expect(boss.location).toEqual({ x: 25, y: 24 });
    player.moveTo(23, 22);
  });

  test("tick 15", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 23, y: 22 });
    expect(boss.location).toEqual({ x: 25, y: 24 });
    player.moveTo(23, 23);
  });

  test("tick 16", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 23, y: 23 });
    expect(boss.location).toEqual({ x: 25, y: 24 });
    player.setAggro(boss);
  });

  test("tick 17", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 24, y: 23 });
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(player.attackDelay).toEqual(5);
    player.moveTo(24, 25);
  });

  test("tick 18", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 24, y: 25 });
    expect(boss.location).toEqual({ x: 25, y: 24 });
    expect(boss.attackDelay).toBeLessThan(0); // boss is not attacking
    player.moveTo(24, 26);
  });

  test("tick 19", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 24, y: 26 });
    expect(boss.location).toEqual({ x: 24, y: 24 });
    expect(boss.attackDelay).toBeLessThan(0);
    player.moveTo(24, 27);
  });

  test("tick 20", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 24, y: 27 });
    expect(boss.location).toEqual({ x: 24, y: 25 });
    expect(boss.attackDelay).toBeLessThan(0);
    player.moveTo(24, 28);
  });

  test("tick 21", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 24, y: 28 });
    expect(boss.location).toEqual({ x: 24, y: 26 });
    expect(boss.attackDelay).toBeLessThan(0);
    player.setAggro(boss);
  });

  test("tick 22", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 24, y: 28 });
    expect(boss.location).toEqual({ x: 24, y: 27 });
    expect(player.attackDelay).toEqual(5);
    expect(boss.attackDelay).toBeLessThan(0);
  });

  test("tick 23", () => {
    boss.forceAttack = Attacks.SPEAR;
    world.tickWorld();
    expect(player.location).toEqual({ x: 24, y: 28 });
    expect(boss.location).toEqual({ x: 24, y: 27 });
    expect(boss.attackDelay).toEqual(7);
    player.moveTo(25, 29);
  });

  test("tick 24", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 25, y: 29 });
    expect(boss.location).toEqual({ x: 24, y: 27 });
  });

  test("tick 25", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 25, y: 29 });
    expect(boss.location).toEqual({ x: 24, y: 27 });
    expect(player.stats.hitpoint).toEqual(99); // didn't get hit
    player.setAggro(boss);
  });

  test("tick 26", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 25, y: 28 });
    expect(boss.location).toEqual({ x: 24, y: 27 });
    expect(player.stats.hitpoint).toEqual(99);
  });

  test("tick 27", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 25, y: 28 });
    expect(boss.location).toEqual({ x: 24, y: 27 });
    expect(player.attackDelay).toEqual(5);
  });

  test("tick 28", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 25, y: 28 });
    expect(boss.location).toEqual({ x: 24, y: 27 });
    player.moveTo(26, 29);
  });

  test("tick 29", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 26, y: 29 });
    expect(boss.location).toEqual({ x: 24, y: 27 });
    player.moveTo(26, 30);
  });

  test("tick 30", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 26, y: 30 });
    expect(boss.location).toEqual({ x: 24, y: 28 });
    player.setAggro(boss);
  });

  test("tick 31", () => {
    world.tickWorld();
    expect(player.location).toEqual({ x: 26, y: 30 });
    expect(boss.location).toEqual({ x: 24, y: 29 });
  });

  test("tick 32", () => {
    boss.forceAttack = Attacks.SHIELD;
    world.tickWorld();
    expect(player.location).toEqual({ x: 26, y: 30 });
    expect(boss.location).toEqual({ x: 24, y: 29 });
    expect(player.attackDelay).toEqual(5);
    expect(boss.attackDelay).toEqual(6);
  });
});
