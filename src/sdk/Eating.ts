"use strict";
import { Potion } from "./gear/Potion";
import { Food } from "./gear/Food";
import { Karambwan } from "../content/items/Karambwan";
import { Player } from "./Player";

export class Eating {
  player: Player;
  foodDelay = 0;
  potionDelay = 0;
  comboDelay = 0;

  currentFood: Food;
  currentPotion: Potion;
  currentComboFood: Karambwan;
  redemptioned = false;

  tickFood(player: Player) {
    this.foodDelay--;
    this.potionDelay--;
    this.comboDelay--;
    if (this.currentFood) {
      this.currentFood.eat(player);
      player.attackDelay += 3;
      this.currentFood = null;
    }
    if (this.currentPotion) {
      this.currentPotion.drink(player);
      this.currentPotion = null;
    }
    if (this.currentComboFood) {
      this.currentComboFood.eat(player);
      player.attackDelay += 3;
      this.currentComboFood = null;
    }
  }

  checkRedemption(player: Player) {
    if (this.redemptioned) {
      player.currentStats.prayer = 0;
      player.currentStats.hitpoint += Math.floor(player.stats.prayer / 4);
      this.redemptioned = false;
    }
  }

  canEatFood(): boolean {
    return this.foodDelay <= 0;
  }

  canDrinkPotion(): boolean {
    return this.potionDelay <= 0;
  }

  canEatComboFood(): boolean {
    return this.comboDelay <= 0;
  }

  // The weird way that the lower tiers also eat the higher tiers forces the behavior of food -> potion -> karambwan
  eatFood(food: Food) {
    if (!this.canEatFood()) {
      return;
    }
    this.currentFood = food || null;
    this.foodDelay = 3;
    if (this.currentFood) {
      this.currentFood.consumeItem(this.player);
    }
  }

  drinkPotion(potion: Potion) {
    if (!this.canDrinkPotion()) {
      return false;
    }
    this.currentPotion = potion || null;
    this.foodDelay = 3;
    this.potionDelay = 3;
    if (this.currentPotion) {
      this.currentPotion.doses--;
    }
    return true;
  }

  eatComboFood(karambwan: Karambwan) {
    if (!this.canEatComboFood()) {
      return;
    }
    this.foodDelay = 3;
    this.potionDelay = 3;
    this.currentComboFood = karambwan || null;
    this.comboDelay = 3;
    if (this.currentComboFood) {
      this.currentComboFood.consumeItem(this.player);
    }
  }
}
