import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Timer, Award, Sparkles, Volume2, VolumeX, Trophy, Flame, Shield, Sword, Gamepad2, Skull, Diamond, Rocket, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { storage } from '../../utils/storage';
import { ScoreModal } from '../common/ScoreModal';

interface CardItem {
  id: number;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_ICONS = [
  { name: 'gamepad', icon: Gamepad2, color: 'text-purple-400' },
  { name: 'sword', icon: Sword, color: 'text-cyan-400' },
  { name: 'shield', icon: Shield, color: 'text-emerald-400' },
  { name: 'skull', icon: Skull, color: 'text-pink-400' },
  { name: 'diamond', icon: Diamond, color: 'text-amber-400' },
  { name: 'flame', icon: Flame, color: 'text-orange-400' },
  { name: 'rocket', icon: Rocket, color: 'text-rose-400' },
  { name: 'zap', icon: Zap, color: 'text-yellow-400' },
];

export const MemoryMatchGame: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  // Initialize and shuffle cards
  const initGame = useCallback(() => {
    sound.playClick();
    const deck: CardItem[] = [];
    let idCounter = 0;

    CARD_ICONS.forEach((item) => {
      // 2 cards per icon
      deck.push({ id: idCounter++, iconName: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, iconName: item.name, isFlipped: false, isMatched: false });
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setTimeSeconds(0);
    setIsGameOver(false);
    setIsGameActive(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && !isGameOver) {
      timer = setInterval(() => {
        setTimeSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, isGameOver]);

  const handleCardClick = (index: number) => {
    // Prevent clicking already flipped, matched cards, or when 2 cards are currently open
    if (
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length >= 2 ||
      isGameOver
    ) {
      return;
    }

    // Start timer on first card click
    if (!isGameActive) {
      setIsGameActive(true);
      storage.incrementPlayCount('memory-match');
    }

    sound.playClick();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If 2 cards are flipped, check for match
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.iconName === secondCard.iconName) {
        // Matched!
        sound.playPoint();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setMatchedPairs((p) => {
            const updated = p + 1;
            if (updated === CARD_ICONS.length) {
              handleGameWin();
            }
            return updated;
          });
        }, 300);
      } else {
        // Not matched
        setTimeout(() => {
          sound.playHit();
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleGameWin = () => {
    setIsGameOver(true);
    setIsGameActive(false);
    sound.playWin();
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });

    // Calculate score: base 1000 minus time and extra moves
    const timePenalty = timeSeconds * 5;
    const movePenalty = Math.max(0, (moves - 8) * 20);
    const calculated = Math.max(100, 1000 - timePenalty - movePenalty);
    setFinalScore(calculated);

    storage.setPersonalHighScore('memory-match', calculated);
    setTimeout(() => {
      setShowScoreModal(true);
    }, 800);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-lg mx-auto">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-3 mb-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-purple-500/30 flex items-center gap-2">
            <Timer className="w-4 h-4 text-purple-400" />
            <span className="text-base font-bold font-display text-white">{formatTime(timeSeconds)}</span>
          </div>
          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 block font-medium">MOVES</span>
            <span className="text-base font-bold font-display text-cyan-300">{moves}</span>
          </div>
          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 block font-medium">PAIRS</span>
            <span className="text-base font-bold font-display text-emerald-400">
              {matchedPairs}/{CARD_ICONS.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={initGame}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>
      </div>

      {/* 4x4 Cards Grid */}
      <div className="grid grid-cols-4 gap-3 w-full max-w-[420px] aspect-square p-4 bg-[#0B1020] border-2 border-purple-500/30 rounded-2xl shadow-2xl relative">
        {cards.map((card, index) => {
          const iconObj = CARD_ICONS.find((i) => i.name === card.iconName);
          const IconComponent = iconObj?.icon || Sparkles;
          const iconColor = iconObj?.color || 'text-purple-400';

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.isFlipped || card.isMatched}
              className={`h-full w-full rounded-xl flex items-center justify-center transition-all duration-300 transform perspective-1000 border ${
                card.isMatched
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/20 scale-95 opacity-90'
                  : card.isFlipped
                  ? 'bg-[#172033] border-cyan-400 shadow-lg shadow-cyan-500/30 scale-100 rotate-0'
                  : 'bg-gradient-to-b from-[#1e293b] to-[#172033] hover:from-purple-900/40 hover:to-[#172033] border-slate-700 hover:border-purple-500/60 cursor-pointer hover:scale-102'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <IconComponent className={`w-8 h-8 ${iconColor} animate-scaleIn`} />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400/70 font-mono text-xs font-black">
                  ?
                </div>
              )}
            </button>
          );
        })}

        {/* Victory Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-1">Matrix Cleared!</h3>
            <p className="text-slate-400 text-xs mb-3">
              Matched in {moves} moves · {formatTime(timeSeconds)}
            </p>
            <div className="bg-[#172033] border border-slate-700 rounded-xl px-6 py-2.5 mb-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Score</span>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {finalScore}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={initGame}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Play Again
              </button>
              <button
                onClick={() => setShowScoreModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>

      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        gameId="memory-match"
        gameTitle="Arcade Memory Matrix"
        score={finalScore}
      />
    </div>
  );
};
