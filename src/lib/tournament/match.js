export class Match {
  constructor(config) {
      this.id = config.id;
      this.player1 = config.player1 || null;
      this.player2 = config.player2 || null;
      this.winner = null;
      this.loser = null;
      this.bye = config.bye || false;
      this.round = config.round;
      this.bracketType = config.bracketType;
      this.index = config.index;
  }

  updateResult(winner) {
      if (!this.player1 || !this.player2 || this.bye) return false;
      this.winner = winner;
      this.loser = winner === this.player1 ? this.player2 : this.player1;
      return {
        success: true,
        bracketType: this.bracketType,
        round: this.round,
        index: this.index,
        winner: this.winner,
        loser: this.loser
      };
  }

  resetResult() {
    this.winner = null;
    this.loser = null;
  }
}