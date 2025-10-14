-- =====================================================
-- MIGRATION: Whiskies Table
-- Description: Create whiskies table to store all whisky data
-- Date: 2025-01-14
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS whiskies CASCADE;

-- =====================================================
-- CREATE TABLE: whiskies
-- =====================================================

CREATE TABLE whiskies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN (
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
    'OTHER'
  )),
  distillery TEXT NOT NULL,
  abv DECIMAL(4,1) NOT NULL CHECK (abv >= 35 AND abv <= 75),
  price_band TEXT NOT NULL CHECK (price_band IN ('UNDER_40', '40_70', '70_120', 'OVER_120')),

  -- Style tags stored as array
  style TEXT[] NOT NULL CHECK (array_length(style, 1) >= 4 AND array_length(style, 1) <= 8),

  intensity TEXT NOT NULL CHECK (intensity IN ('LIGHT', 'MEDIUM', 'BOLD')),

  -- Mouthfeel stored as array
  mouthfeel TEXT[] NOT NULL CHECK (array_length(mouthfeel, 1) >= 1 AND array_length(mouthfeel, 1) <= 4),

  -- Finish stored as JSONB
  finish JSONB NOT NULL,

  experimental BOOLEAN NOT NULL DEFAULT false,
  tasting_note_short TEXT NOT NULL CHECK (char_length(tasting_note_short) <= 140),
  image TEXT NOT NULL,

  -- Distillery location stored as JSONB
  distillery_location JSONB NOT NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Index for fast lookups by name (for search)
CREATE INDEX idx_whiskies_name ON whiskies USING gin(to_tsvector('english', name));

-- Index for region filtering
CREATE INDEX idx_whiskies_region ON whiskies(region);

-- Index for price band filtering
CREATE INDEX idx_whiskies_price_band ON whiskies(price_band);

-- Index for ABV range queries
CREATE INDEX idx_whiskies_abv ON whiskies(abv);

-- Index for style tags (GIN index for array contains operations)
CREATE INDEX idx_whiskies_style ON whiskies USING gin(style);

-- Index for intensity filtering
CREATE INDEX idx_whiskies_intensity ON whiskies(intensity);

-- Index for experimental flag
CREATE INDEX idx_whiskies_experimental ON whiskies(experimental);

-- Composite index for common filter combinations
CREATE INDEX idx_whiskies_region_price ON whiskies(region, price_band);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE whiskies ENABLE ROW LEVEL SECURITY;

-- Everyone can read whiskies (public data)
CREATE POLICY "Anyone can view whiskies"
  ON whiskies FOR SELECT
  USING (true);

-- Only admins can insert whiskies
CREATE POLICY "Admins can insert whiskies"
  ON whiskies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update whiskies
CREATE POLICY "Admins can update whiskies"
  ON whiskies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete whiskies
CREATE POLICY "Admins can delete whiskies"
  ON whiskies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_whiskies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_whiskies_updated_at_trigger
  BEFORE UPDATE ON whiskies
  FOR EACH ROW
  EXECUTE FUNCTION update_whiskies_updated_at();

-- =====================================================
-- HELPER FUNCTIONS FOR SEARCH AND FILTERING
-- =====================================================

-- Function to search whiskies by name, distillery, or tasting notes
CREATE OR REPLACE FUNCTION search_whiskies(search_term TEXT)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  distillery TEXT,
  region TEXT,
  abv DECIMAL,
  price_band TEXT,
  style TEXT[],
  intensity TEXT,
  tasting_note_short TEXT,
  image TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.name,
    w.distillery,
    w.region,
    w.abv,
    w.price_band,
    w.style,
    w.intensity,
    w.tasting_note_short,
    w.image,
    ts_rank(
      to_tsvector('english', w.name || ' ' || w.distillery || ' ' || w.tasting_note_short),
      plainto_tsquery('english', search_term)
    ) as rank
  FROM whiskies w
  WHERE
    to_tsvector('english', w.name || ' ' || w.distillery || ' ' || w.tasting_note_short) @@
    plainto_tsquery('english', search_term)
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get whiskies by filters
CREATE OR REPLACE FUNCTION filter_whiskies(
  filter_regions TEXT[] DEFAULT NULL,
  filter_price_bands TEXT[] DEFAULT NULL,
  filter_abv_min DECIMAL DEFAULT NULL,
  filter_abv_max DECIMAL DEFAULT NULL,
  filter_styles TEXT[] DEFAULT NULL,
  filter_intensities TEXT[] DEFAULT NULL,
  filter_experimental BOOLEAN DEFAULT NULL,
  limit_count INTEGER DEFAULT 100,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  distillery TEXT,
  region TEXT,
  abv DECIMAL,
  price_band TEXT,
  style TEXT[],
  intensity TEXT,
  mouthfeel TEXT[],
  finish JSONB,
  experimental BOOLEAN,
  tasting_note_short TEXT,
  image TEXT,
  distillery_location JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.name,
    w.distillery,
    w.region,
    w.abv,
    w.price_band,
    w.style,
    w.intensity,
    w.mouthfeel,
    w.finish,
    w.experimental,
    w.tasting_note_short,
    w.image,
    w.distillery_location
  FROM whiskies w
  WHERE
    (filter_regions IS NULL OR w.region = ANY(filter_regions))
    AND (filter_price_bands IS NULL OR w.price_band = ANY(filter_price_bands))
    AND (filter_abv_min IS NULL OR w.abv >= filter_abv_min)
    AND (filter_abv_max IS NULL OR w.abv <= filter_abv_max)
    AND (filter_styles IS NULL OR w.style && filter_styles)
    AND (filter_intensities IS NULL OR w.intensity = ANY(filter_intensities))
    AND (filter_experimental IS NULL OR w.experimental = filter_experimental)
  ORDER BY w.name
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE whiskies IS 'Stores all whisky products with their characteristics';
COMMENT ON COLUMN whiskies.id IS 'Unique identifier (slug format)';
COMMENT ON COLUMN whiskies.style IS 'Array of style tags (PEATY, SMOKY, FRUITY, etc.)';
COMMENT ON COLUMN whiskies.finish IS 'JSON object with length and notes array';
COMMENT ON COLUMN whiskies.distillery_location IS 'JSON object with lat and lng coordinates';
COMMENT ON COLUMN whiskies.experimental IS 'True for limited editions, cask strength, or experimental releases';

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on the search function to authenticated users
GRANT EXECUTE ON FUNCTION search_whiskies(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_whiskies(TEXT) TO anon;

-- Grant usage on the filter function to authenticated users
GRANT EXECUTE ON FUNCTION filter_whiskies(TEXT[], TEXT[], DECIMAL, DECIMAL, TEXT[], TEXT[], BOOLEAN, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION filter_whiskies(TEXT[], TEXT[], DECIMAL, DECIMAL, TEXT[], TEXT[], BOOLEAN, INTEGER, INTEGER) TO anon;
