import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ShieldCheck, Heart, Github, Twitter, Youtube, Twitch, Trophy, Zap, Mail } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../utils/storage';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080C18] border-t border-slate-800/80 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-white">
                PLAY<span className="text-cyan-400">ZONE</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-5">
              The premier free browser gaming destination. Enjoy instant playable HTML5 games with zero installation, responsive controls, and competitive local leaderboards.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#social"
                onClick={(e) => e.preventDefault()}
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-xl bg-[#172033] hover:bg-purple-600 hover:text-white border border-slate-800 flex items-center justify-center transition text-slate-400"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social"
                onClick={(e) => e.preventDefault()}
                aria-label="Discord / Twitch"
                className="w-9 h-9 rounded-xl bg-[#172033] hover:bg-purple-600 hover:text-white border border-slate-800 flex items-center justify-center transition text-slate-400"
              >
                <Twitch className="w-4 h-4" />
              </a>
              <a
                href="#social"
                onClick={(e) => e.preventDefault()}
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-[#172033] hover:bg-rose-600 hover:text-white border border-slate-800 flex items-center justify-center transition text-slate-400"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#social"
                onClick={(e) => e.preventDefault()}
                aria-label="GitHub Repository"
                className="w-9 h-9 rounded-xl bg-[#172033] hover:bg-slate-700 hover:text-white border border-slate-800 flex items-center justify-center transition text-slate-400"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {DEFAULT_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/games?category=${encodeURIComponent(cat)}`}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    {cat} Games
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-400" /> Discover
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/games" className="hover:text-cyan-300 transition-colors">
                  All Games Library
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-cyan-300 transition-colors">
                  Global Leaderboards
                </Link>
              </li>
              <li>
                <Link to="/premium" className="hover:text-cyan-300 transition-colors">
                  PlayZone Premium
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-cyan-300 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-300 transition-colors">
                  About the Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Legal & Help
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-cyan-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-300 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li className="pt-2">
                <span className="text-xs text-slate-500 block">Web Engineering Lab Project</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live & Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PlayZone Gaming Portal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition">Terms</Link>
            <Link to="/contact" className="hover:text-slate-400 transition">Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
