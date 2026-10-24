export type GameCategory = 
  | 'Puzzle'
  | 'Action'
  | 'Racing'
  | 'Arcade'
  | 'Adventure'
  | 'Brain Training';

export type GameType = 'builtin' | 'external';

export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  thumbnail: string;
  gameType: GameType;
  gameUrl?: string; // For external games or internal identifier
  featured: boolean;
  popularity: number; // 0 - 100
  rating: number; // e.g., 4.9
  playsCount: number;
  dateAdded: string; // ISO date string
  instructions: string[];
  controls: {
    desktop: string;
    mobile: string;
  };
  tags?: string[];
}

export interface LeaderboardEntry {
  id: string;
  gameId: string;
  gameTitle: string;
  playerName: string;
  score: number;
  date: string;
  badge?: string;
}

export interface AdminStats {
  totalGames: number;
  totalPlays: number;
  featuredGames: number;
  categoriesCount: number;
  topGame: string;
}
