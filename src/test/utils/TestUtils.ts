import { Random } from "../../sdk/Random";
import { Region } from "../../sdk/Region"
import { Settings } from "../../sdk/Settings";

export function setupTests() {
    jest.mock('../../sdk/utils/ImageLoader');
    jest.mock('../../sdk/XpDropController', () => {
    return {
        'XpDropController': {
        controller: {
            registerXpDrop: jest.fn()
        }
        }
    }
    });

    jest.mock('../../sdk/MapController', () => {
    return {
        'MapController' : null
    }
    })

    jest.spyOn(document, 'getElementById').mockImplementation((elementId: string) => {
        const c = document.createElement('canvas');
        c.ariaLabel = elementId;
    return c;
    });

    
    Random.setRandom(() => {
    Random.memory = (Random.memory + 13.37) % 180;
    return Math.abs(Math.sin(Random.memory * 0.0174533));
  });
  
  Settings.readFromStorage();

}

export class TestRegion60x60 extends Region {
    get width (): number {
      return 60
    }
  
    get height (): number {
      return 60
    }
  }
