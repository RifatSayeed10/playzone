import React, { useState } from 'react';
import { Sparkles, Check, Shield, Zap, Crown, Flame, Star, Bell } from 'lucide-react';

export const PremiumPage: React.FC = () => {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setJoined(true);
      setWaitlistEmail('');
    }
  };

  const perks = [
    { title: '100% Ad-Free Gaming', desc: 'No banner overlays, sidebar interruptions, or pre-roll sponsor blocks.' },
    { title: 'Ultra HD 120 FPS Rendering', desc: 'Hardware-accelerated high-refresh rate canvas rendering on supported displays.' },
    { title: 'Global Cloud High Score Sync', desc: 'Sync and access your records across any phone, laptop, or desktop browser.' },
    { title: 'Exclusive Alpha Game Releases', desc: 'Play upcoming browser games 14 days before their public launch.' },
    { title: 'Custom Cyber Skins & Avatars', desc: 'Unlock neon cosmetics and custom trail colors for Snake and Breakout.' },
    { title: 'VIP Community Discord Status', desc: 'Direct access to developer lab playtests and community tournament rooms.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 text-amber-400" /> PlayZone Premium Pass
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
          Level Up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-amber-300">PlayZone Prime</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          The definitive browser arcade subscription. Designed for competitive gamers who demand lightning-fast speeds and zero advertisement interruptions.
        </p>
      </div>

      {/* Pricing / Plan Card (Notice: Coming Soon, no real payment) */}
      <div className="max-w-lg mx-auto bg-gradient-to-b from-[#1f2b45] to-[#172033] border-2 border-purple-500/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          COMING SOON
        </div>

        <div className="text-left mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Prime Pass</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl sm:text-5xl font-black font-display text-white">$0.00</span>
            <span className="text-slate-400 text-xs">/ Free Beta Preview</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Payment processing is deactivated during the academic testing phase. Join the early access waitlist below!
          </p>
        </div>

        {/* Perks list */}
        <div className="space-y-3.5 pt-4 border-t border-slate-700/60 mb-8">
          {perks.map((perk, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">{perk.title}</span>
                <span className="text-[11px] text-slate-400 block">{perk.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Waitlist Form */}
        {joined ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> You're on the early access VIP waitlist!
          </div>
        ) : (
          <form onSubmit={handleJoinWaitlist} className="space-y-3">
            <input
              type="email"
              required
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="Enter your email to join waitlist..."
              className="w-full px-4 py-3 bg-[#0B1020] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" /> Join Free Beta Waitlist
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
