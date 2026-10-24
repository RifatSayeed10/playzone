import React, { useState } from 'react';
import { Trophy, Award, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storage } from '../../utils/storage';
import { sound } from '../../utils/audio';

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  gameTitle: string;
  score: number;
  onScoreSubmitted?: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  onClose,
  gameId,
  gameTitle,
  score,
  onScoreSubmitted,
}) => {
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('playzone_player_nickname') || '';
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = playerName.trim() || 'Anonymous Player';
    localStorage.setItem('playzone_player_nickname', name);

    storage.addLeaderboardScore({
      gameId,
      gameTitle,
      playerName: name,
      score,
      badge: score >= 500 ? '🔥 Cyber Elite' : score >= 200 ? '⭐ Pro Gamer' : '🎮 Arcade Novice',
    });

    sound.playWin();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    if (onScoreSubmitted) onScoreSubmitted();

    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#172033] border border-purple-500/40 rounded-2xl p-6 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Trophy className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold font-display text-white mb-1">
          {score > 0 ? 'Game Complete!' : 'Nice Attempt!'}
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          {gameTitle}
        </p>

        <div className="bg-[#0B1020] border border-slate-700/60 rounded-xl p-4 mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Final Score</div>
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {score.toLocaleString()}
          </div>
        </div>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 py-3 text-emerald-400 font-semibold">
            <Check className="w-5 h-5" /> Saved to Leaderboard!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nickname" className="block text-xs text-left text-slate-300 font-medium mb-1.5">
                Enter your gamer tag for the Leaderboard:
              </label>
              <input
                id="nickname"
                type="text"
                maxLength={20}
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. CyberViper, PixelKing"
                className="w-full px-4 py-2.5 bg-[#0B1020] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition"
              >
                Skip
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold rounded-xl text-sm shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" /> Save Score
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
