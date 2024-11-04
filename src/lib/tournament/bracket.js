export class Bracket {
  constructor(type) {
      this.type = type; // 'winners' or 'losers'
      this.rounds = [];
  }

  addRound(matches) {
      this.rounds.push(matches);
  }

  updateMatch(roundIndex, matchIndex, winner) {
      const match = this.rounds[roundIndex][matchIndex];
      if (!match) return false;
      return match.updateResult(winner);
  }
}