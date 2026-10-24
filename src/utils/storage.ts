import { Game, GameCategory, LeaderboardEntry } from '../types';
import { DEFAULT_GAMES, INITIAL_LEADERBOARD } from '../data/defaultGames';

const GAMES_STORAGE_KEY = 'playzone_games_v2';
const LEADERBOARD_STORAGE_KEY = 'playzone_leaderboard_v2';
const CATEGORIES_STORAGE_KEY = 'playzone_categories_v2';

export const DEFAULT_CATEGORIES: GameCategory[] = [
  'Puzzle',
  'Action',
  'Racing',
  'Arcade',
  'Adventure',
  'Brain Training'
];

// Helper to safely access localStorage
export const storage = {
  getGames(): Game[] {
    try {
      const data = localStorage.getItem(GAMES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(DEFAULT_GAMES));
        return DEFAULT_GAMES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_GAMES;
    }
  },

  getGameById(id: string): Game | undefined {
    const games = this.getGames();
    return games.find((g) => g.id.toLowerCase() === id.toLowerCase());
  },

  saveGames(games: Game[]): void {
    try {
      localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
      window.dispatchEvent(new CustomEvent('playzone_games_updated', { detail: games }));
    } catch (err) {
      console.error('Failed to save games to localStorage', err);
    }
  },

  addGame(game: Game): void {
    const games = this.getGames();
    const exists = games.findIndex((g) => g.id === game.id);
    if (exists >= 0) {
      games[exists] = game;
    } else {
      games.unshift(game);
    }
    this.saveGames(games);
  },

  updateGame(game: Game): void {
    const games = this.getGames();
    const index = games.findIndex((g) => g.id === game.id);
    if (index !== -1) {
      games[index] = game;
      this.saveGames(games);
    }
  },

  deleteGame(id: string): void {
    const games = this.getGames();
    const updated = games.filter((g) => g.id !== id);
    this.saveGames(updated);
  },

  incrementPlayCount(gameId: string): void {
    const games = this.getGames();
    const index = games.findIndex((g) => g.id === gameId);
    if (index !== -1) {
      games[index].playsCount = (games[index].playsCount || 0) + 1;
      this.saveGames(games);
    }
  },

  resetGamesToDefault(): Game[] {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(DEFAULT_GAMES));
    window.dispatchEvent(new CustomEvent('playzone_games_updated', { detail: DEFAULT_GAMES }));
    return DEFAULT_GAMES;
  },

  // Categories
  getCategories(): string[] {
    try {
      const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  addCategory(category: string): void {
    const cats = this.getCategories();
    if (!cats.includes(category)) {
      cats.push(category);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
    }
  },

  // Leaderboard
  getLeaderboard(gameId?: string): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      let entries: LeaderboardEntry[] = [];
      if (!data) {
        localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
        entries = INITIAL_LEADERBOARD;
      } else {
        entries = JSON.parse(data);
      }

      if (gameId) {
        entries = entries.filter((e) => e.gameId === gameId);
      }

      // Sort descending by score
      return entries.sort((a, b) => b.score - a.score);
    } catch {
      return INITIAL_LEADERBOARD;
    }
  },

  addLeaderboardScore(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry {
    const all = this.getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: 'lb-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    all.push(newEntry);
    all.sort((a, b) => b.score - a.score);

    // Keep top 50
    const trimmed = all.slice(0, 50);
    try {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(trimmed));
      window.dispatchEvent(new CustomEvent('playzone_leaderboard_updated', { detail: trimmed }));
    } catch (err) {
      console.error('Failed to save leaderboard', err);
    }

    return newEntry;
  },

  getPersonalHighScore(gameId: string): number {
    try {
      const val = localStorage.getItem(`playzone_highscore_${gameId}`);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  setPersonalHighScore(gameId: string, score: number): boolean {
    const current = this.getPersonalHighScore(gameId);
    if (score > current) {
      try {
        localStorage.setItem(`playzone_highscore_${gameId}`, String(score));
        return true; // New record
      } catch {
        return false;
      }
    }
    return false;
  }
};
