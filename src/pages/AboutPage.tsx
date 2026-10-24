import React from 'react';
import { Gamepad2, Code, Sparkles, ShieldCheck, Zap, Globe, Cpu, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> University Web Engineering Lab Project
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
          About PlayZone
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          PlayZone is an interactive, high-performance browser gaming platform built to deliver instantaneous, zero-install entertainment with responsive controls and authentic arcade engineering.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#172033] border border-slate-700/60 rounded-2xl shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">Instant Web Play</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero plugins, zero downloads, zero setup. Every game runs directly within standard HTML5 Canvas and modern browser JavaScript engines.
          </p>
        </div>

        <div className="p-6 bg-[#172033] border border-slate-700/60 rounded-2xl shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">Native Web Audio</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Synthesized 8-bit chimes, collision sounds, and victory fanfares generated natively via the Web Audio API without bulky audio file downloads.
          </p>
        </div>

        <div className="p-6 bg-[#172033] border border-slate-700/60 rounded-2xl shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">Safe & Sandboxed</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rigorous sandboxing for embedded titles, local high-score persistence, and seamless desktop and mobile touch controls.
          </p>
        </div>
      </div>

      {/* Academic Tech Stack Section */}
      <div className="p-8 bg-[#172033] border border-slate-700/60 rounded-3xl shadow-xl">
        <h2 className="text-xl sm:text-2xl font-black font-display text-white mb-4 flex items-center gap-2">
          <Code className="w-6 h-6 text-purple-400" /> Architecture & Technology Stack
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Designed and developed as a comprehensive Web Engineering laboratory project showcasing modern full-stack web architectural standards:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-[#0B1020] rounded-xl border border-slate-800">
            <strong className="text-purple-400 block mb-1">Frontend Core</strong>
            <span className="text-slate-300">React 19 & TypeScript</span>
          </div>
          <div className="p-3.5 bg-[#0B1020] rounded-xl border border-slate-800">
            <strong className="text-cyan-400 block mb-1">Styling System</strong>
            <span className="text-slate-300">Tailwind CSS (v4)</span>
          </div>
          <div className="p-3.5 bg-[#0B1020] rounded-xl border border-slate-800">
            <strong className="text-emerald-400 block mb-1">Graphics & Game Loop</strong>
            <span className="text-slate-300">HTML5 Canvas (60 FPS)</span>
          </div>
          <div className="p-3.5 bg-[#0B1020] rounded-xl border border-slate-800">
            <strong className="text-amber-400 block mb-1">Persistence</strong>
            <span className="text-slate-300">LocalStorage CRUD Engine</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Ready to explore? Jump right into the gaming library or test the admin control system.
          </div>
          <div className="flex gap-3">
            <Link
              to="/games"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow"
            >
              Browse Games
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
