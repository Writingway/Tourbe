/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Whisky } from '../lib/scoring.types';

export interface WhiskiesFilters {
  regions?: string[];
  priceBands?: string[];
  abvMin?: number;
  abvMax?: number;
  styles?: string[];
  intensities?: string[];
  experimental?: boolean;
  search?: string;
}

export interface UseWhiskiesOptions {
  filters?: WhiskiesFilters;
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch whiskies from Supabase with caching and filtering
 */
export function useWhiskies(options: UseWhiskiesOptions = {}) {
  const { filters, limit = 1000, enabled = true } = options;

  const [whiskies, setWhiskies] = useState<Whisky[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    loadWhiskies();
  }, [enabled, JSON.stringify(filters), limit]);

  const loadWhiskies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('whiskies').select('*');

      // Apply filters
      if (filters?.regions && filters.regions.length > 0) {
        query = query.in('region', filters.regions);
      }

      if (filters?.priceBands && filters.priceBands.length > 0) {
        query = query.in('price_band', filters.priceBands);
      }

      if (filters?.abvMin !== undefined) {
        query = query.gte('abv', filters.abvMin);
      }

      if (filters?.abvMax !== undefined) {
        query = query.lte('abv', filters.abvMax);
      }

      if (filters?.intensities && filters.intensities.length > 0) {
        query = query.in('intensity', filters.intensities);
      }

      if (filters?.experimental !== undefined) {
        query = query.eq('experimental', filters.experimental);
      }

      // Apply style filter using array overlap operator
      if (filters?.styles && filters.styles.length > 0) {
        query = query.overlaps('style', filters.styles);
      }

      // Apply search filter
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.or(
          `name.ilike.%${searchTerm}%,distillery.ilike.%${searchTerm}%,tasting_note_short.ilike.%${searchTerm}%`
        );
      }

      // Apply limit and order
      query = query.order('name').limit(limit);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform snake_case to camelCase to match existing Whisky type
      const transformedWhiskies: Whisky[] = (data || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        region: w.region,
        distillery: w.distillery,
        abv: w.abv,
        priceBand: w.price_band,
        style: w.style,
        intensity: w.intensity,
        mouthfeel: w.mouthfeel,
        finish: w.finish,
        experimental: w.experimental,
        tastingNoteShort: w.tasting_note_short,
        image: w.image,
        distilleryLocation: w.distillery_location,
      }));

      setWhiskies(transformedWhiskies);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading whiskies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    whiskies,
    isLoading,
    error,
    refresh: loadWhiskies,
    count: whiskies.length,
  };
}

/**
 * Hook to fetch a single whisky by ID
 */
export function useWhisky(id: string | null) {
  const [whisky, setWhisky] = useState<Whisky | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setWhisky(null);
      setIsLoading(false);
      return;
    }

    loadWhisky();
  }, [id]);

  const loadWhisky = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('whiskies')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        const whiskyData = data as any;
        const transformedWhisky: Whisky = {
          id: whiskyData.id,
          name: whiskyData.name,
          region: whiskyData.region,
          distillery: whiskyData.distillery,
          abv: whiskyData.abv,
          priceBand: whiskyData.price_band,
          style: whiskyData.style,
          intensity: whiskyData.intensity,
          mouthfeel: whiskyData.mouthfeel,
          finish: whiskyData.finish,
          experimental: whiskyData.experimental,
          tastingNoteShort: whiskyData.tasting_note_short,
          image: whiskyData.image,
          distilleryLocation: whiskyData.distillery_location,
        };

        setWhisky(transformedWhisky);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading whisky:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    whisky,
    isLoading,
    error,
    refresh: loadWhisky,
  };
}

/**
 * Hook to get total whisky count
 */
export function useWhiskiesCount(filters?: WhiskiesFilters) {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCount();
  }, [JSON.stringify(filters)]);

  const loadCount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('whiskies').select('*', { count: 'exact', head: true });

      // Apply same filters as useWhiskies
      if (filters?.regions && filters.regions.length > 0) {
        query = query.in('region', filters.regions);
      }

      if (filters?.priceBands && filters.priceBands.length > 0) {
        query = query.in('price_band', filters.priceBands);
      }

      if (filters?.abvMin !== undefined) {
        query = query.gte('abv', filters.abvMin);
      }

      if (filters?.abvMax !== undefined) {
        query = query.lte('abv', filters.abvMax);
      }

      if (filters?.intensities && filters.intensities.length > 0) {
        query = query.in('intensity', filters.intensities);
      }

      if (filters?.experimental !== undefined) {
        query = query.eq('experimental', filters.experimental);
      }

      if (filters?.styles && filters.styles.length > 0) {
        query = query.overlaps('style', filters.styles);
      }

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.or(
          `name.ilike.%${searchTerm}%,distillery.ilike.%${searchTerm}%,tasting_note_short.ilike.%${searchTerm}%`
        );
      }

      const { count: totalCount, error: countError } = await query;

      if (countError) throw countError;

      setCount(totalCount || 0);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading whiskies count:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    count,
    isLoading,
    error,
    refresh: loadCount,
  };
}
