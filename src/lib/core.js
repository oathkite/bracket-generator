export class Tournament {
  constructor(config) {
    this.participants = [];
    this.seeds = new Map();
    this.format = config.format || 'single';
    this.includePlayoff = config.includePlayoff || false;
    this.winnersBracket = [];
    this.losersBracket = [];
    this.playoffMatches = [];
    this.completed = false;
  }

  setParticipants(participants, seedInfo = {}) {
    this.participants = this.normalizeParticipants(participants);
    Object.entries(seedInfo).forEach(([player, seed]) => {
      this.seeds.set(player, seed);
    });
    this.participants = this.arrangeBySeeds(this.participants);
    this.generateBrackets();
  }

  normalizeParticipants(participants) {
    const count = participants.length;
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(count)));
    const normalized = [...participants];
    while (normalized.length < nextPowerOfTwo) {
      normalized.push('bye');
    }
    return normalized;
  }

  arrangeBySeeds(participants) {
    return participants.sort((a, b) => {
      const seedA = this.seeds.get(a) || Number.MAX_VALUE;
      const seedB = this.seeds.get(b) || Number.MAX_VALUE;
      return seedA - seedB;
    });
  }

  generateBrackets() {
    this.generateWinnersBracket();
    if (this.format === 'double') {
      this.generateLosersBracket();
    }
    if (this.includePlayoff) {
      this.generatePlayoffMatches();
    }
  }

  generateWinnersBracket() {
    let currentRound = this.generateFirstRound(this.participants);
    this.winnersBracket.push(currentRound);

    while (currentRound.length > 1) {
      currentRound = this.generateNextRound(currentRound, 'winners');
      this.winnersBracket.push(currentRound);
    }
  }

  generateFirstRound(players) {
    const matches = [];
    for (let i = 0; i < players.length; i += 2) {
      const match = {
        id: `R1-M${matches.length + 1}`,
        player1: players[i],
        player2: players[i + 1],
        winner: null,
        loser: null,
        bye: players[i] === 'bye' || players[i + 1] === 'bye'
      };

      if (match.bye) {
        match.winner = match.player1 === 'bye' ? match.player2 : match.player1;
        match.loser = match.player1 === 'bye' ? match.player1 : match.player2;
      }

      matches.push(match);
    }
    return matches;
  }

  generateNextRound(previousRound, bracketType) {
    const matches = [];
    for (let i = 0; i < previousRound.length; i += 2) {
      matches.push({
        id: `${bracketType}-R${this.winnersBracket.length + 1}-M${matches.length + 1}`,
        player1: null,
        player2: null,
        winner: null,
        loser: null,
        bye: false
      });
    }
    return matches;
  }

  generateLosersBracket() {
    this.losersBracket = [];
    const totalRounds = Math.log2(this.participants.length);
    for (let i = 0; i < totalRounds * 2 - 1; i++) {
      this.losersBracket.push([]);
    }
  }

  generatePlayoffMatches() {
    this.playoffMatches = [{
        round: 'thirdPlace',
      player1: null,
      player2: null,
      winner: null,
      loser: null
    }];
  }

  updateMatch(bracketType, roundIndex, matchIndex, winner) {
    let bracket = this.winnersBracket;
    if (bracketType === 'losers') bracket = this.losersBracket;
    
    const match = bracket[roundIndex][matchIndex];
    if (!match) return false;

    match.winner = winner;
    match.loser = winner === match.player1 ? match.player2 : match.player1;

    // 次のラウンドへの進出処理
    if (bracket[roundIndex + 1]) {
      if (!bracket[roundIndex + 1][Math.floor(matchIndex / 2)]) {
        bracket[roundIndex + 1][Math.floor(matchIndex / 2)] = {};
      }
      const nextMatch = bracket[roundIndex + 1][Math.floor(matchIndex / 2)];
      if (nextMatch) {
        if (matchIndex % 2 === 0) {
          nextMatch.player1 = winner;
        } else {
          nextMatch.player2 = winner;
        }
      }
    }

    return true;
  }
}
