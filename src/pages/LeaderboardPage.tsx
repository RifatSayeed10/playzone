import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Filter, RotateCcw, Trash2, Sparkles } from 'lucide-react';
import { LeaderboardEntry, Game } from '../types';
import { storage } from '../utils/storage';
import { AdBanner } from '../components/common/AdBanner';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => storage.getLeaderboard());
  const [games, setGames] = useState<Game[]>(() => storage.getGames());
  const [selectedGameId, setSelectedGameId] = useState<string>('all');

  useEffect(() => {
    const handleUpdate = () => {
      setEntries(storage.getLeaderboard());
      setGames(storage.getGames());
    };
    window.addEventListener('playzone_leaderboard_updated', handleUpdate);
    return () => window.removeEventListener('playzone_leaderboard_updated', handleUpdate);
  }, []);

  const filteredEntries = selectedGameId === 'all'
    ? entries
    : entries.filter((e) => e.gameId === selectedGameId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5" /> High Scores Hall of Fame
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
          PlayZone Leaderboards
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Real-time rankings and legendary records from our playable HTML5 arcade games.
        </p>
      </div>

      {/* Filter Tabs by Game */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedGameId('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            selectedGameId === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'bg-[#172033] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Games
        </button>
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGameId(g.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              selectedGameId === g.id
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                : 'bg-[#172033] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {g.title}
          </button>
        ))}
      </div>

      {/* Top 3 Podium Cards */}
      {filteredEntries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 max-w-4xl mx-auto">
          {/* 2nd Place */}
          <div className="bg-[#172033] border border-slate-700/60 rounded-2xl p-6 text-center order-2 md:order-1 relative overflow-hidden">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-700/80 flex items-center justify-center text-slate-300 font-bold text-xl border border-slate-500">
              🥈
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">2nd Place</span>
            <h3 className="text-lg font-bold text-white mt-1">{filteredEntries[1]?.playerName}</h3>
            <span className="text-xs text-cyan-400 block mb-2">{filteredEntries[1]?.gameTitle}</span>
            <span className="text-2xl font-black font-display text-slate-200">
              {filteredEntries[1]?.score.toLocaleString()}
            </span>
          </div>

          {/* 1st Place Champion */}
          <div className="bg-gradient-to-b from-[#1f2b45] to-[#172033] border-2 border-amber-400/80 rounded-2xl p-6 text-center order-1 md:order-2 shadow-xl shadow-amber-500/10 relative -translate-y-2">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
              👑
            </div>
            <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">Champion</span>
            <h3 className="text-xl font-black text-white mt-1">{filteredEntries[0]?.playerName}</h3>
            <span className="text-xs text-cyan-300 block mb-2">{filteredEntries[0]?.gameTitle}</span>
            <span className="text-3xl font-black font-display text-amber-300">
              {filteredEntries[0]?.score.toLocaleString()}
            </span>
          </div>

          {/* 3rd Place */}
          <div className="bg-[#172033] border border-slate-700/60 rounded-2xl p-6 text-center order-3 md:order-3 relative overflow-hidden">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-900/40 flex items-center justify-center text-amber-500 font-bold text-xl border border-amber-700">
              🥉
            </div>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">3rd Place</span>
            <h3 className="text-lg font-bold text-white mt-1">{filteredEntries[2]?.playerName}</h3>
            <span className="text-xs text-cyan-400 block mb-2">{filteredEntries[2]?.gameTitle}</span>
            <span className="text-2xl font-black font-display text-slate-200">
              {filteredEntries[2]?.score.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-[#172033] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B1020]/80 text-xs uppercase font-semibold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Gamer Tag</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">High Score</th>
                <th className="px-6 py-4">Date Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredEntries.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-display font-bold text-white">
                    {idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `#${idx + 1}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white mr-2">{entry.playerName}</span>
                    {entry.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {entry.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-cyan-300 font-medium">{entry.gameTitle}</td>
                  <td className="px-6 py-4 font-display font-bold text-amber-300 text-base">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdBanner type="banner" />
    </div>
  );
};
