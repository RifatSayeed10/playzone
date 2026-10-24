import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Flame, Trophy, Award, Gamepad2, Compass, Brain, Car, Shield, Target, ArrowRight, Zap, Star } from 'lucide-react';
import { Game, LeaderboardEntry } from '../types';
import { storage } from '../utils/storage';
import { GameCard } from '../components/common/GameCard';
import { AdBanner } from '../components/common/AdBanner';

export const HomePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>(() => storage.getGames());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => storage.getLeaderboard());

  useEffect(() => {
    const handleGamesUpdate = () => {
      setGames(storage.getGames());
    };
    const handleLbUpdate = () => {
      setLeaderboard(storage.getLeaderboard());
    };

    window.addEventListener('playzone_games_updated', handleGamesUpdate);
    window.addEventListener('playzone_leaderboard_updated', handleLbUpdate);
    return () => {
      window.removeEventListener('playzone_games_updated', handleGamesUpdate);
      window.removeEventListener('playzone_leaderboard_updated', handleLbUpdate);
    };
  }, []);

  // Featured hero game
  const heroGame = games.find((g) => g.id === 'snake') || games[0];
  const popularGames = [...games].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const newGames = [...games].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 4);

  const categoryIcons: Record<string, { icon: React.ElementType; color: string; desc: string }> = {
    'Puzzle': { icon: Target, color: 'from-purple-600 to-indigo-600', desc: 'Mind-bending riddles' },
    'Action': { icon: Zap, color: 'from-rose-600 to-orange-600', desc: 'Reflex & adrenaline' },
    'Racing': { icon: Car, color: 'from-amber-500 to-red-600', desc: 'High-speed velocity' },
    'Arcade': { icon: Gamepad2, color: 'from-cyan-500 to-blue-600', desc: 'Classic retro thrills' },
    'Adventure': { icon: Compass, color: 'from-emerald-500 to-teal-700', desc: 'Labyrinth explorations' },
    'Brain Training': { icon: Brain, color: 'from-fuchsia-600 to-pink-600', desc: 'Sharpen your memory' },
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-8 pb-12">
        {/* Ambient Neon Backlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-cyan-500/15 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-[#172033] shadow-2xl">
            {/* Background Graphic Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80"
                alt="Gaming Banner"
                className="w-full h-full object-cover object-center opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/90 to-transparent"></div>
              <div className="absolute inset-0 bg-radial-glow pointer-events-none"></div>
            </div>

            {/* Content inside Hero Banner */}
            <div className="relative p-6 sm:p-10 lg:p-16 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Featured Web Game of the Week
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-tight">
                Play Amazing Games for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400">Free!</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Discover hundreds of exciting browser games. No downloads, no installation. Just click and play directly in your browser with instant controls and high scores!
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={heroGame ? `/game/${heroGame.id}` : '/games'}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide uppercase flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" /> Play Now
                </Link>

                <Link
                  to="/games"
                  className="px-6 py-3.5 rounded-2xl bg-[#0B1020]/80 hover:bg-[#0B1020] text-slate-200 border border-slate-700/80 font-bold text-sm tracking-wide uppercase flex items-center gap-2 transition hover:border-cyan-500"
                >
                  <Compass className="w-4 h-4 text-cyan-400" /> Explore Games
                </Link>
              </div>

              {/* Quick metrics */}
              <div className="mt-8 pt-6 border-t border-slate-700/60 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="text-xl sm:text-2xl font-black font-display text-white">{games.length}+</span>
                  <span className="text-xs text-slate-400 block font-medium">Free Games</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black font-display text-cyan-300">0 MB</span>
                  <span className="text-xs text-slate-400 block font-medium">No Downloads</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black font-display text-emerald-400">100%</span>
                  <span className="text-xs text-slate-400 block font-medium">Instant Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Game Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Choose your favorite genre and jump straight into action
            </p>
          </div>
          <Link
            to="/games"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
          >
            All Genres <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {Object.entries(categoryIcons).map(([catName, info]) => {
            const Icon = info.icon;
            const count = games.filter((g) => g.category === catName).length;

            return (
              <Link
                key={catName}
                to={`/games?category=${encodeURIComponent(catName)}`}
                className="group p-4 bg-[#172033] hover:bg-[#1f2b45] border border-slate-800 hover:border-purple-500/70 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 flex flex-col items-center text-center"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${info.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {catName}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {count} {count === 1 ? 'game' : 'games'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* POPULAR GAMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Flame className="w-5 h-5 fill-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Popular Games
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Most played titles by the PlayZone community
              </p>
            </div>
          </div>
          <Link
            to="/games?sort=popular"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
          >
            View More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* ADVERTISEMENT PLACEHOLDER (Leaderboard Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner type="leaderboard" />
      </section>

      {/* NEW GAMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                New Releases
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Freshly added games ready to play instantly
              </p>
            </div>
          </div>
          <Link
            to="/games?sort=newest"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
          >
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* PREMIUM PROMOTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-purple-900/50 via-[#172033] to-cyan-950/40 border border-purple-500/40 shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 inline-block mb-3">
              Upgrade to PlayZone Premium
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white leading-tight">
              Unlock the Ultimate Ad-Free Arcade Experience
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Elevate your gameplay with uninterrupted sessions, high-definition canvas rendering, cloud-synced high scores, and VIP early access to newly published games.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                to="/premium"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 transition flex items-center gap-2"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-400">
                No credit card required · Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                High Scores & Champions
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Top records from locally playable arcade games
              </p>
            </div>
          </div>
          <Link
            to="/leaderboard"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
          >
            Full Leaderboards <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-[#172033] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#0B1020]/70 text-xs uppercase font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Rank</th>
                  <th className="px-6 py-3.5">Gamer Tag</th>
                  <th className="px-6 py-3.5">Game Title</th>
                  <th className="px-6 py-3.5">Score</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-display font-bold text-white">
                      {idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `#${idx + 1}`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                      <span>{entry.playerName}</span>
                      {entry.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {entry.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-cyan-300 font-medium">{entry.gameTitle}</td>
                    <td className="px-6 py-4 font-display font-bold text-amber-300">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
