import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Maximize2, Minimize2, Share2, Star, Eye, ShieldCheck, Trophy, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { Game } from '../types';
import { storage } from '../utils/storage';
import { SnakeGame } from '../components/games/SnakeGame';
import { BreakoutGame } from '../components/games/BreakoutGame';
import { TicTacToeGame } from '../components/games/TicTacToeGame';
import { MemoryMatchGame } from '../components/games/MemoryMatchGame';
import { NumberPuzzleGame } from '../components/games/NumberPuzzleGame';
import { SpeedRacerGame } from '../components/games/SpeedRacerGame';
import { ExternalGameRunner } from '../components/games/ExternalGameRunner';
import { GameCard } from '../components/common/GameCard';
import { AdBanner } from '../components/common/AdBanner';

export const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | undefined>(() => (id ? storage.getGameById(id) : undefined));
  const [allGames, setAllGames] = useState<Game[]>(() => storage.getGames());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (id) {
      const found = storage.getGameById(id);
      setGame(found);
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    const handleUpdate = () => {
      if (id) setGame(storage.getGameById(id));
      setAllGames(storage.getGames());
    };
    window.addEventListener('playzone_games_updated', handleUpdate);
    return () => window.removeEventListener('playzone_games_updated', handleUpdate);
  }, [id]);

  const toggleFullscreen = () => {
    if (!gameAreaRef.current) return;

    if (!document.fullscreenElement) {
      gameAreaRef.current.requestFullscreen?.().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold font-display text-white mb-2">Game Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested game does not exist or was removed.
        </p>
        <Link
          to="/games"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Game Library
        </Link>
      </div>
    );
  }

  // Related games from same category, excluding current
  const relatedGames = allGames
    .filter((g) => g.id !== game.id && (g.category === game.category || g.featured))
    .slice(0, 3);

  // Render game component based on id / gameType
  const renderGameContent = () => {
    if (game.gameType === 'external' && game.gameUrl) {
      return <ExternalGameRunner gameUrl={game.gameUrl} gameTitle={game.title} />;
    }

    switch (game.id) {
      case 'snake':
        return <SnakeGame />;
      case 'breakout':
        return <BreakoutGame />;
      case 'tic-tac-toe':
        return <TicTacToeGame />;
      case 'memory-match':
        return <MemoryMatchGame />;
      case 'number-puzzle':
        return <NumberPuzzleGame />;
      case 'speed-racer':
        return <SpeedRacerGame />;
      default:
        // Default fallback to Snake if unknown id
        return <SnakeGame />;
    }
  };

  const personalBest = storage.getPersonalHighScore(game.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/games" className="hover:text-white transition">Games</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to={`/games?category=${encodeURIComponent(game.category)}`} className="hover:text-white transition">
          {game.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-cyan-400 font-medium truncate max-w-[200px]">{game.title}</span>
      </nav>

      {/* Main Game Stage + Title Bar */}
      <div className="space-y-4">
        {/* Title Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#172033] border border-slate-700/60 p-4 sm:p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3.5">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-14 h-14 rounded-xl object-cover border border-purple-500/40 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black font-display text-white">
                  {game.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {game.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {game.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Eye className="w-3.5 h-3.5" /> {game.playsCount.toLocaleString()} plays
                </span>
                {personalBest > 0 && (
                  <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                    <Trophy className="w-3.5 h-3.5" /> High Score: {personalBest}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Toolbar: Share & Fullscreen */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleShare}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              title="Copy share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Playable Game Area Wrapper */}
        <div
          ref={gameAreaRef}
          className={`w-full bg-[#0B1020] border border-slate-800 rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-center relative shadow-2xl ${
            isFullscreen ? 'h-screen w-screen p-4 justify-center items-center' : ''
          }`}
        >
          {renderGameContent()}
        </div>
      </div>

      {/* Game Details, Instructions & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description & Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Game Card */}
          <div className="bg-[#172033] border border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold font-display text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> About {game.title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {game.description}
            </p>

            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
              How to Play & Objective
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {game.instructions.map((inst, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Controls Card */}
          <div className="bg-[#172033] border border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Game Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0B1020] p-4 rounded-xl border border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Desktop Controls</span>
                <p className="text-sm font-semibold text-white">{game.controls.desktop}</p>
              </div>
              <div className="bg-[#0B1020] p-4 rounded-xl border border-slate-800">
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Mobile / Touch</span>
                <p className="text-sm font-semibold text-white">{game.controls.mobile}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Sidebar Ad & Game Specs */}
        <div className="space-y-6">
          {/* Ad Placeholder separate from controls */}
          <AdBanner type="rectangle" />

          {/* Game Quick Specs */}
          <div className="bg-[#172033] border border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-4">
              Game Information
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Category</span>
                <span className="text-white font-semibold">{game.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Release Date</span>
                <span className="text-white font-semibold">{game.dateAdded}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Platform</span>
                <span className="text-white font-semibold">Web (HTML5 Canvas)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Installation</span>
                <span className="text-emerald-400 font-semibold">None (Instant Play)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Developer</span>
                <span className="text-cyan-400 font-semibold">PlayZone Studios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED GAMES SECTION */}
      {relatedGames.length > 0 && (
        <section className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black font-display text-white">
              Related Games You May Like
            </h3>
            <Link
              to={`/games?category=${encodeURIComponent(game.category)}`}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
            >
              More in {game.category}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedGames.map((rg) => (
              <GameCard key={rg.id} game={rg} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
