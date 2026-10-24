import { Game } from '../types';

export const DEFAULT_GAMES: Game[] = [
  {
    id: 'snake',
    title: 'Neon Snake Arena',
    description: 'The arcade classic reinvented with glowing neon graphics, dynamic food spawns, and speed ramping! Collect energy orbs and avoid the walls and your own tail.',
    category: 'Arcade',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    gameType: 'builtin',
    featured: true,
    popularity: 98,
    rating: 4.9,
    playsCount: 14205,
    dateAdded: '2026-10-15',
    instructions: [
      'Use Arrow Keys or W/A/S/D on desktop to steer your neon snake.',
      'On mobile devices, use the touch D-Pad controls below the canvas.',
      'Eat glowing energy spheres to grow longer and gain 10 points each.',
      'Avoid running into the arena walls or colliding with your own body.',
      'Speed increases every 50 points—maintain your focus!'
    ],
    controls: {
      desktop: 'Arrow Keys / WASD to change direction, Space to Pause',
      mobile: 'Touch D-Pad directional buttons'
    },
    tags: ['Classic', 'Retro', 'Fast-Paced', 'High Score']
  },
  {
    id: 'breakout',
    title: 'Cyber Breakout',
    description: 'Smash through high-tech cyber brick walls! Bounce the energy sphere, break durable multi-hit blocks, and catch falling power-ups without dropping the ball.',
    category: 'Action',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    gameType: 'builtin',
    featured: true,
    popularity: 95,
    rating: 4.8,
    playsCount: 11840,
    dateAdded: '2026-10-18',
    instructions: [
      'Control the paddle along the bottom of the cyber arena.',
      'Bounce the sphere to shatter all the floating brick matrix layers.',
      'Bricks yield 10-30 points depending on row tier; gold bricks take two hits.',
      'The ball reflects at dynamic angles based on where it strikes the paddle.',
      'Catch glowing power-up capsules (expanded paddle, bonus points, extra life).',
      'You start with 3 lives. Do not let the ball drop below the bottom line!'
    ],
    controls: {
      desktop: 'Mouse movement or Left/Right Arrow keys / A and D',
      mobile: 'Drag paddle or tap left/right touch buttons'
    },
    tags: ['Arcade', 'Action', 'Physics', 'Powerups']
  },
  {
    id: 'tic-tac-toe',
    title: 'Neon Tic-Tac-Toe',
    description: 'The beloved classic with an unbeatable Smart AI mode powered by the Minimax algorithm, plus casual AI and 2-Player pass-and-play mode with glowing cyber visuals.',
    category: 'Puzzle',
    thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80',
    gameType: 'builtin',
    featured: true,
    popularity: 91,
    rating: 4.7,
    playsCount: 9540,
    dateAdded: '2026-10-10',
    instructions: [
      'Choose your game mode: Smart AI, Casual AI, or 2-Player Pass & Play.',
      'Click or tap any empty grid cell to place your glowing marker (X or O).',
      'Align three of your markers horizontally, vertically, or diagonally to win.',
      'Track your head-to-head win, loss, and draw streaks across rounds.'
    ],
    controls: {
      desktop: 'Mouse click on grid squares',
      mobile: 'Tap on grid squares'
    },
    tags: ['Strategy', 'AI', 'Turn-Based', '2-Player']
  },
  {
    id: 'memory-match',
    title: 'Arcade Memory Matrix',
    description: 'Test your photographic memory and reflexes! Uncover and match pairs of legendary gaming icons in the fewest moves and quickest time possible.',
    category: 'Brain Training',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    gameType: 'builtin',
    featured: false,
    popularity: 88,
    rating: 4.8,
    playsCount: 8120,
    dateAdded: '2026-10-12',
    instructions: [
      'Click on any facedown card to reveal the hidden gaming icon.',
      'Click a second card to find its identical twin match.',
      'If they match, they stay unlocked with a victory glow! If not, they flip back.',
      'Clear all 8 pairs in the fewest moves to earn a 3-star rating.'
    ],
    controls: {
      desktop: 'Click on cards to flip them',
      mobile: 'Tap cards to flip them'
    },
    tags: ['Memory', 'Brain', 'Cards', 'Casual']
  },
  {
    id: 'number-puzzle',
    title: '15-Tile Quantum Slide',
    description: 'Slide numbered quantum blocks into numerical order from 1 to 15! Features guaranteed solvable scrambling and instantaneous move tracking.',
    category: 'Brain Training',
    thumbnail: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80',
    gameType: 'builtin',
    featured: false,
    popularity: 84,
    rating: 4.6,
    playsCount: 6850,
    dateAdded: '2026-10-14',
    instructions: [
      'The board consists of numbers 1-15 and one empty glowing space.',
      'Click or tap any tile adjacent to the empty slot to slide it into position.',
      'On desktop, you can also use Arrow Keys to nudge tiles into the blank space.',
      'Arrange all tiles from left to right, row by row (1 through 15) to win!'
    ],
    controls: {
      desktop: 'Mouse click adjacent tiles or use Arrow Keys',
      mobile: 'Tap adjacent tiles to slide them'
    },
    tags: ['Logic', 'Math', 'Puzzle', 'Challenging']
  },
  {
    id: 'speed-racer',
    title: 'Turbo Nitro Velocity',
    description: 'High octane retro cyber racing! Weave through futuristic hyperway traffic, dodge oil slicks, collect nitro boosts, and beat the distance record.',
    category: 'Racing',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    gameType: 'builtin',
    featured: true,
    popularity: 96,
    rating: 4.8,
    playsCount: 13420,
    dateAdded: '2026-10-20',
    instructions: [
      'Steer your sports car left and right between the three highway lanes.',
      'Dodge incoming competitor vehicles and obstacles.',
      'Collect glowing cyan fuel canisters to recharge your Nitro speed boost.',
      'Press Space or tap Nitro button for supersonic invulnerability burst!'
    ],
    controls: {
      desktop: 'Left/Right Arrow Keys or A/D to switch lanes, Space for Turbo',
      mobile: 'Steer Left/Right touch buttons and Nitro button'
    },
    tags: ['Racing', 'Speed', 'Reflexes', 'Vehicles']
  },
  {
    id: 'dungeon-quest',
    title: 'Pixel Quest: Crystal Caverns',
    description: 'Embark on an epic 8-bit dungeon crawler adventure. Explore mysterious procedural maze rooms, collect treasures, avoid traps, and find the ancient crystal.',
    category: 'Adventure',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    gameType: 'builtin',
    featured: false,
    popularity: 89,
    rating: 4.7,
    playsCount: 7910,
    dateAdded: '2026-10-19',
    instructions: [
      'Navigate your heroic knight through the dark labyrinth levels.',
      'Collect gold coins, health potions, and keys to unlock stone gates.',
      'Slay wandering skeletons by approaching them with your enchanted blade.',
      'Reach the golden portal on each floor to delve deeper into the dungeon.'
    ],
    controls: {
      desktop: 'Arrow Keys or WASD to move, Space to Attack / Interact',
      mobile: 'Virtual D-pad and Action button'
    },
    tags: ['Adventure', 'RPG', 'Retro', 'Dungeon']
  },
  {
    id: 'space-invaders-web',
    title: 'Galaxy Defender 2048',
    description: 'Defend planet Earth from an alien armada in this external retro space shooter! Classic arcade action with blasting lasers and boss motherships.',
    category: 'Arcade',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    gameType: 'external',
    gameUrl: 'https://play2048.co/',
    featured: false,
    popularity: 82,
    rating: 4.6,
    playsCount: 5230,
    dateAdded: '2026-10-11',
    instructions: [
      'Embedded trusted web game experience running securely in sandbox.',
      'Use Arrow keys to combine identical numbered tiles.',
      'Reach the legendary 2048 tile!'
    ],
    controls: {
      desktop: 'Arrow Keys or Swipe to move tiles',
      mobile: 'Swipe gestures on screen'
    },
    tags: ['Puzzle', 'Web Embed', 'Casual']
  }
];

export const INITIAL_LEADERBOARD = [
  { id: 'lb-1', gameId: 'snake', gameTitle: 'Neon Snake Arena', playerName: 'CyberGhost', score: 480, date: '2026-10-22', badge: '🥇 1st Place' },
  { id: 'lb-2', gameId: 'snake', gameTitle: 'Neon Snake Arena', playerName: 'PixelViper', score: 390, date: '2026-10-21', badge: '🥈 2nd Place' },
  { id: 'lb-3', gameId: 'snake', gameTitle: 'Neon Snake Arena', playerName: 'ApexPilot', score: 310, date: '2026-10-23', badge: '🥉 3rd Place' },
  { id: 'lb-4', gameId: 'snake', gameTitle: 'Neon Snake Arena', playerName: 'ShadowCoder', score: 240, date: '2026-10-20' },
  { id: 'lb-5', gameId: 'breakout', gameTitle: 'Cyber Breakout', playerName: 'NeonStriker', score: 1450, date: '2026-10-23', badge: '🥇 1st Place' },
  { id: 'lb-6', gameId: 'breakout', gameTitle: 'Cyber Breakout', playerName: 'LaserQueen', score: 1120, date: '2026-10-22', badge: '🥈 2nd Place' },
  { id: 'lb-7', gameId: 'breakout', gameTitle: 'Cyber Breakout', playerName: 'BrickMaster', score: 860, date: '2026-10-21', badge: '🥉 3rd Place' },
  { id: 'lb-8', gameId: 'memory-match', gameTitle: 'Arcade Memory Matrix', playerName: 'MindBender', score: 98, date: '2026-10-22', badge: '🥇 1st Place' },
  { id: 'lb-9', gameId: 'memory-match', gameTitle: 'Arcade Memory Matrix', playerName: 'EchoRider', score: 88, date: '2026-10-21', badge: '🥈 2nd Place' },
  { id: 'lb-10', gameId: 'number-puzzle', gameTitle: '15-Tile Quantum Slide', playerName: 'TileWizard', score: 42, date: '2026-10-23', badge: '🥇 1st Place' },
  { id: 'lb-11', gameId: 'number-puzzle', gameTitle: '15-Tile Quantum Slide', playerName: 'CipherMaster', score: 58, date: '2026-10-20', badge: '🥈 2nd Place' },
  { id: 'lb-12', gameId: 'speed-racer', gameTitle: 'Turbo Nitro Velocity', playerName: 'NitroDrifter', score: 2480, date: '2026-10-23', badge: '🥇 1st Place' },
];
