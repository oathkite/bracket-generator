import { useEffect } from 'react';

export const useTournamentPersistence = (tournament) => {
  useEffect(() => {
    if (!tournament) return;

    // ローカルストレージに保存
    localStorage.setItem('tournament', JSON.stringify(tournament));
  }, [tournament]);

  return {
    loadTournament: () => {
      const saved = localStorage.getItem('tournament');
      return saved ? JSON.parse(saved) : null;
    },
    clearTournament: () => {
      localStorage.removeItem('tournament');
    }
  };
};