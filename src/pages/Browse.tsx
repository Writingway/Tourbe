import { FC, useState, useMemo } from 'react';
import whiskiesData from '../data/whiskies.json';
import { WhiskyDataSchema, type Whisky, type Region, type PriceBand, type StyleTag } from '../lib/scoring.types';
import { Navigation } from '../components/Navigation';

export const Browse: FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | 'ALL'>('ALL');
  const [selectedPrice, setSelectedPrice] = useState<PriceBand | 'ALL'>('ALL');
  const [selectedStyle, setSelectedStyle] = useState<StyleTag | 'ALL'>('ALL');
  const [selectedDistillery, setSelectedDistillery] = useState<string>('ALL');
  const [minAbv, setMinAbv] = useState<number>(0);
  const [maxAbv, setMaxAbv] = useState<number>(100);
  const [searchTerm, setSearchTerm] = useState<string>('');

  let whiskies: Whisky[] = [];
  let validationError: string | null = null;

  try {
    whiskies = WhiskyDataSchema.parse(whiskiesData);
  } catch (error) {
    validationError = 'Failed to load whiskies data';
    console.error(error);
  }

  // Extract unique distilleries
  const distilleries = useMemo(() => {
    const uniqueDistilleries = [...new Set(whiskies.map((w) => w.distillery))].sort();
    return ['ALL', ...uniqueDistilleries];
  }, [whiskies]);

  // Extract unique style tags
  const styleTags = useMemo(() => {
    const allStyles = whiskies.flatMap((w) => w.style);
    const uniqueStyles = [...new Set(allStyles)].sort();
    return ['ALL', ...uniqueStyles] as (StyleTag | 'ALL')[];
  }, [whiskies]);

  const filteredWhiskies = useMemo(() => {
    return whiskies.filter((w) => {
      if (selectedRegion !== 'ALL' && w.region !== selectedRegion) return false;
      if (selectedPrice !== 'ALL' && w.priceBand !== selectedPrice) return false;
      if (selectedStyle !== 'ALL' && !w.style.includes(selectedStyle)) return false;
      if (selectedDistillery !== 'ALL' && w.distillery !== selectedDistillery) return false;
      if (w.abv < minAbv || w.abv > maxAbv) return false;
      if (searchTerm && !w.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [whiskies, selectedRegion, selectedPrice, selectedStyle, selectedDistillery, minAbv, maxAbv, searchTerm]);

  const regions: (Region | 'ALL')[] = [
    'ALL',
    'SCOTLAND_ISLAY',
    'SCOTLAND_SPEYSIDE',
    'SCOTLAND_HIGHLANDS',
    'SCOTLAND_ISLANDS',
    'SCOTLAND_LOWLANDS',
    'IRELAND',
    'JAPAN',
    'USA_BOURBON',
    'USA_RYE',
    'INDIA',
    'TAIWAN',
    'OTHER',
  ];

  const prices: (PriceBand | 'ALL')[] = ['ALL', 'UNDER_40', '40_70', '70_120', 'OVER_120'];

  const formatRegion = (region: string) => {
    return region.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatPrice = (price: string) => {
    if (price === 'ALL') return 'Tous les prix';
    if (price === 'UNDER_40') return '< 40€';
    if (price === '40_70') return '40-70€';
    if (price === '70_120') return '70-120€';
    if (price === 'OVER_120') return '> 120€';
    return price;
  };

  const formatStyle = (style: string) => {
    if (style === 'ALL') return 'Tous les styles';
    return style.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const resetFilters = () => {
    setSelectedRegion('ALL');
    setSelectedPrice('ALL');
    setSelectedStyle('ALL');
    setSelectedDistillery('ALL');
    setMinAbv(0);
    setMaxAbv(100);
    setSearchTerm('');
  };

  if (validationError) {
    return (
      <div className="min-h-screen textured-bg flex items-center justify-center px-4">
        <div className="card max-w-lg p-8">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Erreur</h1>
          <p className="text-cream-300">{validationError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen textured-bg">
      <Navigation currentPath="/browse" />

      <div className="max-w-7xl mx-auto px-4 py-12 mt-7">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-4">
            Parcourir la Collection
          </h1>
          <p className="text-cream-300 text-lg">
            Explorez notre sélection de {whiskies.length} whiskies du monde entier
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un whisky par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 bg-dark-800 border border-gold-400/20 rounded-full text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
          />
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-serif font-bold text-gold-400 mb-4">Filtres</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-cream-300 mb-2">Région</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region | 'ALL')}
                className="w-full px-4 py-2 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {formatRegion(region)}
                  </option>
                ))}
              </select>
            </div>

            {/* Distillery Filter */}
            <div>
              <label className="block text-sm font-medium text-cream-300 mb-2">Distillerie</label>
              <select
                value={selectedDistillery}
                onChange={(e) => setSelectedDistillery(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
              >
                {distilleries.map((distillery) => (
                  <option key={distillery} value={distillery}>
                    {distillery === 'ALL' ? 'Toutes les distilleries' : distillery}
                  </option>
                ))}
              </select>
            </div>

            {/* Style Filter */}
            <div>
              <label className="block text-sm font-medium text-cream-300 mb-2">Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as StyleTag | 'ALL')}
                className="w-full px-4 py-2 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
              >
                {styleTags.map((style) => (
                  <option key={style} value={style}>
                    {formatStyle(style)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-cream-300 mb-2">Gamme de prix</label>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value as PriceBand | 'ALL')}
                className="w-full px-4 py-2 bg-dark-700 border border-gold-400/20 rounded-lg text-cream-100 focus:outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/30"
              >
                {prices.map((price) => (
                  <option key={price} value={price}>
                    {formatPrice(price)}
                  </option>
                ))}
              </select>
            </div>

            {/* ABV Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-cream-300 mb-2">
                Degré d'alcool (ABV): {minAbv}% - {maxAbv}%
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="35"
                  max="70"
                  value={minAbv}
                  onChange={(e) => setMinAbv(Number(e.target.value))}
                  className="flex-1 h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-gold-400"
                />
                <span className="text-cream-400 text-sm w-12">Min</span>
                <input
                  type="range"
                  min="35"
                  max="70"
                  value={maxAbv}
                  onChange={(e) => setMaxAbv(Number(e.target.value))}
                  className="flex-1 h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-gold-400"
                />
                <span className="text-cream-400 text-sm w-12">Max</span>
              </div>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-dark-700 hover:bg-dark-600 border border-gold-400/30 rounded-full text-cream-200 text-sm font-medium transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-cream-400">
            <span className="text-gold-400 font-bold">{filteredWhiskies.length}</span> whiskies trouvés
          </p>
        </div>

        {/* Whiskies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWhiskies.map((whisky) => (
            <div key={whisky.id} className="card p-6 hover:scale-[1.02] transition-transform cursor-pointer">
              {/* Whisky Icon/Visual */}
              <div className="mb-4 flex items-center justify-center">
                <div className="w-16 h-20 border-3 border-gold-400/50 rounded-b-full relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-400"
                    style={{ height: `${Math.min(whisky.abv, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Whisky Info */}
              <h3 className="text-xl font-serif font-bold text-cream-100 mb-1 text-center">
                {whisky.name}
              </h3>
              <p className="text-sm text-gold-400 mb-3 text-center">{whisky.distillery}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="px-3 py-1 bg-gold-400/10 border border-gold-400/30 rounded-full text-xs text-gold-400">
                  {formatRegion(whisky.region)}
                </span>
                <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-xs text-amber-400">
                  {whisky.abv}% ABV
                </span>
                <span className="px-3 py-1 bg-caramel-400/10 border border-caramel-400/30 rounded-full text-xs text-caramel-400">
                  {formatPrice(whisky.priceBand)}
                </span>
              </div>

              {/* Tasting Note */}
              <p className="text-sm text-cream-400 mb-4 text-center line-clamp-2">
                {whisky.tastingNoteShort}
              </p>

              {/* Style Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {whisky.style.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-dark-700 text-cream-400 rounded border border-gold-400/20"
                  >
                    {formatStyle(tag)}
                  </span>
                ))}
                {whisky.style.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-dark-700 text-cream-500 rounded border border-gold-400/20">
                    +{whisky.style.length - 3}
                  </span>
                )}
              </div>

              {/* View Button */}
              <button
                onClick={() => (window.location.href = `/map?id=${whisky.id}`)}
                className="w-full py-2 bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 rounded-full text-gold-400 text-sm font-medium transition-all"
              >
                Voir la distillerie
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWhiskies.length === 0 && (
          <div className="text-center py-12">
            <div className="card p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🥃</div>
              <h3 className="text-xl font-serif font-bold text-cream-100 mb-2">
                Aucun whisky trouvé
              </h3>
              <p className="text-cream-400 mb-6">
                Aucun whisky ne correspond à vos critères de recherche
              </p>
              <button onClick={resetFilters} className="btn-primary">
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="btn-secondary"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
