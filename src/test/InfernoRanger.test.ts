jest.mock('../sdk/utils/ImageLoader');
jest.mock('../sdk/XpDropController', () => {

  return jest.fn().mockImplementation(() => {
    return { }
  })
})

jest.mock('../sdk/MapController', () => {
  return jest.fn().mockImplementation(() => {
    return { }
  })
})

jest.spyOn(document, 'getElementById').mockImplementation((elementId: string) => {
  return document.createElement('canvas');
});

import { InfernoLoadout } from '../content/inferno/js/InfernoLoadout';
import { JalXil } from '../content/inferno/js/mobs/JalXil';
import { Player } from '../sdk/Player';
import { Region } from '../sdk/Region'
import { World } from '../sdk/World';
import { Settings } from '../sdk/Settings';
import { Random } from '../sdk/Random';

Random.setRandom(() => {
  Random.memory = (Random.memory + 13.37) % 180;
  return Math.abs(Math.sin(Random.memory * 0.0174533));
});

Settings.readFromStorage();

class TestRegion extends Region {
  get width (): number {
    return 51
  }

  get height (): number {
    return 57
  }
}

describe('basic combat', () => {

  test('...', () => {

    const region = new TestRegion();
    const world = new World(region, null, null);
    world.getReadyTimer = 0;
    region.initialize(world);
    const loadout = new InfernoLoadout(69, 'max_tbow', false);
    const player = new Player(
      world,
      { x: 30, y: 60 },
      loadout.getLoadout()
    )
    world.setPlayer(player)

    let jalxil = new JalXil(world, { x: 25, y: 25}, { aggro: player });
    world.region.addMob(jalxil)

    for (let i = 0; i < 30; i++) {
      world.worldTick();
    }

    player.prayerController.prayers[17].activate(player); // protect range
    player.setAggro(jalxil)
    
    for (let i = 0; i < 20; i++) {
      world.worldTick();
    }

    expect(player.location).toEqual({ x: 30, y: 54 });
    expect(player.currentStats.hitpoint).toBe(78);
    expect(player.equipment.weapon.itemName).toEqual('Twisted Bow');

    expect(jalxil.location).toEqual({ x: 30, y: 45});
    expect(jalxil.currentStats.hitpoint).toBe(105);

    player.prayerController.prayers[27].activate(player); // rigour
    player.inventory[0].inventoryLeftClick(player);

    expect(player.equipment.weapon.itemName).toEqual('Toxic Blowpipe');
    expect(player.aggro).toEqual(null);
    
    player.setAggro(jalxil);

    for (let i = 0; i < 20; i++) {
      world.worldTick();
    }

    expect(player.aggro).toEqual(jalxil);

    world.worldTick();
    world.worldTick();
    world.worldTick();
    world.worldTick();

    expect(jalxil.location).toEqual({ x: 30, y: 45});
    expect(jalxil.currentStats.hitpoint).toBe(0);


  });

});
