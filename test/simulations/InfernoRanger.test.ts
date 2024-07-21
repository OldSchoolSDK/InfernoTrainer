import { JalXil } from "../../src/content/inferno/js/mobs/JalXil";
import { Player } from "../../src/sdk/Player";
import { World } from "../../src/sdk/World";
import { Blowpipe } from "../../src/content/weapons/Blowpipe";
import { TwistedBow } from "../../src/content/weapons/TwistedBow";
import { Settings } from "../../src/sdk/Settings";
import { Region } from "../../src/sdk/Region";
import { Random } from "../../src/sdk/Random";
import { PlayerCreated } from "../../src/sdk/events/player/PlayerCreated";

jest.mock("../../src/sdk/XpDropController", () => {
  return {
    XpDropController: {
      controller: {
        tick: () => true,
        registerXpDrop: () => true,
      },
    },
  };
});

jest.mock("../../src/sdk/MapController", () => {
  return {
    MapController: {
      controller: {
        updateOrbsMask: () => true,
      },
    },
  };
});

jest.mock("../../src/sdk/ControlPanelController", () => {
  return {
    ControlPanelController: {
      controller: {},
    },
  };
});

jest.spyOn(document, "getElementById").mockImplementation((elementId: string) => {
  const c = document.createElement("canvas");
  c.ariaLabel = elementId;
  return c;
});

Random.setRandom(() => {
  Random.memory = (Random.memory + 13.37) % 180;
  return Math.abs(Math.sin(Random.memory * 0.0174533));
});

Settings.readFromStorage();

export class TestRegion60x60 extends Region {
  get width(): number {
    return 60;
  }

  get height(): number {
    return 60;
  }
}

describe("basic combat scenario", () => {
  test("when player tries to kill an inferno ranger...", () => {
    const region = new TestRegion60x60();
    const world = new World();
    region.setWorld(world);
    world.addRegion(region);
    const player = new Player(region, { x: 30, y: 60 });
    const playerCreatedEvent = new PlayerCreated(
      player,
      region
    );
    world.eventBus.publish(playerCreatedEvent);

    new TwistedBow().inventoryLeftClick(player);
    const jalxil = new JalXil(region, { x: 25, y: 25 }, { aggro: player });
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
