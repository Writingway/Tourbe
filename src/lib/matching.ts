import type {
  Whisky,
  QuizAnswers,
  ScoreBreakdown,
  WhiskyMatch,
  ABVComfort,
  PriceBand,
} from './scoring.types';

const ABV_RANGES: Record<ABVComfort, [number, number]> = {
  UNDER_43: [0, 43],
  '43_46': [43, 46],
  '46_50': [46, 50],
  OVER_50: [50, 100],
};

const PRICE_ORDER: PriceBand[] = ['UNDER_40', '40_70', '70_120', 'OVER_120'];

function jaccardSimilarity(set1: string[], set2: string[]): number {
  const intersection = set1.filter((x) => set2.includes(x)).length;
  const union = new Set([...set1, ...set2]).size;
  return union > 0 ? intersection / union : 0;
}

function calculateStyleScore(answers: QuizAnswers, whisky: Whisky): number {
  if (answers.styleTags.length === 0) return 0;
  let score = 0;
  answers.styleTags.forEach((tag) => {
    if (whisky.style.includes(tag)) score += 1;
  });
  return score;
}

function calculateIntensityScore(answers: QuizAnswers, whisky: Whisky): number {
  if (!answers.intensity) return 2;
  if (answers.intensity === whisky.intensity) return 3;
  const intensities = ['LIGHT', 'MEDIUM', 'BOLD'];
  const userIdx = intensities.indexOf(answers.intensity);
  const whiskyIdx = intensities.indexOf(whisky.intensity);
  if (Math.abs(userIdx - whiskyIdx) === 1) return 1;
  return 0;
}

function calculateMouthfeelScore(answers: QuizAnswers, whisky: Whisky): number {
  if (answers.mouthfeel.length === 0) return 0;
  let score = 0;
  answers.mouthfeel.forEach((mf) => {
    if (whisky.mouthfeel.includes(mf)) score += 1;
  });
  return score;
}

function calculateFinishScore(answers: QuizAnswers, whisky: Whisky): number {
  let score = 0;
  if (answers.finishLength) {
    if (answers.finishLength === whisky.finish.length) score += 2;
  }
  answers.finishNotes.forEach((note) => {
    if (whisky.finish.notes.includes(note)) score += 1;
  });
  return score;
}

function calculateRegionScore(answers: QuizAnswers, whisky: Whisky): number {
  if (answers.regions.length === 0) return 1;
  if (answers.regions.includes(whisky.region)) return 2;
  const whiskyCountry = whisky.region.split('_')[0];
  const hasCountryMatch = answers.regions.some((r) => r.split('_')[0] === whiskyCountry);
  if (hasCountryMatch) return 1;
  return 0;
}

function calculateBudgetScore(answers: QuizAnswers, whisky: Whisky): number {
  if (answers.budget.length === 0) return 1;
  if (answers.budget.includes(whisky.priceBand)) return 2;
  const whiskyIdx = PRICE_ORDER.indexOf(whisky.priceBand);
  for (const budget of answers.budget) {
    const budgetIdx = PRICE_ORDER.indexOf(budget);
    if (budgetIdx === PRICE_ORDER.length - 1 && whiskyIdx === PRICE_ORDER.length - 2) {
      return 1;
    }
  }
  return 0;
}

function calculateAbvScore(answers: QuizAnswers, whisky: Whisky): number {
  if (!answers.abvComfort) return 1;
  const [min, max] = ABV_RANGES[answers.abvComfort];
  if (whisky.abv >= min && whisky.abv < max) return 2;
  const adjacentRanges: ABVComfort[] = ['UNDER_43', '43_46', '46_50', 'OVER_50'];
  const userIdx = adjacentRanges.indexOf(answers.abvComfort);
  const adjacentBands = [
    userIdx > 0 ? adjacentRanges[userIdx - 1] : null,
    userIdx < adjacentRanges.length - 1 ? adjacentRanges[userIdx + 1] : null,
  ].filter((x) => x !== null) as ABVComfort[];
  for (const band of adjacentBands) {
    const [adjMin, adjMax] = ABV_RANGES[band];
    if (whisky.abv >= adjMin && whisky.abv < adjMax) return 1;
  }
  return 0;
}

function calculateExperimentalBonus(answers: QuizAnswers, whisky: Whisky): number {
  if (!answers.openness) return 0;
  if (answers.openness === 'ADVENTUROUS' && whisky.experimental) return 2;
  if (answers.openness === 'CONSERVATIVE' && whisky.experimental) return -1;
  return 0;
}

function calculateStyleSimilarity(answers: QuizAnswers, whisky: Whisky): number {
  if (answers.styleTags.length === 0) return 0;
  const similarity = jaccardSimilarity(answers.styleTags, whisky.style);
  return similarity * 4;
}

export function calculateScore(answers: QuizAnswers, whisky: Whisky): WhiskyMatch {
  const breakdown: ScoreBreakdown = {
    styleMatch: calculateStyleScore(answers, whisky),
    intensityMatch: calculateIntensityScore(answers, whisky),
    mouthfeelMatch: calculateMouthfeelScore(answers, whisky),
    finishMatch: calculateFinishScore(answers, whisky),
    regionMatch: calculateRegionScore(answers, whisky),
    budgetMatch: calculateBudgetScore(answers, whisky),
    abvMatch: calculateAbvScore(answers, whisky),
    experimentalBonus: calculateExperimentalBonus(answers, whisky),
    styleSimilarity: calculateStyleSimilarity(answers, whisky),
  };

  const rawScore =
    breakdown.styleMatch +
    breakdown.intensityMatch +
    breakdown.mouthfeelMatch +
    breakdown.finishMatch +
    breakdown.regionMatch +
    breakdown.budgetMatch +
    breakdown.abvMatch +
    breakdown.experimentalBonus +
    breakdown.styleSimilarity;

  const maxPossibleScore =
    (answers.styleTags.length || 8) +
    3 +
    (answers.mouthfeel.length || 4) +
    2 +
    (answers.finishNotes.length || 4) +
    2 +
    2 +
    2 +
    2 +
    4;

  const normalizedScore = (rawScore / maxPossibleScore) * 100;

  return {
    whisky,
    score: Math.min(100, Math.max(0, normalizedScore)),
    breakdown,
  };
}

function tieBreaker(a: WhiskyMatch, b: WhiskyMatch, answers: QuizAnswers): number {
  if (!answers.abvComfort) return 0;
  const [userMin, userMax] = ABV_RANGES[answers.abvComfort];
  const userMid = (userMin + userMax) / 2;
  const aDiff = Math.abs(a.whisky.abv - userMid);
  const bDiff = Math.abs(b.whisky.abv - userMid);
  if (aDiff !== bDiff) return aDiff - bDiff;

  if (answers.finishLength === 'LONG') {
    const finishOrder = ['SHORT', 'MEDIUM', 'LONG'];
    const aIdx = finishOrder.indexOf(a.whisky.finish.length);
    const bIdx = finishOrder.indexOf(b.whisky.finish.length);
    if (aIdx !== bIdx) return bIdx - aIdx;
  }

  if (answers.budget.length > 0) {
    const inBudgetA = answers.budget.includes(a.whisky.priceBand);
    const inBudgetB = answers.budget.includes(b.whisky.priceBand);
    if (inBudgetA && !inBudgetB) return -1;
    if (!inBudgetA && inBudgetB) return 1;
  }

  return 0;
}

export function matchWhiskies(answers: QuizAnswers, whiskies: Whisky[]): WhiskyMatch[] {
  if (whiskies.length === 0) return [];

  const matches = whiskies.map((whisky) => calculateScore(answers, whisky));

  matches.sort((a, b) => {
    if (Math.abs(a.score - b.score) > 0.01) {
      return b.score - a.score;
    }
    return tieBreaker(a, b, answers);
  });

  return matches.slice(0, 3);
}
