import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Pause, Volume2, VolumeX, Trophy, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/audio';
import { storage } from '../../utils/storage';
import { ScoreModal } from '../common/ScoreModal';

const GRID_SIZE = 20; // 20x20 grid

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDirection, setNextDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => storage.getPersonalHighScore('snake'));
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(nextDirection);
  directionRef.current = direction;
  nextDirectionRef.current = nextDirection;

  // Generate random food position not on snake
  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let collision: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      collision = currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
    } while (collision);
    return newFood;
  }, []);

  const spawnEatParticles = (x: number, y: number) => {
    const newParts: Particle[] = [];
    const colors = ['#A855F7', '#06B6D4', '#F43F5E', '#FBBF24', '#FFFFFF'];
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5);
      const speed = Math.random() * 3 + 2;
      newParts.push({
        x: x * 20 + 10,
        y: y * 20 + 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles((prev) => [...prev, ...newParts]);
  };

  const startGame = () => {
    sound.playClick();
    const initialSnake: Point[] = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setDirection('UP');
    setNextDirection('UP');
    directionRef.current = 'UP';
    nextDirectionRef.current = 'UP';
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setFood(generateFood(initialSnake));
    storage.incrementPlayCount('snake');
  };

  const handleGameOver = () => {
    sound.playGameOver();
    setIsGameOver(true);
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
      storage.setPersonalHighScore('snake', score);
    }
    if (score >= 30) {
      setShowScoreModal(true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) {
        if (e.key === ' ' || e.key === 'Enter') {
          if (!isPlaying) startGame();
          else setIsPaused(false);
        }
        return;
      }

      const cur = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (cur !== 'DOWN') nextDirectionRef.current = 'UP';
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (cur !== 'UP') nextDirectionRef.current = 'DOWN';
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (cur !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (cur !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          e.preventDefault();
          break;
        case ' ':
          setIsPaused((p) => !p);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused]);

  // Touch button handler
  const handleTouchDir = (newDir: Direction) => {
    if (!isPlaying) {
      startGame();
      return;
    }
    const cur = directionRef.current;
    if (newDir === 'UP' && cur !== 'DOWN') nextDirectionRef.current = 'UP';
    if (newDir === 'DOWN' && cur !== 'UP') nextDirectionRef.current = 'DOWN';
    if (newDir === 'LEFT' && cur !== 'RIGHT') nextDirectionRef.current = 'LEFT';
    if (newDir === 'RIGHT' && cur !== 'LEFT') nextDirectionRef.current = 'RIGHT';
  };

  // Main game tick
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver) return;

    // Speed scales with score: start at 130ms, decrease to minimum 60ms
    const speed = Math.max(60, 130 - Math.floor(score / 30) * 10);

    const interval = setInterval(() => {
      const currentDir = nextDirectionRef.current;
      setDirection(currentDir);
      directionRef.current = currentDir;

      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (currentDir) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision (skip tail since it will move unless eating)
        for (let i = 0; i < prevSnake.length - 1; i++) {
          if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
            handleGameOver();
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          sound.playPoint();
          spawnEatParticles(food.x, food.y);
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, isGameOver, food, score, generateFood]);

  // Particle updates
  useEffect(() => {
    if (particles.length === 0) return;
    const animationFrame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.05,
          }))
          .filter((p) => p.alpha > 0)
      );
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0B1020';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }

    // Outer neon border
    ctx.strokeStyle = isGameOver ? '#EF4444' : '#8B5CF6';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);

    // Draw food (pulsating orb)
    const foodPulse = Math.sin(Date.now() / 150) * 2;
    const foodCenterX = food.x * cellSize + cellSize / 2;
    const foodCenterY = food.y * cellSize + cellSize / 2;
    const foodRadius = cellSize * 0.4 + foodPulse;

    // Glow around food
    const foodGlow = ctx.createRadialGradient(
      foodCenterX, foodCenterY, 2,
      foodCenterX, foodCenterY, cellSize * 1.2
    );
    foodGlow.addColorStop(0, 'rgba(6, 182, 212, 1)');
    foodGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.5)');
    foodGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = foodGlow;
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, cellSize * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Food inner solid
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, Math.max(3, foodRadius), 0, Math.PI * 2);
    ctx.fill();

    // Draw snake body with gradient
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;

      if (isHead) {
        // Snake Head
        ctx.fillStyle = '#A855F7';
        ctx.shadowColor = '#C084FC';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes based on direction
        ctx.fillStyle = '#FFFFFF';
        const eyeSize = 3;
        const curDir = directionRef.current;
        let eye1 = { x: x + 4, y: y + 4 };
        let eye2 = { x: x + cellSize - 7, y: y + 4 };

        if (curDir === 'DOWN') {
          eye1 = { x: x + 4, y: y + cellSize - 7 };
          eye2 = { x: x + cellSize - 7, y: y + cellSize - 7 };
        } else if (curDir === 'LEFT') {
          eye1 = { x: x + 4, y: y + 4 };
          eye2 = { x: x + 4, y: y + cellSize - 7 };
        } else if (curDir === 'RIGHT') {
          eye1 = { x: x + cellSize - 7, y: y + 4 };
          eye2 = { x: x + cellSize - 7, y: y + cellSize - 7 };
        }

        ctx.fillRect(eye1.x, eye1.y, eyeSize, eyeSize);
        ctx.fillRect(eye2.x, eye2.y, eyeSize, eyeSize);
      } else {
        // Body segments
        const ratio = index / snake.length;
        const alpha = Math.max(0.4, 1 - ratio * 0.5);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 4);
        ctx.fill();
      }
    });

    // Draw particles
    particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
  }, [snake, food, isGameOver, particles]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xl mx-auto">
      {/* Header bar / Scores */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-3 mb-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-purple-500/30">
            <span className="text-xs text-slate-400 block font-medium">SCORE</span>
            <span className="text-xl font-bold font-display text-white">{score}</span>
          </div>
          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 block font-medium flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> BEST
            </span>
            <span className="text-xl font-bold font-display text-amber-300">{highScore}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {isPlaying && !isGameOver && (
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}

          <button
            onClick={startGame}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isPlaying ? 'Restart' : 'Play Now'}
          </button>
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="relative w-full aspect-square max-w-[420px] bg-[#0B1020] rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full block"
        />

        {/* Start / Pause / Game Over Overlays */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">Neon Snake Arena</h3>
            <p className="text-slate-300 text-xs mb-6 max-w-xs">
              Guide your cyber snake to absorb quantum energy orbs. Avoid hitting walls or your own tail!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-500/30 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> START GAME
            </button>
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center">
            <h4 className="text-2xl font-bold font-display text-cyan-400 mb-3">GAME PAUSED</h4>
            <button
              onClick={() => setIsPaused(false)}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition"
            >
              Click to Resume
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="text-red-500 font-display font-black text-3xl mb-1 tracking-wider">GAME OVER</div>
            <p className="text-slate-400 text-xs mb-4">You collided with the barrier!</p>
            <div className="bg-[#172033] border border-slate-700 rounded-xl px-6 py-3 mb-5">
              <div className="text-xs text-slate-400 font-semibold uppercase">Final Score</div>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {score}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              {score >= 20 && (
                <button
                  onClick={() => setShowScoreModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                >
                  Leaderboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch D-Pad */}
      <div className="mt-4 flex flex-col items-center md:hidden">
        <span className="text-[11px] text-slate-400 mb-2 uppercase tracking-wider">Mobile Touch Controls</span>
        <div className="grid grid-cols-3 gap-2 w-48">
          <div></div>
          <button
            onClick={() => handleTouchDir('UP')}
            className="p-3 bg-[#172033] active:bg-purple-600 border border-slate-700 rounded-xl flex items-center justify-center text-white"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div></div>
          <button
            onClick={() => handleTouchDir('LEFT')}
            className="p-3 bg-[#172033] active:bg-purple-600 border border-slate-700 rounded-xl flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleTouchDir('DOWN')}
            className="p-3 bg-[#172033] active:bg-purple-600 border border-slate-700 rounded-xl flex items-center justify-center text-white"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleTouchDir('RIGHT')}
            className="p-3 bg-[#172033] active:bg-purple-600 border border-slate-700 rounded-xl flex items-center justify-center text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Score Modal */}
      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        gameId="snake"
        gameTitle="Neon Snake Arena"
        score={score}
      />
    </div>
  );
};
