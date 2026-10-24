import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { storage } from '../../utils/storage';
import { ScoreModal } from '../common/ScoreModal';

interface EnemyCar {
  x: number;
  y: number;
  speed: number;
  color: string;
}

export const SpeedRacerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => storage.getPersonalHighScore('speed-racer'));
  const [nitro, setNitro] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.isMuted());
  const [showScoreModal, setShowScoreModal] = useState(false);

  const stateRef = useRef({
    lane: 1, // 0: left, 1: center, 2: right
    targetX: 200,
    carX: 200,
    carY: 340,
    enemies: [] as EnemyCar[],
    roadOffset: 0,
    nitroActive: false,
    speed: 5,
    score: 0,
  });

  const LANE_X = [85, 200, 315];

  const startGame = () => {
    sound.playClick();
    stateRef.current = {
      lane: 1,
      targetX: LANE_X[1],
      carX: LANE_X[1],
      carY: 330,
      enemies: [],
      roadOffset: 0,
      nitroActive: false,
      speed: 5,
      score: 0,
    };
    setScore(0);
    setNitro(100);
    setIsGameOver(false);
    setIsPlaying(true);
    storage.incrementPlayCount('speed-racer');
  };

  const changeLane = (dir: 'LEFT' | 'RIGHT') => {
    if (!isPlaying || isGameOver) return;
    const curLane = stateRef.current.lane;
    let nextLane = curLane;
    if (dir === 'LEFT' && curLane > 0) nextLane = curLane - 1;
    if (dir === 'RIGHT' && curLane < 2) nextLane = curLane + 1;

    if (nextLane !== curLane) {
      sound.playClick();
      stateRef.current.lane = nextLane;
      stateRef.current.targetX = LANE_X[nextLane];
    }
  };

  const activateNitro = () => {
    if (nitro > 25 && !stateRef.current.nitroActive) {
      sound.playPoint();
      stateRef.current.nitroActive = true;
      setTimeout(() => {
        stateRef.current.nitroActive = false;
      }, 2500);
      setNitro((n) => Math.max(0, n - 35));
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        changeLane('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        changeLane('RIGHT');
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        activateNitro();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, nitro]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    let animId: number;
    let spawnTimer = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const state = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Speed multiplier
      const currentSpeed = state.nitroActive ? state.speed * 2.2 : state.speed;

      // Smooth horizontal lerp for car
      state.carX += (state.targetX - state.carX) * 0.25;

      // Road scroll
      state.roadOffset = (state.roadOffset + currentSpeed) % 40;

      // Increment score
      state.score += Math.round(currentSpeed / 4);
      setScore(state.score);

      // Nitro recharge slowly
      setNitro((n) => Math.min(100, n + 0.05));

      // Spawn oncoming cars
      spawnTimer += currentSpeed;
      if (spawnTimer > 180) {
        spawnTimer = 0;
        const randomLane = Math.floor(Math.random() * 3);
        const enemyColors = ['#EF4444', '#EAB308', '#EC4899', '#3B82F6'];
        state.enemies.push({
          x: LANE_X[randomLane],
          y: -80,
          speed: Math.random() * 2 + 2,
          color: enemyColors[Math.floor(Math.random() * enemyColors.length)],
        });
      }

      // Move enemies
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        e.y += currentSpeed + e.speed;

        // Collision check
        const carBox = { x: state.carX - 18, y: state.carY - 30, w: 36, h: 60 };
        const enemyBox = { x: e.x - 18, y: e.y - 30, w: 36, h: 60 };

        if (
          carBox.x < enemyBox.x + enemyBox.w &&
          carBox.x + carBox.w > enemyBox.x &&
          carBox.y < enemyBox.y + enemyBox.h &&
          carBox.y + carBox.h > enemyBox.y
        ) {
          if (state.nitroActive) {
            // Nitro destroys enemy!
            sound.playHit();
            state.enemies.splice(i, 1);
            state.score += 200;
            continue;
          } else {
            // Crash
            sound.playGameOver();
            setIsGameOver(true);
            setIsPlaying(false);
            if (state.score > highScore) {
              setHighScore(state.score);
              storage.setPersonalHighScore('speed-racer', state.score);
            }
            if (state.score >= 500) {
              setShowScoreModal(true);
            }
            return;
          }
        }

        // Offscreen removal
        if (e.y > height + 80) {
          state.enemies.splice(i, 1);
        }
      }

      // Speed up slowly
      state.speed = Math.min(13, 5 + state.score / 2000);

      // DRAW CANVAS
      // Grass/Shoulder
      ctx.fillStyle = '#064E3B';
      ctx.fillRect(0, 0, width, height);

      // Tarmac
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(30, 0, width - 60, height);

      // Road boundaries
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(28, 0, 4, height);
      ctx.fillRect(width - 32, 0, 4, height);

      // Lane dividers (Dashed lines)
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -state.roadOffset;

      ctx.beginPath();
      ctx.moveTo(142, 0);
      ctx.lineTo(142, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(258, 0);
      ctx.lineTo(258, height);
      ctx.stroke();

      ctx.setLineDash([]); // Reset dash

      // Draw enemies
      for (const e of state.enemies) {
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(e.x - 16, e.y - 28, 32, 56, 6);
        ctx.fill();

        // Windshield
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(e.x - 11, e.y - 5, 22, 12);
        ctx.shadowBlur = 0;
      }

      // Draw player car
      ctx.fillStyle = state.nitroActive ? '#06B6D4' : '#A855F7';
      ctx.shadowColor = state.nitroActive ? '#22D3EE' : '#C084FC';
      ctx.shadowBlur = state.nitroActive ? 25 : 12;
      ctx.beginPath();
      ctx.roundRect(state.carX - 16, state.carY - 28, 32, 56, 6);
      ctx.fill();

      // Cockpit / roof
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(state.carX - 10, state.carY - 10, 20, 22);

      // Headlights
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(state.carX - 14, state.carY - 28, 6, 4);
      ctx.fillRect(state.carX + 8, state.carY - 28, 6, 4);

      // Nitro exhaust flames
      if (state.nitroActive) {
        ctx.fillStyle = '#06B6D4';
        ctx.beginPath();
        ctx.moveTo(state.carX - 8, state.carY + 28);
        ctx.lineTo(state.carX, state.carY + 45 + Math.random() * 10);
        ctx.lineTo(state.carX + 8, state.carY + 28);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, highScore]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-lg mx-auto">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-slate-700/60 rounded-xl px-4 py-3 mb-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-purple-500/30">
            <span className="text-xs text-slate-400 block font-medium">DISTANCE</span>
            <span className="text-xl font-bold font-display text-white">{score}m</span>
          </div>

          <div className="bg-[#0B1020] px-3 py-1.5 rounded-lg border border-cyan-500/30 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <div className="w-16 bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2.5 rounded-full"
                style={{ width: `${nitro}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(sound.toggleMute())}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={startGame}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isPlaying ? 'Restart' : 'Race Now'}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full aspect-[400/400] max-w-[400px] bg-[#0B1020] rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl">
        <canvas ref={canvasRef} width={400} height={400} className="w-full h-full block" />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <h3 className="text-2xl font-bold font-display text-white mb-2">Turbo Nitro Velocity</h3>
            <p className="text-slate-300 text-xs mb-6 max-w-xs">
              Weave through oncoming cyber cars across 3 lanes. Press Space or tap Turbo for supersonic boost!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-500/30 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> START ENGINE
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="text-red-500 font-display font-black text-3xl mb-1 tracking-wider">VEHICLE CRASHED</div>
            <p className="text-slate-400 text-xs mb-4">Traffic collision detected.</p>
            <div className="bg-[#172033] border border-slate-700 rounded-xl px-6 py-2.5 mb-4">
              <span className="text-xs text-slate-400 font-semibold uppercase">Distance Travelled</span>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {score}m
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
              {score >= 300 && (
                <button
                  onClick={() => setShowScoreModal(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Leaderboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 flex items-center justify-between w-full max-w-[400px] px-2 md:hidden">
        <button
          onClick={() => changeLane('LEFT')}
          className="p-3 bg-[#172033] active:bg-purple-600 border border-slate-700 rounded-xl text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={activateNitro}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
        >
          <Zap className="w-4 h-4 inline mr-1 fill-white" /> Nitro
        </button>
        <button
          onClick={() => changeLane('RIGHT')}
          className="p-3 bg-[#172033] active:bg-purple-600 border border-slate-700 rounded-xl text-white"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        gameId="speed-racer"
        gameTitle="Turbo Nitro Velocity"
        score={score}
      />
    </div>
  );
};
