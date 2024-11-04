import { useCallback } from 'react';

export const useMatchUpdater = (updateMatch) => {
  const handleMatchClick = useCallback((match) => {
    if (!match.player1 || !match.player2 || match.bye) return;

    const winner = match.winner === match.player1 ? match.player2 : match.player1;
    updateMatch(match.bracketType, match.round, match.index, winner);
  }, [updateMatch]);

  return handleMatchClick;
};