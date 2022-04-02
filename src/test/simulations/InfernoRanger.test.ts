

import { JalXil } from '../../content/inferno/js/mobs/JalXil';
import { Player } from '../../sdk/Player';
import { World } from '../../sdk/World';
import { Blowpipe } from '../../content/weapons/Blowpipe';
import { TwistedBow } from '../../content/weapons/TwistedBow';


import { TestRegion60x60, setupTests } from '../utils/TestUtils';

setupTests();




describe('basic combat', () => {

  test('...', () => {

    const region = new TestRegion60x60();
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
    const jalxil = new JalXil(world, { x: 25, y: 25}, { aggro: player });
    world.region.addMob(jalxil)

    world.worldTick(30);
    player.prayerController.findPrayerByName('Protect from Range').activate(player);
    player.setAggro(jalxil)
    world.worldTick(20);
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

    world.worldTick(10);
    player.setAggro(jalxil);
    world.worldTick(5);
    expect(player.aggro).toEqual(jalxil);

    world.worldTick(80);
    expect(player.location).toEqual({ x: 30, y: 45 });
    expect(player.currentStats.prayer).toEqual(39);
    expect(jalxil.location).toEqual({ x: 30, y: 44});
    expect(jalxil.currentStats.hitpoint).toBe(0);
    expect(player.currentStats.hitpoint).toBe(33);
    expect(world.tickCounter).toBe(145)
  });

});
