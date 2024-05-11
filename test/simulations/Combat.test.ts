import { Player } from "../../src/sdk/Player";
import { World } from "../../src/sdk/World";
import { Blowpipe } from "../../src/content/weapons/Blowpipe";
import { TwistedBow } from "../../src/content/weapons/TwistedBow";
import { Random } from "../../src/sdk/Random";
import { Viewport } from "../../src/sdk/Viewport";
import { TestRegion } from "../../src/sdk/testing/TestRegion";
import { TestNpc } from "../../src/sdk/testing/TestNpc";
import { Settings } from "../../src";

describe("basic combat scenario", () => {
  test("when player tries to kill a fake jalxil...", () => {
    Settings.inputDelay = 0;
    const region = new TestRegion(60, 60);
    const world = new World();
    region.world = world;
    world.addRegion(region);
    const player = new Player(region, { x: 30, y: 60 });
    region.addPlayer(player);
    Viewport.setupViewport(region, true);
    Viewport.viewport.setPlayer(player);

    new TwistedBow().inventoryLeftClick(player);
    const jalxil = new TestNpc(region, { x: 25, y: 25 }, { aggro: player });
    region.addMob(jalxil);
    world.tickWorld(30);
    player.prayerController.findPrayerByName("Protect from Range").activate(player);
    player.setAggro(jalxil);
    world.tickWorld(20);
    expect(player.location).toEqual({ x: 30, y: 54 });
    expect(player.currentStats.hitpoint).toBe(41);
    expect(player.equipment.weapon.itemName).toEqual("Twisted Bow");
    expect(jalxil.location).toEqual({ x: 30, y: 45 });
    expect(jalxil.currentStats.hitpoint).toBe(124);

    player.moveTo(jalxil.location.x, jalxil.location.y);
    player.prayerController.findPrayerByName("Rigour").activate(player);
    const blowpipe = new Blowpipe();
    blowpipe.inventoryLeftClick(player);
    expect(player.equipment.weapon.itemName).toEqual("Toxic Blowpipe");
    expect(player.aggro).toEqual(null);

    world.tickWorld(10);
    player.setAggro(jalxil);
    world.tickWorld(5);
    expect(player.aggro).toEqual(jalxil);

    world.tickWorld(80);
    expect(player.location).toEqual({ x: 30, y: 45 });
    expect(player.currentStats.prayer).toEqual(39);
    expect(jalxil.location).toEqual({ x: 30, y: 44 });
    expect(jalxil.currentStats.hitpoint).toBe(0);
    expect(player.currentStats.hitpoint).toBe(33);
    expect(world.globalTickCounter).toEqual(145);
    expect(Random.callCount).toEqual(78);
  });
});
