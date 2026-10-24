import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, XCircle, Gamepad2 } from 'lucide-react';
import { Game } from '../types';
import { storage } from '../utils/storage';
import { GameCard } from '../components/common/GameCard';
import { AdBanner } from '../components/common/AdBanner';

export const AllGamesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState<Game[]>(() => storage.getGames());
  const categories = useMemo(() => ['All', ...storage.getCategories()], []);

  // Read search params
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'popular';
  const searchQuery = searchParams.get('q') || '';

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleUpdate = () => setGames(storage.getGames());
    window.addEventListener('playzone_games_updated', handleUpdate);
    return () => window.removeEventListener('playzone_games_updated', handleUpdate);
  }, []);

  const handleCategoryChange = (category: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', category);
    }
    setSearchParams(nextParams);
  };

  const handleSortChange = (sort: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', sort);
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      nextParams.set('q', localSearch.trim());
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    setSearchParams(new URLSearchParams());
  };

  // Filter and sort games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Category filter
        if (currentCategory !== 'All' && game.category.toLowerCase() !== currentCategory.toLowerCase()) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = game.title.toLowerCase().includes(query);
          const matchesDesc = game.description.toLowerCase().includes(query);
          const matchesTags = game.tags?.some((t) => t.toLowerCase().includes(query));
          if (!matchesTitle && !matchesDesc && !matchesTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (currentSort === 'popular') return b.popularity - a.popularity;
        if (currentSort === 'newest') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        if (currentSort === 'rating') return b.rating - a.rating;
        if (currentSort === 'name') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, currentCategory, searchQuery, currentSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
            All Free Online Games
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse our full library of {games.length} high-octane browser games
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by title, tag..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#172033] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </form>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#172033] border border-slate-700/60 rounded-2xl">
        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                currentCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-[#0B1020] text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-400 font-semibold">Sort by:</span>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-[#0B1020] border border-slate-700 text-white text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {(currentCategory !== 'All' || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Active Filters:</span>
          {currentCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Category: {currentCategory}
              <button onClick={() => handleCategoryChange('All')}>
                <XCircle className="w-3.5 h-3.5 hover:text-white" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Search: "{searchQuery}"
              <button onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete('q');
                setSearchParams(next);
              }}>
                <XCircle className="w-3.5 h-3.5 hover:text-white" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-slate-400 hover:text-white underline ml-2"
          >
            Reset all
          </button>
        </div>
      )}

      {/* Games Grid or Empty State */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#172033] border border-slate-800 rounded-3xl max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">No Games Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            We couldn't find any games matching "{searchQuery || currentCategory}". Try checking for spelling errors or clearing your filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Ad Section */}
      <AdBanner type="banner" />
    </div>
  );
};
