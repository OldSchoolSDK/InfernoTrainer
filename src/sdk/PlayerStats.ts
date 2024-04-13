"use strict";
import { UnitStats } from "./Unit";

export function SerializePlayerStats(stats: PlayerStats): string {
  return JSON.stringify(stats);
}

export function DeserializePlayerStats(serializedStats: string): PlayerStats {
  const stats = JSON.parse(serializedStats) || {};
  stats.attack = stats.attack || 99;
  stats.strength = stats.strength || 99;
  stats.defence = stats.defence || 99;
  stats.range = stats.range || 99;
  stats.magic = stats.magic || 99;
  stats.hitpoint = stats.hitpoint || 99;
  stats.agility = stats.agility || 99;
  stats.prayer = stats.prayer || 99;
  stats.run = stats.run || 10000;
  stats.specialAttack = stats.specialAttack || 100;
  return stats;
}

export interface PlayerStats extends UnitStats {
  agility: number;
  run: number;
  specialAttack: number;
}
