
export class XpDrop {
  constructor(skill, xp){
    this.skill = skill;
    this.xp = xp; // Actual game allows precise-ish XP gains, but it only rounds on display
    // Fix this once we have actual stats / xp 
  }
}