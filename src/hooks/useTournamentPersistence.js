import { useEffect } from 'react';

export const useTournamentPersistence = (tournament) => {
  useEffect(() => {
    if (tournament) {
      localStorage.setItem('tournament', JSON.stringify(tournament));
    }
  }, [tournament]);

  const loadTournament = () => {
    const saved = localStorage.getItem('tournament');
    return saved ? JSON.parse(saved) : null;
  };

  const clearTournament = () => {
    localStorage.removeItem('tournament');
  };

  return {
    loadTournament,
    clearTournament
  };
};