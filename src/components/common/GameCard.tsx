import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Flame, Eye } from 'lucide-react';
import { Game } from '../../types';

interface GameCardProps {
  game: Game;
  priority?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <div className="group relative bg-[#172033] border border-slate-700/60 hover:border-purple-500/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/15 flex flex-col h-full">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#172033] via-transparent to-black/30"></div>

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
            {game.category}
          </span>
        </div>

        {/* Featured Badge */}
        {game.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md">
            <Flame className="w-3 h-3 fill-current" /> Hot
          </div>
        )}

        {/* Hover Quick Play Overlay */}
        <div className="absolute inset-0 bg-purple-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/game/${game.id}`}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/50 transform group-hover:scale-110 transition-transform"
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" /> {game.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <Eye className="w-3 h-3" /> {game.playsCount.toLocaleString()} plays
            </span>
          </div>

          <Link to={`/game/${game.id}`}>
            <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {game.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Bottom Button */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
          <span className="text-[11px] font-medium text-purple-400">Instant Web Play</span>
          <Link
            to={`/game/${game.id}`}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-purple-500/20 transition"
          >
            <Play className="w-3 h-3 fill-current" /> Play Now
          </Link>
        </div>
      </div>
    </div>
  );
};
