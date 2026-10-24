import React from 'react';
import { ExternalLink, Sparkles, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdBannerProps {
  type?: 'leaderboard' | 'rectangle' | 'banner' | 'sidebar';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type = 'banner', className = '' }) => {
  if (type === 'rectangle') {
    return (
      <div className={`flex flex-col items-center justify-center p-4 bg-[#172033]/80 border border-slate-700/60 rounded-2xl relative overflow-hidden group shadow-lg ${className}`}>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[10px] text-slate-400 font-mono tracking-wider uppercase">
          <Info className="w-2.5 h-2.5" /> Ad
        </div>
        <div className="text-center my-3">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold text-slate-200 block uppercase tracking-wide">PlayZone Prime</span>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
            Enjoy 100% ad-free gameplay & early access to new releases!
          </p>
          <Link
            to="/premium"
            className="mt-3 inline-block px-3 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            Upgrade Ad-Free
          </Link>
        </div>
        <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">ADVERTISEMENT SPACE</div>
      </div>
    );
  }

  if (type === 'leaderboard') {
    return (
      <div className={`w-full max-w-4xl mx-auto my-6 p-4 sm:p-5 bg-gradient-to-r from-[#172033] via-[#1a253d] to-[#172033] border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-xl ${className}`}>
        {/* Ad Tag */}
        <div className="absolute top-2 right-3 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded text-[10px] text-slate-400 font-mono tracking-wider uppercase">
          <Info className="w-2.5 h-2.5" /> ADVERTISEMENT
        </div>

        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-white">Level Up Your Battle Station</h4>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30">
                SPONSORED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              Zero input lag monitors & tactile mechanical keyboards engineered for champions.
            </p>
          </div>
        </div>

        <Link
          to="/premium"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 shadow-md transition flex items-center gap-1.5"
        >
          Check Deals <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Default banner
  return (
    <div className={`w-full p-4 bg-[#172033]/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative ${className}`}>
      <div className="absolute top-2 right-2 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
        ADVERTISEMENT
      </div>
      <div>
        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Sponsored Partner</span>
        <h5 className="text-sm font-bold text-slate-200">PlayZone Cloud Gaming Club</h5>
      </div>
      <Link
        to="/premium"
        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
      >
        Learn More
      </Link>
    </div>
  );
};
