import { FC, useState } from 'react';
import whiskiesData from '../data/whiskies.json';
import { WhiskyDataSchema, type Whisky, type Region, type PriceBand } from '../lib/scoring.types';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';

export const Browse: FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | 'ALL'>('ALL');
  const [selectedPrice, setSelectedPrice] = useState<PriceBand | 'ALL'>('ALL');

  let whiskies: Whisky[] = [];
  let validationError: string | null = null;

  try {
    whiskies = WhiskyDataSchema.parse(whiskiesData);
  } catch (error) {
    validationError = 'Failed to load whiskies data';
    console.error(error);
  }

  const filteredWhiskies = whiskies.filter((w) => {
    if (selectedRegion !== 'ALL' && w.region !== selectedRegion) return false;
    if (selectedPrice !== 'ALL' && w.priceBand !== selectedPrice) return false;
    return true;
  });

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
    if (price === 'ALL') return 'All Prices';
    if (price === 'UNDER_40') return 'Under €40';
    if (price === '40_70') return '€40-€70';
    if (price === '70_120') return '€70-€120';
    if (price === 'OVER_120') return '€120+';
    return price;
  };

  if (validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="elevated" className="max-w-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{validationError}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Whiskies</h1>
          <p className="text-gray-600">
            Explore our collection of {whiskies.length} carefully curated whiskies from around the
            world
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as Region | 'ALL')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whisky-500 focus:border-transparent"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {formatRegion(region)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value as PriceBand | 'ALL')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whisky-500 focus:border-transparent"
            >
              {prices.map((price) => (
                <option key={price} value={price}>
                  {formatPrice(price)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredWhiskies.length} of {whiskies.length} whiskies
          </p>
        </div>

        {/* Whiskies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWhiskies.map((whisky) => (
            <Card key={whisky.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-gradient-to-br from-whisky-100 to-whisky-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">🥃</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{whisky.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{whisky.distillery}</p>

              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default">{formatRegion(whisky.region)}</Badge>
                <Badge variant="default">{whisky.abv}%</Badge>
                <Badge variant="success">{formatPrice(whisky.priceBand)}</Badge>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {whisky.tastingNoteShort}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {whisky.style.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-whisky-100 text-whisky-800 rounded"
                  >
                    {tag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  (window.location.href = `/map?id=${whisky.id}`)
                }
              >
                View Distillery
              </Button>
            </Card>
          ))}
        </div>

        {filteredWhiskies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No whiskies found matching your filters
            </p>
            <Button
              onClick={() => {
                setSelectedRegion('ALL');
                setSelectedPrice('ALL');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
