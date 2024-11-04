import React from 'react';
import { useTournament } from '../../hooks/useTournament';
import { useMatchUpdater } from '../../hooks/useMatchUpdater';
import { useTournamentPersistence } from '../../hooks/useTournamentPersistence';

const Tournament = () => {
  const { tournament, participants, addParticipant, updateMatch, resetMatch } = useTournament({
    format: 'single',
    includePlayoff: true
  });

  const handleMatchClick = useMatchUpdater(updateMatch);
  const { loadTournament, clearTournament } = useTournamentPersistence(tournament);

  const handleAddParticipant = (e) => {
    e.preventDefault();
    const name = e.target.elements.participantName.value;
    addParticipant(name);
    e.target.reset();
  };

  const handleResetMatch = (bracketType, roundIndex, matchIndex) => {
    resetMatch(bracketType, roundIndex, matchIndex);
  };

  return (
    <div>
      <h1>Tournament</h1>
      <form onSubmit={handleAddParticipant}>
        <input type="text" name="participantName" placeholder="Add participant" />
        <button type="submit">Add</button>
      </form>
      <button onClick={loadTournament}>Load Tournament</button>
      <button onClick={clearTournament}>Clear Tournament</button>
      <div>
        {tournament && tournament.winnersBracket.map((round, roundIndex) => (
          <div key={roundIndex}>
            <h2>Round {roundIndex + 1}</h2>
            {round.map((match, matchIndex) => (
              <div key={match.id} onClick={() => handleMatchClick(match)}>
                <p>{match.player1?.name} vs {match.player2?.name}</p>
                <p>Winner: {match.winner?.name}</p>
                <button onClick={() => handleResetMatch('winners', roundIndex, matchIndex)}>Reset</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tournament;
