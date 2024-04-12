export interface XpDropAggregator {
  [key: string]: number;
}

export class XpDrop {
  skill: string;
  xp: number;
  constructor(skill: string, xp: number) {
    this.skill = skill;
    this.xp = xp;
  }
}
