jest.mock('../sdk/utils/ImageLoader');
jest.mock('../sdk/XpDropController', () => {
  return {
    'XpDropController': {
      controller: {
        registerXpDrop: jest.fn()
      }
    }
  }
});

jest.mock('../sdk/MapController', () => {
  return {
    'MapController' : null
  }
})

jest.spyOn(document, 'getElementById').mockImplementation((elementId: string) => {
  return document.createElement('canvas');
});

import { JalXil } from '../content/inferno/js/mobs/JalXil';
import { Player } from '../sdk/Player';
import { Region } from '../sdk/Region'
import { World } from '../sdk/World';
import { Settings } from '../sdk/Settings';
import { Random } from '../sdk/Random';
import { Blowpipe } from '../content/weapons/Blowpipe';
import { TwistedBow } from '../content/weapons/TwistedBow';

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
    const player = new Player(
      world,
      { x: 30, y: 60 },
      {}
    )

    const tbow = new TwistedBow();
    tbow.inventoryLeftClick(player);


    world.setPlayer(player)

    let jalxil = new JalXil(world, { x: 25, y: 25}, { aggro: player });
    world.region.addMob(jalxil)

    for (let i = 0; i < 30; i++) {
      world.worldTick();
    }

    player.prayerController.findPrayerByName('Protect from Range').activate(player);
    player.setAggro(jalxil)
    
    for (let i = 0; i < 20; i++) {
      world.worldTick();
    }

    expect(player.location).toEqual({ x: 30, y: 54 });
    expect(player.currentStats.hitpoint).toBe(41);
    expect(player.equipment.weapon.itemName).toEqual('Twisted Bow');
    

    expect(jalxil.location).toEqual({ x: 30, y: 45});
    expect(jalxil.currentStats.hitpoint).toBe(124);
    
    player.moveTo(jalxil.location.x, jalxil.location.y);

    player.prayerController.findPrayerByName('Rigour').activate(player);

    const blowpipe = new Blowpipe();
    blowpipe.inventoryLeftClick(player);

    expect(player.equipment.weapon.itemName).toEqual('Toxic Blowpipe');
    expect(player.aggro).toEqual(null);

    world.worldTick();

    world.worldTick();
    world.worldTick();
    world.worldTick();
    world.worldTick();
    world.worldTick();
    world.worldTick();
    world.worldTick();
    world.worldTick();
    world.worldTick();
    player.setAggro(jalxil);

    world.worldTick();

    world.worldTick();
    world.worldTick();
    world.worldTick();
    world.worldTick();

    expect(player.aggro).toEqual(jalxil);

    for (let i=0;i<80; i++) {
      world.worldTick();
    }
    expect(player.location).toEqual({ x: 30, y: 45 });
    expect(player.currentStats.prayer).toEqual(39);

    expect(jalxil.location).toEqual({ x: 30, y: 44});

    expect(jalxil.currentStats.hitpoint).toBe(0);

    expect(player.currentStats.hitpoint).toBe(33);


  });

});
