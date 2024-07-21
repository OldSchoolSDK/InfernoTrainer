// src/domain/events/player/PlayerCreated.ts
import { Player } from "../../../sdk/Player";
import { Region } from "../../../sdk/Region";

export class PlayerCreated {
  player: Player;
  region: Region;

  constructor(player: Player, region: Region) {
    this.player = player;
    this.region = region;
  }
}