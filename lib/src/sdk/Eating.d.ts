import { Potion } from "./gear/Potion";
import { Food } from "./gear/Food";
import { Karambwan } from "../content/items/Karambwan";
import { Player } from "./Player";
export declare class Eating {
    player: Player;
    foodDelay: number;
    potionDelay: number;
    comboDelay: number;
    currentFood: Food;
    currentPotion: Potion;
    currentComboFood: Karambwan;
    redemptioned: boolean;
    tickFood(player: Player): void;
    checkRedemption(player: Player): void;
    canEatFood(): boolean;
    canDrinkPotion(): boolean;
    canEatComboFood(): boolean;
    eatFood(food: Food): void;
    drinkPotion(potion: Potion): boolean;
    eatComboFood(karambwan: Karambwan): void;
}
