import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Bot, Users, Trophy, Sparkles, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { storage } from '../../utils/storage';
import { ScoreModal } from '../common/ScoreModal';

type Player = 'X' | 'O';
type Board = (Player | null)[];
type GameMode = 'ai-unbeatable' | 'ai-normal' | '2-player';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('ai-unbeatable');
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.isMuted());
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Check victory condition
  const checkWinner = useCallback((currentBoard: Board): { winner: Player | 'DRAW' | null; line: number[] | null } => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'DRAW', line: null };
    }
    return { winner: null, line: null };
  }, []);

  // Minimax Algorithm for unbeatable AI
  const minimax = useCallback((newBoard: Board, player: Player, depth: number = 0): { score: number; index?: number } => {
    const { winner: resWinner } = checkWinner(newBoard);
    if (resWinner === 'O') return { score: 10 - depth };
    if (resWinner === 'X') return { score: depth - 10 };
    if (resWinner === 'DRAW') return { score: 0 };

    const availableMoves: number[] = [];
    newBoard.forEach((cell, idx) => {
      if (!cell) availableMoves.push(idx);
    });

    const moves: { index: number; score: number }[] = [];

    for (const move of availableMoves) {
      newBoard[move] = player;
      let result: { score: number };
      if (player === 'O') {
        result = minimax(newBoard, 'X', depth + 1);
      } else {
        result = minimax(newBoard, 'O', depth + 1);
      }
      moves.push({ index: move, score: result.score });
      newBoard[move] = null; // Backtrack
    }

    let bestMove = 0;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }, [checkWinner]);

  // Handle cell selection
  const handleCellClick = (index: number) => {
    if (board[index] || winner || isAiThinking) return;

    sound.playClick();
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const check = checkWinner(newBoard);
    if (check.winner) {
      finishRound(check.winner, check.line);
      return;
    }

    if (gameMode === '2-player') {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    } else {
      // AI turn
      setCurrentPlayer('O');
      setIsAiThinking(true);
    }
  };

  // AI Response turn
  useEffect(() => {
    if (isAiThinking && currentPlayer === 'O' && !winner) {
      const timer = setTimeout(() => {
        let chosenIndex: number | undefined;

        if (gameMode === 'ai-unbeatable') {
          const move = minimax([...board], 'O');
          chosenIndex = move?.index;
        } else {
          // Normal mode: 60% chance smart, 40% random
          const available = board
            .map((val, idx) => (val === null ? idx : null))
            .filter((v): v is number => v !== null);

          if (Math.random() < 0.6) {
            const move = minimax([...board], 'O');
            chosenIndex = move?.index;
          } else {
            chosenIndex = available[Math.floor(Math.random() * available.length)];
          }
        }

        if (chosenIndex !== undefined && board[chosenIndex] === null) {
          sound.playHit();
          const nextBoard = [...board];
          nextBoard[chosenIndex] = 'O';
          setBoard(nextBoard);

          const check = checkWinner(nextBoard);
          if (check.winner) {
            finishRound(check.winner, check.line);
          } else {
            setCurrentPlayer('X');
          }
        }
        setIsAiThinking(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isAiThinking, currentPlayer, winner, gameMode, board, checkWinner, minimax]);

  const finishRound = (winResult: Player | 'DRAW', line: number[] | null) => {
    setWinner(winResult);
    setWinningLine(line);

    if (winResult === 'X') {
      sound.playWin();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setScores((s) => ({ ...s, X: s.X + 1 }));
      storage.incrementPlayCount('tic-tac-toe');
    } else if (winResult === 'O') {
      sound.playGameOver();
      setScores((s) => ({ ...s, O: s.O + 1 }));
      storage.incrementPlayCount('tic-tac-toe');
    } else {
      sound.playPoint();
      setScores((s) => ({ ...s, ties: s.ties + 1 }));
    }
  };

  const resetGame = () => {
    sound.playClick();
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-lg mx-auto">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-3 mb-4 shadow-lg">
        {/* Game Mode Selector */}
        <div className="flex bg-[#0B1020] p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => { setGameMode('ai-unbeatable'); resetGame(); }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${gameMode === 'ai-unbeatable' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Smart AI
          </button>
          <button
            onClick={() => { setGameMode('ai-normal'); resetGame(); }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${gameMode === 'ai-normal' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Casual AI
          </button>
          <button
            onClick={() => { setGameMode('2-player'); resetGame(); }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${gameMode === '2-player' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            2 Players
          </button>
        </div>

        {/* Audio and Restart */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={resetGame}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Scores indicator */}
      <div className="grid grid-cols-3 gap-3 w-full mb-5 text-center">
        <div className={`p-3 rounded-xl border transition ${currentPlayer === 'X' && !winner ? 'bg-purple-950/40 border-purple-500' : 'bg-[#172033] border-slate-700/60'}`}>
          <span className="text-xs text-purple-400 font-semibold block flex items-center justify-center gap-1">
            <Users className="w-3.5 h-3.5" /> Player (X)
          </span>
          <span className="text-2xl font-black font-display text-white">{scores.X}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#172033] border border-slate-700/60">
          <span className="text-xs text-slate-400 font-semibold block">Ties</span>
          <span className="text-2xl font-black font-display text-slate-300">{scores.ties}</span>
        </div>
        <div className={`p-3 rounded-xl border transition ${currentPlayer === 'O' && !winner ? 'bg-cyan-950/40 border-cyan-500' : 'bg-[#172033] border-slate-700/60'}`}>
          <span className="text-xs text-cyan-400 font-semibold block flex items-center justify-center gap-1">
            {gameMode === '2-player' ? <Users className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            {gameMode === '2-player' ? 'Player (O)' : 'Computer (O)'}
          </span>
          <span className="text-2xl font-black font-display text-white">{scores.O}</span>
        </div>
      </div>

      {/* Turn Banner */}
      <div className="mb-4 text-sm font-semibold tracking-wide text-slate-300">
        {winner === 'DRAW' ? (
          <span className="text-amber-400">Match ended in a Draw!</span>
        ) : winner ? (
          <span className="text-emerald-400 flex items-center gap-1 justify-center">
            <Sparkles className="w-4 h-4" /> Winner is: <strong className="text-white text-base">{winner === 'X' ? 'Player (X)' : gameMode === '2-player' ? 'Player (O)' : 'Computer (O)'}</strong>!
          </span>
        ) : isAiThinking ? (
          <span className="text-cyan-400 animate-pulse">Computer is computing next move...</span>
        ) : (
          <span>Turn: <strong className={currentPlayer === 'X' ? 'text-purple-400' : 'text-cyan-400'}>{currentPlayer}</strong></span>
        )}
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[360px] aspect-square p-4 bg-[#0B1020] border-2 border-purple-500/30 rounded-2xl shadow-2xl relative">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={!!cell || !!winner || isAiThinking}
              className={`h-full w-full rounded-xl flex items-center justify-center text-4xl sm:text-5xl font-black font-display transition-all duration-200 border ${
                isWinningCell
                  ? 'bg-purple-600/40 border-cyan-400 text-cyan-300 shadow-lg shadow-purple-500/40 scale-105'
                  : cell
                  ? 'bg-[#172033] border-slate-700/80 cursor-default'
                  : 'bg-[#172033]/60 hover:bg-[#1e293b] border-slate-800 hover:border-purple-500/50 cursor-pointer'
              }`}
            >
              {cell === 'X' && (
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-pink-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  X
                </span>
              )}
              {cell === 'O' && (
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-emerald-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  O
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Post game celebration / submit score if won */}
      {winner === 'X' && (
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setShowScoreModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-500/20"
          >
            <Trophy className="w-4 h-4" /> Save Score to Leaderboard
          </button>
        </div>
      )}

      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        gameId="tic-tac-toe"
        gameTitle="Neon Tic-Tac-Toe"
        score={scores.X * 100}
      />
    </div>
  );
};
