import { Match } from './match';

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
      normalized.push({ id: 'bye', name: 'bye' });
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
    return players.reduce((matches, player, index) => {
      if (index % 2 === 0) {
        const match = new Match({
          id: `R1-M${matches.length + 1}`,
          player1: player,
          player2: players[index + 1],
          bye: player === 'bye' || players[index + 1] === 'bye',
          round: 1,
          bracketType: 'winners',
          index: matches.length
        });

        if (match.bye) {
          match.updateResult(match.player1 === 'bye' ? match.player2 : match.player1);
        }

        matches.push(match);
      }
      return matches;
    }, []);
  }

  generateNextRound(previousRound, bracketType) {
    return previousRound.reduce((matches, _, index) => {
      if (index % 2 === 0) {
        matches.push(new Match({
          id: `${bracketType}-R${this.winnersBracket.length + 1}-M${matches.length + 1}`,
          player1: null,
          player2: null,
          round: this.winnersBracket.length + 1,
          bracketType: bracketType,
          index: matches.length
        }));
      }
      return matches;
    }, []);
  }

  generateLosersBracket() {
    this.losersBracket = Array.from({ length: Math.log2(this.participants.length) * 2 - 1 }, () => []);
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
    const bracket = this.getBracket(bracketType);
    const match = bracket[roundIndex]?.[matchIndex];
    if (!match) return false;

    const result = match.updateResult(winner);
    if (!result.success) return false;

    this.advanceToNextRound(bracket, roundIndex, matchIndex, winner);
    return true;
  }

  resetMatch(bracketType, roundIndex, matchIndex) {
    const bracket = this.getBracket(bracketType);
    const match = bracket[roundIndex]?.[matchIndex];
    if (!match) return false;

    match.resetResult();
    this.resetNextRound(bracket, roundIndex, matchIndex);
    return true;
  }

  getBracket(bracketType) {
    return bracketType === 'losers' ? this.losersBracket : this.winnersBracket;
  }

  advanceToNextRound(bracket, roundIndex, matchIndex, winner) {
    const nextMatch = bracket[roundIndex + 1]?.[Math.floor(matchIndex / 2)];
    if (nextMatch) {
      if (matchIndex % 2 === 0) {
        nextMatch.player1 = winner;
      } else {
        nextMatch.player2 = winner;
      }
    }
  }

  resetNextRound(bracket, roundIndex, matchIndex) {
    const nextMatch = bracket[roundIndex + 1]?.[Math.floor(matchIndex / 2)];
    if (nextMatch) {
      if (matchIndex % 2 === 0) {
        nextMatch.player1 = null;
      } else {
        nextMatch.player2 = null;
      }
    }
  }
}
