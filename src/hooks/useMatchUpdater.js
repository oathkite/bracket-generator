import { useCallback } from 'react';

export const useMatchUpdater = (updateMatch) => {
  const handleMatchClick = useCallback((match) => {
    if (match.player1 && match.player2 && !match.bye) {
      const winner = match.winner === match.player1 ? match.player2 : match.player1;
      const result = updateMatch(match.bracketType, match.round, match.index, winner);
      if (result && result.success) {
        console.log(`Match updated successfully: ${match.id}`);
        // 必要に応じて追加の処理をここに記述
      }
    }
  }, [updateMatch]);

  return handleMatchClick;
};