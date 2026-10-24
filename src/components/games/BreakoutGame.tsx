import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Heart, Trophy, Volume2, VolumeX, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { storage } from '../../utils/storage';
import { ScoreModal } from '../common/ScoreModal';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  status: number; // 0 = broken, 1 = 1-hit, 2 = 2-hit
  maxHits: number;
  color: string;
  points: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export const BreakoutGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [highScore, setHighScore] = useState<number>(() => storage.getPersonalHighScore('breakout'));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);

  // Game state stored in refs for buttery-smooth 60fps canvas loop
  const gameStateRef = useRef({
    paddleX: 175,
    paddleWidth: 90,
    paddleHeight: 12,
    paddleSpeed: 7,
    ballX: 220,
    ballY: 300,
    ballRadius: 7,
    ballSpeedX: 3.5,
    ballSpeedY: -3.5,
    bricks: [] as Brick[],
    particles: [] as Particle[],
    isLeftPressed: false,
    isRightPressed: false,
    score: 0,
    lives: 3,
  });

  const initBricks = useCallback(() => {
    const brickRows = 5;
    const brickCols = 7;
    const brickWidth = 52;
    const brickHeight = 16;
    const brickPadding = 6;
    const brickOffsetTop = 45;
    const brickOffsetLeft = (440 - (brickCols * brickWidth + (brickCols - 1) * brickPadding)) / 2;

    const rowColors = [
      { color: '#EF4444', points: 40, hits: 2 }, // Red top (2 hits)
      { color: '#F97316', points: 30, hits: 1 }, // Orange
      { color: '#FBBF24', points: 25, hits: 1 }, // Yellow
      { color: '#10B981', points: 20, hits: 1 }, // Green
      { color: '#06B6D4', points: 15, hits: 1 }, // Cyan
    ];

    const bricks: Brick[] = [];
    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < brickCols; c++) {
        const brickX = brickOffsetLeft + c * (brickWidth + brickPadding);
        const brickY = brickOffsetTop + r * (brickHeight + brickPadding);
        bricks.push({
          x: brickX,
          y: brickY,
          width: brickWidth,
          height: brickHeight,
          status: rowColors[r].hits,
          maxHits: rowColors[r].hits,
          color: rowColors[r].color,
          points: rowColors[r].points,
        });
      }
    }
    return bricks;
  }, []);

  const spawnShatterParticles = (x: number, y: number, color: string) => {
    const parts: Particle[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
      });
    }
    gameStateRef.current.particles.push(...parts);
  };

  const startBreakout = () => {
    sound.playClick();
    const bricks = initBricks();
    gameStateRef.current = {
      paddleX: 175,
      paddleWidth: 90,
      paddleHeight: 12,
      paddleSpeed: 7,
      ballX: 220,
      ballY: 340,
      ballRadius: 7,
      ballSpeedX: (Math.random() > 0.5 ? 1 : -1) * 3.5,
      ballSpeedY: -4,
      bricks,
      particles: [],
      isLeftPressed: false,
      isRightPressed: false,
      score: 0,
      lives: 3,
    };

    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsWon(false);
    setIsPlaying(true);
    storage.incrementPlayCount('breakout');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.isLeftPressed = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.isRightPressed = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.isLeftPressed = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.isRightPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse / Touch move on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const pWidth = gameStateRef.current.paddleWidth;
    gameStateRef.current.paddleX = Math.max(0, Math.min(canvas.width - pWidth, mouseX - pWidth / 2));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    const pWidth = gameStateRef.current.paddleWidth;
    gameStateRef.current.paddleX = Math.max(0, Math.min(canvas.width - pWidth, touchX - pWidth / 2));
  };

  // 60FPS Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver || isWon) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const state = gameStateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Handle paddle keys
      if (state.isLeftPressed) {
        state.paddleX = Math.max(0, state.paddleX - state.paddleSpeed);
      }
      if (state.isRightPressed) {
        state.paddleX = Math.min(width - state.paddleWidth, state.paddleX + state.paddleSpeed);
      }

      // Move ball
      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      // Wall reflections
      if (state.ballX - state.ballRadius <= 0) {
        state.ballX = state.ballRadius;
        state.ballSpeedX = -state.ballSpeedX;
        sound.playHit();
      } else if (state.ballX + state.ballRadius >= width) {
        state.ballX = width - state.ballRadius;
        state.ballSpeedX = -state.ballSpeedX;
        sound.playHit();
      }

      if (state.ballY - state.ballRadius <= 0) {
        state.ballY = state.ballRadius;
        state.ballSpeedY = -state.ballSpeedY;
        sound.playHit();
      }

      // Paddle collision
      const paddleTop = height - 30;
      if (
        state.ballY + state.ballRadius >= paddleTop &&
        state.ballY - state.ballRadius <= paddleTop + state.paddleHeight &&
        state.ballX >= state.paddleX &&
        state.ballX <= state.paddleX + state.paddleWidth
      ) {
        sound.playPoint();
        // Dynamic angle calculation based on hit location
        const hitPos = (state.ballX - (state.paddleX + state.paddleWidth / 2)) / (state.paddleWidth / 2);
        const maxAngle = Math.PI / 3; // 60 degrees
        const bounceAngle = hitPos * maxAngle;
        const speed = Math.hypot(state.ballSpeedX, state.ballSpeedY);

        state.ballSpeedX = speed * Math.sin(bounceAngle);
        state.ballSpeedY = -Math.abs(speed * Math.cos(bounceAngle));
        state.ballY = paddleTop - state.ballRadius;
      }

      // Brick collision
      let activeBricksCount = 0;
      for (const b of state.bricks) {
        if (b.status > 0) {
          activeBricksCount++;

          if (
            state.ballX + state.ballRadius >= b.x &&
            state.ballX - state.ballRadius <= b.x + b.width &&
            state.ballY + state.ballRadius >= b.y &&
            state.ballY - state.ballRadius <= b.y + b.height
          ) {
            b.status -= 1;
            spawnShatterParticles(b.x + b.width / 2, b.y + b.height / 2, b.color);

            if (b.status === 0) {
              sound.playHit();
              state.score += b.points;
              setScore(state.score);
            } else {
              sound.playClick();
            }

            // Reflect ball
            state.ballSpeedY = -state.ballSpeedY;
            break;
          }
        }
      }

      // Win condition: all bricks destroyed
      if (activeBricksCount === 0) {
        setIsWon(true);
        setIsPlaying(false);
        sound.playWin();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        if (state.score > highScore) {
          setHighScore(state.score);
          storage.setPersonalHighScore('breakout', state.score);
        }
        setShowScoreModal(true);
        return;
      }

      // Ball missed paddle (bottom wall)
      if (state.ballY - state.ballRadius > height) {
        state.lives -= 1;
        setLives(state.lives);
        sound.playGameOver();

        if (state.lives <= 0) {
          setIsGameOver(true);
          setIsPlaying(false);
          if (state.score > highScore) {
            setHighScore(state.score);
            storage.setPersonalHighScore('breakout', state.score);
          }
          if (state.score >= 50) {
            setShowScoreModal(true);
          }
          return;
        } else {
          // Reset ball on paddle
          state.ballX = state.paddleX + state.paddleWidth / 2;
          state.ballY = paddleTop - 15;
          state.ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 3.5;
          state.ballSpeedY = -4;
        }
      }

      // Update particles
      state.particles = state.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          alpha: p.alpha - 0.04,
        }))
        .filter((p) => p.alpha > 0);

      // DRAW CANVAS
      ctx.fillStyle = '#0B1020';
      ctx.fillRect(0, 0, width, height);

      // Subtle cyber grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Bricks
      for (const b of state.bricks) {
        if (b.status > 0) {
          ctx.fillStyle = b.status === 2 ? '#DC2626' : b.color;
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, b.width, b.height, 4);
          ctx.fill();

          // Highlight bevel
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(b.x, b.y, b.width, 2);

          // If 2 hits remaining, show shield icon or cracks
          if (b.status === 2) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(b.x + b.width / 2 - 4, b.y + 4, 8, 2);
          }
        }
      }

      // Draw Particles
      for (const p of state.particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Paddle
      ctx.fillStyle = '#8B5CF6';
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(state.paddleX, paddleTop, state.paddleWidth, state.paddleHeight, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Paddle neon center line
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(state.paddleX + state.paddleWidth / 2 - 10, paddleTop + 3, 20, 6);

      // Draw Ball
      ctx.fillStyle = '#38BDF8';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, isWon, highScore]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-lg mx-auto">
      {/* Top Header stats */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-3 mb-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-purple-500/30">
            <span className="text-xs text-slate-400 block font-medium">SCORE</span>
            <span className="text-xl font-bold font-display text-white">{score}</span>
          </div>

          {/* Lives */}
          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1">LIVES</span>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-4 h-4 ${idx < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`}
              />
            ))}
          </div>

          <div className="hidden sm:block bg-[#0B1020] px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> BEST
            </span>
            <span className="text-base font-bold font-display text-amber-300">{highScore}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={startBreakout}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isPlaying ? 'Restart' : 'Play Now'}
          </button>
        </div>
      </div>

      {/* Breakout Canvas */}
      <div className="relative w-full aspect-[440/400] max-w-[440px] bg-[#0B1020] rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={440}
          height={400}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full h-full block cursor-crosshair touch-none"
        />

        {/* Start Game Overlay */}
        {!isPlaying && !isGameOver && !isWon && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/40">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">Cyber Breakout</h3>
            <p className="text-slate-300 text-xs mb-6 max-w-xs">
              Smash the cyber brick matrix! Move paddle with your mouse, touch drag, or Left/Right keys.
            </p>
            <button
              onClick={startBreakout}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-500/30 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> LAUNCH SPHERE
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="text-red-500 font-display font-black text-3xl mb-1 tracking-wider">SYSTEM COLLAPSE</div>
            <p className="text-slate-400 text-xs mb-4">All shields depleted.</p>
            <div className="bg-[#172033] border border-slate-700 rounded-xl px-6 py-3 mb-5">
              <div className="text-xs text-slate-400 font-semibold uppercase">Final Score</div>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {score}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startBreakout}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              {score >= 50 && (
                <button
                  onClick={() => setShowScoreModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
                >
                  Leaderboard
                </button>
              )}
            </div>
          </div>
        )}

        {/* Victory Clear Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="text-cyan-400 font-display font-black text-3xl mb-1 tracking-wider">GRID CLEARED!</div>
            <p className="text-slate-300 text-xs mb-4">All cyber blocks successfully neutralized!</p>
            <div className="bg-[#172033] border border-slate-700 rounded-xl px-6 py-3 mb-5">
              <div className="text-xs text-slate-400 font-semibold uppercase">Victory Score</div>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {score}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startBreakout}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition"
              >
                <RotateCcw className="w-4 h-4" /> Next Wave
              </button>
              <button
                onClick={() => setShowScoreModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
              >
                Save Score
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile touch nudge buttons */}
      <div className="mt-4 flex items-center justify-center gap-6 md:hidden">
        <button
          onTouchStart={() => (gameStateRef.current.isLeftPressed = true)}
          onTouchEnd={() => (gameStateRef.current.isLeftPressed = false)}
          className="px-6 py-3 bg-[#172033] active:bg-purple-600 border border-slate-700 rounded-xl text-white flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" /> Steer Left
        </button>
        <button
          onTouchStart={() => (gameStateRef.current.isRightPressed = true)}
          onTouchEnd={() => (gameStateRef.current.isRightPressed = false)}
          className="px-6 py-3 bg-[#172033] active:bg-purple-600 border border-slate-700 rounded-xl text-white flex items-center gap-1"
        >
          Steer Right <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        gameId="breakout"
        gameTitle="Cyber Breakout"
        score={score}
      />
    </div>
  );
};
