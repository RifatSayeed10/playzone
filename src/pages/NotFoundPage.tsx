import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="relative inline-block">
          <span className="font-display font-black text-8xl sm:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400">
            404
          </span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-[#172033] border border-purple-500/40 text-purple-400">
            <Gamepad2 className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Level Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            The page you're searching for vanished into the arcade void or has been relocated to another sector.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition hover:scale-105"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            to="/games"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700"
          >
            <Compass className="w-4 h-4 text-cyan-400" /> Explore Games
          </Link>
        </div>
      </div>
    </div>
  );
};
