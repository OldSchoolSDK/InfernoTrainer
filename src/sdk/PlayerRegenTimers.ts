"use strict";

import { Player } from "./Player";

export class PlayerRegenTimer {
  player: Player;
  spec: number;
  hitpoint: number;

  constructor(player: Player) {
    this.player = player;
    this.spec = 50;
    this.hitpoint = 100;
  }

  specUsed() {
    if (this.spec <= 0) {
      this.spec = 50;
    }
  }

  regen() {
    this.specRegen();
    this.hitpointRegen();
  }

  specRegen() {
    this.spec--;
    if (this.spec === 0) {
      this.spec = 50;
      this.player.currentStats.specialAttack += 10;
      this.player.currentStats.specialAttack = Math.min(100, this.player.currentStats.specialAttack);
    }
  }

  hitpointRegen() {
    this.hitpoint--;
    if (this.hitpoint === 0) {
      this.hitpoint = 100;
      this.player.currentStats.hitpoint++;
      this.player.currentStats.hitpoint = Math.min(this.player.stats.hitpoint, this.player.currentStats.hitpoint);
    }
  }
}
