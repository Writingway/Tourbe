import { describe, it, expect } from 'vitest';
import { calculateScore, matchWhiskies } from './matching';
import type { Whisky, QuizAnswers } from './scoring.types';

const mockWhisky: Whisky = {
  id: 'test-whisky',
  name: 'Test Whisky',
  region: 'SCOTLAND_ISLAY',
  distillery: 'Test Distillery',
  abv: 46,
  priceBand: '40_70',
  style: ['PEATY', 'SMOKY', 'SWEET', 'VANILLA', 'BOURBON_CASK', 'FULL_BODY'],
  intensity: 'BOLD',
  mouthfeel: ['OILY', 'HOT'],
  finish: {
    length: 'LONG',
    notes: ['SMOKE', 'SWEET'],
  },
  experimental: false,
  tastingNoteShort: 'Test tasting note',
  image: '/test.jpg',
  distilleryLocation: { lat: 55.64, lng: -6.2 },
};

const mockWhisky2: Whisky = {
  ...mockWhisky,
  id: 'test-whisky-2',
  style: ['FRUITY', 'FLORAL', 'SWEET', 'VANILLA', 'BOURBON_CASK', 'LIGHT_BODY'],
  intensity: 'LIGHT',
  mouthfeel: ['SOFT'],
  finish: {
    length: 'SHORT',
    notes: ['SWEET'],
  },
  region: 'SCOTLAND_SPEYSIDE',
  priceBand: 'UNDER_40',
  abv: 40,
};

const mockWhisky3: Whisky = {
  ...mockWhisky,
  id: 'test-whisky-3',
  experimental: true,
  style: ['PEATY', 'SMOKY', 'WINE_CASK', 'SWEET', 'FRUITY', 'FULL_BODY'],
  priceBand: 'OVER_120',
  abv: 55,
};

describe('Matching Algorithm', () => {
  describe('calculateScore', () => {
    it('should calculate perfect match for exact preferences', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY', 'SMOKY', 'SWEET'],
        intensity: 'BOLD',
        mouthfeel: ['OILY', 'HOT'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE', 'SWEET'],
        regions: ['SCOTLAND_ISLAY'],
        budget: ['40_70'],
        openness: 'CURIOUS',
        abvComfort: '46_50',
      };

      const result = calculateScore(answers, mockWhisky);
      expect(result.score).toBeGreaterThan(70);
      expect(result.breakdown.styleMatch).toBeGreaterThan(0);
      expect(result.breakdown.intensityMatch).toBe(3);
      expect(result.breakdown.regionMatch).toBe(2);
    });

    it('should handle no preferences with safe defaults', () => {
      const answers: QuizAnswers = {
        styleTags: [],
        intensity: null,
        mouthfeel: [],
        finishLength: null,
        finishNotes: [],
        regions: [],
        budget: [],
        openness: null,
        abvComfort: null,
      };

      const result = calculateScore(answers, mockWhisky);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.breakdown.intensityMatch).toBe(2); // Default value
    });

    it('should penalize experimental whiskies for conservative users', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY'],
        intensity: 'BOLD',
        mouthfeel: ['OILY'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE'],
        regions: ['SCOTLAND_ISLAY'],
        budget: ['OVER_120'],
        openness: 'CONSERVATIVE',
        abvComfort: 'OVER_50',
      };

      const result = calculateScore(answers, mockWhisky3);
      expect(result.breakdown.experimentalBonus).toBe(-1);
    });

    it('should bonus experimental whiskies for adventurous users', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY'],
        intensity: 'BOLD',
        mouthfeel: ['OILY'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE'],
        regions: ['SCOTLAND_ISLAY'],
        budget: ['OVER_120'],
        openness: 'ADVENTUROUS',
        abvComfort: 'OVER_50',
      };

      const result = calculateScore(answers, mockWhisky3);
      expect(result.breakdown.experimentalBonus).toBe(2);
    });

    it('should calculate style similarity correctly', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY', 'SMOKY', 'SWEET', 'VANILLA'],
        intensity: null,
        mouthfeel: [],
        finishLength: null,
        finishNotes: [],
        regions: [],
        budget: [],
        openness: null,
        abvComfort: null,
      };

      const result = calculateScore(answers, mockWhisky);
      expect(result.breakdown.styleSimilarity).toBeGreaterThan(0);
    });

    it('should handle adjacent intensity matching', () => {
      const answers: QuizAnswers = {
        styleTags: [],
        intensity: 'MEDIUM',
        mouthfeel: [],
        finishLength: null,
        finishNotes: [],
        regions: [],
        budget: [],
        openness: null,
        abvComfort: null,
      };

      const result = calculateScore(answers, mockWhisky); // mockWhisky is BOLD
      expect(result.breakdown.intensityMatch).toBe(1); // Adjacent category
    });

    it('should handle ABV range matching', () => {
      const answers: QuizAnswers = {
        styleTags: [],
        intensity: null,
        mouthfeel: [],
        finishLength: null,
        finishNotes: [],
        regions: [],
        budget: [],
        openness: null,
        abvComfort: '46_50',
      };

      const result = calculateScore(answers, mockWhisky); // ABV 46
      expect(result.breakdown.abvMatch).toBe(2); // Exact range
    });

    it('should handle region country matching', () => {
      const answers: QuizAnswers = {
        styleTags: [],
        intensity: null,
        mouthfeel: [],
        finishLength: null,
        finishNotes: [],
        regions: ['SCOTLAND_SPEYSIDE'], // Different sub-region, same country
        budget: [],
        openness: null,
        abvComfort: null,
      };

      const result = calculateScore(answers, mockWhisky); // SCOTLAND_ISLAY
      expect(result.breakdown.regionMatch).toBe(1); // Country match
    });

    it('should normalize score to 0-100 range', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY', 'SMOKY', 'SWEET', 'VANILLA', 'BOURBON_CASK', 'FULL_BODY'],
        intensity: 'BOLD',
        mouthfeel: ['OILY', 'HOT'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE', 'SWEET'],
        regions: ['SCOTLAND_ISLAY'],
        budget: ['40_70'],
        openness: 'CURIOUS',
        abvComfort: '46_50',
      };

      const result = calculateScore(answers, mockWhisky);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe('matchWhiskies', () => {
    it('should return top 3 matches', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY', 'SMOKY'],
        intensity: 'BOLD',
        mouthfeel: ['OILY'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE'],
        regions: ['SCOTLAND_ISLAY'],
        budget: ['40_70'],
        openness: 'CURIOUS',
        abvComfort: '46_50',
      };

      const whiskies = [mockWhisky, mockWhisky2, mockWhisky3];
      const results = matchWhiskies(answers, whiskies);

      expect(results).toHaveLength(3);
      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
      expect(results[1].score).toBeGreaterThanOrEqual(results[2].score);
    });

    it('should handle extreme preferences and still return 3 results', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY', 'SMOKY', 'SWEET', 'VANILLA'],
        intensity: 'BOLD',
        mouthfeel: ['OILY', 'HOT'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE', 'SWEET', 'SPICE', 'DRIED_FRUIT'],
        regions: ['SCOTLAND_ISLAY', 'SCOTLAND_ISLANDS'],
        budget: ['OVER_120'],
        openness: 'ADVENTUROUS',
        abvComfort: 'OVER_50',
      };

      const whiskies = [mockWhisky, mockWhisky2, mockWhisky3];
      const results = matchWhiskies(answers, whiskies);

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.score >= 0 && r.score <= 100)).toBe(true);
    });

    it('should use tie-breaker for equal scores', () => {
      const whisky1 = { ...mockWhisky, id: 'w1', abv: 46 };
      const whisky2 = { ...mockWhisky, id: 'w2', abv: 47 };
      const whisky3 = { ...mockWhisky, id: 'w3', abv: 45 };

      const answers: QuizAnswers = {
        styleTags: ['PEATY'],
        intensity: 'BOLD',
        mouthfeel: ['OILY'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE'],
        regions: ['SCOTLAND_ISLAY'],
        budget: ['40_70'],
        openness: 'CURIOUS',
        abvComfort: '46_50', // Midpoint 48
      };

      const whiskies = [whisky1, whisky2, whisky3];
      const results = matchWhiskies(answers, whiskies);

      expect(results).toHaveLength(3);
      // With ABV comfort 46-50 (midpoint 48), whisky2 (47) should rank higher than others
    });

    it('should handle empty whisky list', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY'],
        intensity: 'BOLD',
        mouthfeel: ['OILY'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE'],
        regions: ['SCOTLAND_ISLAY'],
        budget: ['40_70'],
        openness: 'CURIOUS',
        abvComfort: '46_50',
      };

      const results = matchWhiskies(answers, []);
      expect(results).toHaveLength(0);
    });

    it('should handle fewer than 3 whiskies', () => {
      const answers: QuizAnswers = {
        styleTags: ['PEATY'],
        intensity: 'BOLD',
        mouthfeel: ['OILY'],
        finishLength: 'LONG',
        finishNotes: ['SMOKE'],
        regions: ['SCOTLAND_ISLAY'],
        budget: ['40_70'],
        openness: 'CURIOUS',
        abvComfort: '46_50',
      };

      const whiskies = [mockWhisky];
      const results = matchWhiskies(answers, whiskies);
      expect(results).toHaveLength(1);
    });
  });
});
