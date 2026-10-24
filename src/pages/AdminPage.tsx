import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, Eye, Flame, RotateCcw, Check, X, Search, Sparkles, FolderPlus, AlertTriangle } from 'lucide-react';
import { Game, GameCategory } from '../types';
import { storage } from '../utils/storage';

export const AdminPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>(() => storage.getGames());
  const [categories, setCategories] = useState<string[]>(() => storage.getCategories());
  const [searchFilter, setSearchFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    category: 'Arcade' as GameCategory,
    thumbnail: '',
    gameType: 'builtin' as 'builtin' | 'external',
    gameUrl: '',
    featured: false,
    rating: 4.8,
    popularity: 90,
    instructions: 'Use keyboard controls to play.\nReach high scores!',
    desktopControls: 'Arrow keys / Mouse',
    mobileControls: 'Touch buttons on screen',
    tags: 'Arcade, Casual',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setGames(storage.getGames());
      setCategories(storage.getCategories());
    };
    window.addEventListener('playzone_games_updated', handleUpdate);
    return () => window.removeEventListener('playzone_games_updated', handleUpdate);
  }, []);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingGame(null);
    setFormState({
      title: '',
      description: '',
      category: (categories[0] as GameCategory) || 'Arcade',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      gameType: 'builtin',
      gameUrl: '',
      featured: false,
      rating: 4.8,
      popularity: 85,
      instructions: 'Use arrow keys to navigate.\nCollect items and avoid obstacles.',
      desktopControls: 'Arrow Keys / WASD',
      mobileControls: 'On-screen virtual controls',
      tags: 'Action, Web',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (game: Game) => {
    setEditingGame(game);
    setFormState({
      title: game.title,
      description: game.description,
      category: game.category,
      thumbnail: game.thumbnail,
      gameType: game.gameType,
      gameUrl: game.gameUrl || '',
      featured: game.featured,
      rating: game.rating,
      popularity: game.popularity,
      instructions: game.instructions.join('\n'),
      desktopControls: game.controls.desktop,
      mobileControls: game.controls.mobile,
      tags: game.tags?.join(', ') || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.title.trim()) {
      alert('Please provide a title');
      return;
    }

    const instructionsArray = formState.instructions
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const tagsArray = formState.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingGame) {
      // Update
      const updated: Game = {
        ...editingGame,
        title: formState.title.trim(),
        description: formState.description.trim(),
        category: formState.category,
        thumbnail: formState.thumbnail.trim(),
        gameType: formState.gameType,
        gameUrl: formState.gameUrl.trim() || undefined,
        featured: formState.featured,
        rating: Number(formState.rating),
        popularity: Number(formState.popularity),
        instructions: instructionsArray,
        controls: {
          desktop: formState.desktopControls,
          mobile: formState.mobileControls,
        },
        tags: tagsArray,
      };
      storage.updateGame(updated);
      showStatus(`Updated "${updated.title}" successfully!`);
    } else {
      // Add
      const slug = formState.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const newGame: Game = {
        id: slug || `game-${Date.now()}`,
        title: formState.title.trim(),
        description: formState.description.trim(),
        category: formState.category,
        thumbnail: formState.thumbnail.trim(),
        gameType: formState.gameType,
        gameUrl: formState.gameUrl.trim() || undefined,
        featured: formState.featured,
        rating: Number(formState.rating),
        popularity: Number(formState.popularity),
        playsCount: 0,
        dateAdded: new Date().toISOString().split('T')[0],
        instructions: instructionsArray,
        controls: {
          desktop: formState.desktopControls,
          mobile: formState.mobileControls,
        },
        tags: tagsArray,
      };
      storage.addGame(newGame);
      showStatus(`Added "${newGame.title}" successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteGame = (game: Game) => {
    if (confirm(`Are you sure you want to delete "${game.title}"?`)) {
      storage.deleteGame(game.id);
      showStatus(`Deleted "${game.title}".`);
    }
  };

  const handleToggleFeatured = (game: Game) => {
    const updated = { ...game, featured: !game.featured };
    storage.updateGame(updated);
    showStatus(`Toggled featured status for "${game.title}".`);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset game catalog to default system presets? Any newly added games will be erased.')) {
      storage.resetGamesToDefault();
      showStatus('Catalog successfully restored to factory defaults!');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    storage.addCategory(newCategoryName.trim());
    setCategories(storage.getCategories());
    setNewCategoryName('');
    showStatus(`Category "${newCategoryName.trim()}" added!`);
  };

  // Stats calculation
  const totalGames = games.length;
  const totalPlays = games.reduce((acc, g) => acc + (g.playsCount || 0), 0);
  const featuredCount = games.filter((g) => g.featured).length;
  const topGame = [...games].sort((a, b) => b.playsCount - a.playsCount)[0];

  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    g.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Exam Notice Banner */}
      <div className="p-4 bg-purple-950/40 border border-purple-500/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              PlayZone Admin Operations Console
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Evaluation Mode Active
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Persistent Local Storage Engine · Instant public portal synchronization across all client routes.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore Defaults
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Game
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" /> {statusMessage}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#172033] border border-slate-700/60 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Total Games</span>
          <span className="text-3xl font-black font-display text-white mt-1 block">{totalGames}</span>
          <span className="text-[11px] text-cyan-400 mt-1 block">Live in catalog</span>
        </div>
        <div className="bg-[#172033] border border-slate-700/60 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Total Plays</span>
          <span className="text-3xl font-black font-display text-white mt-1 block">{totalPlays.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-400 mt-1 block">Engagement sessions</span>
        </div>
        <div className="bg-[#172033] border border-slate-700/60 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Featured Titles</span>
          <span className="text-3xl font-black font-display text-purple-400 mt-1 block">{featuredCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Promoted on homepage</span>
        </div>
        <div className="bg-[#172033] border border-slate-700/60 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Top Game</span>
          <span className="text-base font-bold text-cyan-300 mt-2 block truncate">
            {topGame ? topGame.title : 'None'}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {topGame ? `${topGame.playsCount.toLocaleString()} plays` : '-'}
          </span>
        </div>
      </div>

      {/* Category Manager Bar */}
      <div className="bg-[#172033] border border-slate-700/60 p-5 rounded-2xl">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-3">
          Manage Game Categories
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {categories.map((cat) => {
            const count = games.filter((g) => g.category.toLowerCase() === cat.toLowerCase()).length;
            return (
              <span
                key={cat}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0B1020] border border-slate-700 text-slate-300 flex items-center gap-1.5"
              >
                <span>{cat}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  {count}
                </span>
              </span>
            );
          })}
        </div>
        <form onSubmit={handleAddCategory} className="flex gap-2 max-w-sm">
          <input
            type="text"
            placeholder="New Category Name..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-[#0B1020] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
          >
            <FolderPlus className="w-3.5 h-3.5" /> Add
          </button>
        </form>
      </div>

      {/* Game Catalog Table */}
      <div className="bg-[#172033] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Toolbar */}
        <div className="p-4 bg-[#0B1020]/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="font-display font-bold text-base text-white">
            Games Catalog ({filteredGames.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search table..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#172033] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1020]/90 uppercase text-[11px] font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Game</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Featured</th>
                <th className="px-5 py-3.5">Plays</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredGames.map((game) => (
                <tr key={game.id} className="hover:bg-slate-800/40 transition">
                  {/* Title & Thumbnail */}
                  <td className="px-5 py-3 flex items-center gap-3">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-white block text-sm">{game.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {game.id}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {game.category}
                    </span>
                  </td>

                  {/* Game Type */}
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${game.gameType === 'builtin' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                      {game.gameType === 'builtin' ? 'HTML5 Native' : 'External Web'}
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggleFeatured(game)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition flex items-center gap-1 ${
                        game.featured
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      {game.featured ? 'Featured' : 'Standard'}
                    </button>
                  </td>

                  {/* Plays */}
                  <td className="px-5 py-3 font-mono font-medium">
                    {game.playsCount.toLocaleString()}
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-3 text-amber-400 font-semibold font-mono">
                    ★ {game.rating.toFixed(1)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(game)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition"
                        title="Edit Game"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGame(game)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                        title="Delete Game"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Game Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#172033] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
              <h3 className="text-xl font-bold font-display text-white">
                {editingGame ? `Edit Game: ${editingGame.title}` : 'Add New Game'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value as GameCategory })}
                    className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail Image URL *</label>
                <input
                  type="url"
                  required
                  value={formState.thumbnail}
                  onChange={(e) => setFormState({ ...formState, thumbnail: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Game Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Game Implementation Type</label>
                  <select
                    value={formState.gameType}
                    onChange={(e) => setFormState({ ...formState, gameType: e.target.value as 'builtin' | 'external' })}
                    className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="builtin">Built-in HTML5 Canvas Game</option>
                    <option value="external">External Sandboxed Web Game</option>
                  </select>
                </div>

                {/* External Game URL (if external) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {formState.gameType === 'external' ? 'External Game URL *' : 'Internal Component ID'}
                  </label>
                  <input
                    type="text"
                    placeholder={formState.gameType === 'external' ? 'https://play2048.co/' : 'e.g. snake, breakout'}
                    value={formState.gameUrl}
                    onChange={(e) => setFormState({ ...formState, gameUrl: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instructions (One per line)</label>
                <textarea
                  rows={2}
                  value={formState.instructions}
                  onChange={(e) => setFormState({ ...formState, instructions: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Desktop Controls</label>
                  <input
                    type="text"
                    value={formState.desktopControls}
                    onChange={(e) => setFormState({ ...formState, desktopControls: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Controls</label>
                  <input
                    type="text"
                    value={formState.mobileControls}
                    onChange={(e) => setFormState({ ...formState, mobileControls: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Featured toggle & Rating */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.featured}
                    onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-200">Highlight as Featured Game on Homepage</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Rating:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formState.rating}
                    onChange={(e) => setFormState({ ...formState, rating: parseFloat(e.target.value) })}
                    className="w-16 px-2 py-1 bg-[#0B1020] border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  {editingGame ? 'Save Changes' : 'Create Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
