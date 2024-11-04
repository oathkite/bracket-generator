import { useState, useEffect } from 'react';
import { Tournament } from '../lib/tournament/core';

export const useTournament = (initialConfig = {}) => {
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [config, setConfig] = useState({
    format: initialConfig.format || 'single',
    includePlayoff: initialConfig.includePlayoff || false
  });

  useEffect(() => {
    if (participants.length > 0) {
      const newTournament = new Tournament(config);
      newTournament.setParticipants(participants);
      setTournament(newTournament);
    }
  }, [participants, config]);

  const addParticipant = (name) => {
    if (name.trim()) {
      setParticipants(prev => [...prev, name.trim()]);
    }
  };

  const updateConfig = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updateMatch = (bracketType, roundIndex, matchIndex, winner) => {
    if (!tournament) return;
    
    tournament.updateMatch(bracketType, roundIndex, matchIndex, winner);
    setTournament({ ...tournament });
  };

  return {
    tournament,
    participants,
    config,
    addParticipant,
    updateConfig,
    updateMatch
  };
};