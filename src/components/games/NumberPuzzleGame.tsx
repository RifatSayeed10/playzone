import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Timer, Trophy, Award, Volume2, VolumeX, Shuffle, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { storage } from '../../utils/storage';
import { ScoreModal } from '../common/ScoreModal';

export const NumberPuzzleGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(4); // 4 for 15-puzzle, 3 for 8-puzzle
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);

  const totalTiles = gridSize * gridSize;

  // Generate solved board: [1, 2, ..., N-1, 0] where 0 is blank
  const getSolvedBoard = useCallback((size: number) => {
    const total = size * size;
    const board = Array.from({ length: total - 1 }, (_, i) => i + 1);
    board.push(0); // 0 is empty
    return board;
  }, []);

  // Check if current board is solved
  const checkWin = useCallback((currentTiles: number[]) => {
    if (currentTiles.length === 0) return false;
    for (let i = 0; i < currentTiles.length - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[currentTiles.length - 1] === 0;
  }, []);

  // Shuffle by performing valid random moves to guarantee solvability
  const shuffleBoard = useCallback((size: number) => {
    sound.playClick();
    const board = getSolvedBoard(size);
    let emptyIndex = board.indexOf(0);

    const movesCount = size === 3 ? 80 : 160;
    let prevMove = -1;

    for (let i = 0; i < movesCount; i++) {
      const neighbors: number[] = [];
      const row = Math.floor(emptyIndex / size);
      const col = emptyIndex % size;

      if (row > 0) neighbors.push(emptyIndex - size); // UP
      if (row < size - 1) neighbors.push(emptyIndex + size); // DOWN
      if (col > 0) neighbors.push(emptyIndex - 1); // LEFT
      if (col < size - 1) neighbors.push(emptyIndex + 1); // RIGHT

      // Exclude immediately undoing previous move if possible
      const validNeighbors = neighbors.filter((n) => n !== prevMove);
      const chosen = validNeighbors.length > 0 
        ? validNeighbors[Math.floor(Math.random() * validNeighbors.length)]
        : neighbors[0];

      // Swap empty and chosen
      board[emptyIndex] = board[chosen];
      board[chosen] = 0;
      prevMove = emptyIndex;
      emptyIndex = chosen;
    }

    setTiles(board);
    setMoves(0);
    setSeconds(0);
    setIsActive(false);
    setIsWon(false);
  }, [getSolvedBoard]);

  useEffect(() => {
    shuffleBoard(gridSize);
  }, [gridSize, shuffleBoard]);

  // Stopwatch timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isWon) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isWon]);

  // Move a tile if adjacent to empty
  const moveTile = (index: number) => {
    if (isWon) return;
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    // Check if adjacent (Manhattan distance === 1)
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      if (!isActive) {
        setIsActive(true);
        storage.incrementPlayCount('number-puzzle');
      }

      sound.playClick();
      const newTiles = [...tiles];
      newTiles[emptyIndex] = newTiles[index];
      newTiles[index] = 0;
      setTiles(newTiles);
      setMoves((m) => m + 1);

      if (checkWin(newTiles)) {
        setIsWon(true);
        setIsActive(false);
        sound.playWin();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        const finalScore = Math.max(50, 1000 - moves * 10 - seconds * 2);
        storage.setPersonalHighScore('number-puzzle', finalScore);
        setTimeout(() => setShowScoreModal(true), 800);
      }
    }
  };

  // Keyboard controls (Arrow keys move tile into empty space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isWon) return;
      const emptyIndex = tiles.indexOf(0);
      if (emptyIndex === -1) return;

      const row = Math.floor(emptyIndex / gridSize);
      const col = emptyIndex % gridSize;

      let targetIndex = -1;

      // When user presses UP arrow, the tile BELOW moves UP into empty space
      if (e.key === 'ArrowUp' && row < gridSize - 1) {
        targetIndex = emptyIndex + gridSize;
      } else if (e.key === 'ArrowDown' && row > 0) {
        targetIndex = emptyIndex - gridSize;
      } else if (e.key === 'ArrowLeft' && col < gridSize - 1) {
        targetIndex = emptyIndex + 1;
      } else if (e.key === 'ArrowRight' && col > 0) {
        targetIndex = emptyIndex - 1;
      }

      if (targetIndex !== -1) {
        e.preventDefault();
        moveTile(targetIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles, gridSize, isWon]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-lg mx-auto">
      {/* Top Header bar */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-3 mb-4 shadow-lg">
        {/* Size switcher */}
        <div className="flex bg-[#0B1020] p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setGridSize(3)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${gridSize === 3 ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            3x3 (8-Tile)
          </button>
          <button
            onClick={() => setGridSize(4)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${gridSize === 4 ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            4x4 (15-Tile)
          </button>
        </div>

        {/* Audio and Shuffle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={() => shuffleBoard(gridSize)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md transition"
          >
            <Shuffle className="w-3.5 h-3.5" /> Scramble
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 w-full mb-4">
        <div className="bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-purple-400" /> Time
          </span>
          <span className="text-lg font-bold font-display text-white">{formatTime(seconds)}</span>
        </div>
        <div className="bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Moves</span>
          <span className="text-lg font-bold font-display text-cyan-300">{moves}</span>
        </div>
      </div>

      {/* Puzzle Board */}
      <div
        className={`w-full max-w-[420px] aspect-square p-4 bg-[#0B1020] border-2 border-purple-500/30 rounded-2xl shadow-2xl relative grid gap-2.5`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {tiles.map((tile, index) => {
          const isBlank = tile === 0;
          const isCorrectSpot = tile === index + 1;

          if (isBlank) {
            return (
              <div
                key="blank"
                className="w-full h-full rounded-xl bg-slate-900/40 border border-dashed border-slate-700/50 flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-purple-500/20"></div>
              </div>
            );
          }

          return (
            <button
              key={tile}
              onClick={() => moveTile(index)}
              className={`w-full h-full rounded-xl flex items-center justify-center font-display font-black text-2xl sm:text-3xl transition-all duration-150 transform hover:scale-102 active:scale-95 border ${
                isCorrectSpot
                  ? 'bg-gradient-to-br from-purple-700/60 to-cyan-800/60 border-cyan-400/80 text-cyan-200 shadow-md shadow-cyan-500/20'
                  : 'bg-gradient-to-br from-[#1e293b] to-[#172033] border-slate-700 hover:border-purple-500 text-white shadow'
              }`}
            >
              {tile}
            </button>
          );
        })}

        {/* Win overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/30">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-1">Puzzle Solved!</h3>
            <p className="text-slate-400 text-xs mb-4">
              Completed in {moves} moves · {formatTime(seconds)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => shuffleBoard(gridSize)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Next Round
              </button>
              <button
                onClick={() => setShowScoreModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Save Score
              </button>
            </div>
          </div>
        )}
      </div>

      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        gameId="number-puzzle"
        gameTitle="15-Tile Quantum Slide"
        score={Math.max(50, 1000 - moves * 10 - seconds * 2)}
      />
    </div>
  );
};
