import React, { useState } from 'react';
import { ExternalLink, RotateCcw, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

interface ExternalGameRunnerProps {
  gameUrl: string;
  gameTitle: string;
}

export const ExternalGameRunner: React.FC<ExternalGameRunnerProps> = ({ gameUrl, gameTitle }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const reloadGame = () => {
    setIsLoading(true);
    setIframeKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Top action bar */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-2.5 mb-3 shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sandboxed HTML5 Environment</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reloadGame}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reload
          </button>
          <a
            href={gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Direct Launch
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="relative w-full aspect-[16/10] min-h-[480px] bg-[#0B1020] rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 bg-[#0B1020] flex flex-col items-center justify-center p-6 text-center z-10">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <h4 className="text-lg font-bold font-display text-white mb-1">Loading {gameTitle}...</h4>
            <p className="text-slate-400 text-xs max-w-sm">
              Establishing secure sandbox connection.
            </p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={gameUrl}
          title={gameTitle}
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="autoplay; fullscreen"
          className="w-full h-full border-0 block"
        />
      </div>

      {/* Note about external embed */}
      <div className="mt-3 flex items-start gap-2 p-3 bg-[#172033]/60 border border-slate-800 rounded-xl text-xs text-slate-400 w-full">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          External web games are sandboxed for security. If the game canvas fails to render due to third-party server restrictions or ad-blockers, click the <strong>Direct Launch</strong> button above.
        </span>
      </div>
    </div>
  );
};
