export class Bracket {
  constructor(type) {
      this.type = type; // 'winners' or 'losers'
      this.rounds = [];
  }

  addRound(matches) {
      this.rounds.push(matches);
  }

  updateMatch(roundIndex, matchIndex, winner) {
      const round = this.rounds[roundIndex];
      if (!round || !round[matchIndex]) return false;
      const match = round[matchIndex];
      return match.updateResult(winner);
  }

  resetMatch(roundIndex, matchIndex) {
    const round = this.rounds[roundIndex];
    if (!round || !round[matchIndex]) return false;
    const match = round[matchIndex];
    match.resetResult();
    return true;
  }
}