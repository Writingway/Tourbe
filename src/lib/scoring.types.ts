import { z } from 'zod';

export const PriceBandSchema = z.enum(['UNDER_40', '40_70', '70_120', 'OVER_120']);
export type PriceBand = z.infer<typeof PriceBandSchema>;

export const RegionSchema = z.enum([
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
]);
export type Region = z.infer<typeof RegionSchema>;

export const StyleTagSchema = z.enum([
  'PEATY',
  'SMOKY',
  'FRUITY',
  'FLORAL',
  'SPICY',
  'SWEET',
  'NUTTY',
  'MALTY',
  'VANILLA',
  'SHERRY',
  'WINE_CASK',
  'BOURBON_CASK',
  'CASK_STRENGTH',
  'LIGHT_BODY',
  'FULL_BODY',
]);
export type StyleTag = z.infer<typeof StyleTagSchema>;

export const IntensitySchema = z.enum(['LIGHT', 'MEDIUM', 'BOLD']);
export type Intensity = z.infer<typeof IntensitySchema>;

export const MouthfeelSchema = z.enum(['SOFT', 'OILY', 'DRY', 'HOT']);
export type Mouthfeel = z.infer<typeof MouthfeelSchema>;

export const FinishLengthSchema = z.enum(['SHORT', 'MEDIUM', 'LONG']);
export type FinishLength = z.infer<typeof FinishLengthSchema>;

export const FinishNoteSchema = z.enum(['SWEET', 'SPICE', 'SMOKE', 'DRIED_FRUIT']);
export type FinishNote = z.infer<typeof FinishNoteSchema>;

export const WhiskySchema = z.object({
  id: z.string(),
  name: z.string(),
  region: RegionSchema,
  distillery: z.string(),
  abv: z.number().min(35).max(75),
  priceBand: PriceBandSchema,
  style: z.array(StyleTagSchema).min(4).max(8),
  intensity: IntensitySchema,
  mouthfeel: z.array(MouthfeelSchema).min(1).max(4),
  finish: z.object({
    length: FinishLengthSchema,
    notes: z.array(FinishNoteSchema).min(1).max(4),
  }),
  experimental: z.boolean(),
  tastingNoteShort: z.string().max(140),
  image: z.string(),
  distilleryLocation: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export type Whisky = z.infer<typeof WhiskySchema>;

export const WhiskyDataSchema = z.array(WhiskySchema).min(1);
export type WhiskyData = z.infer<typeof WhiskyDataSchema>;

export const OpennessSchema = z.enum(['CONSERVATIVE', 'CURIOUS', 'ADVENTUROUS']);
export type Openness = z.infer<typeof OpennessSchema>;

export const ABVComfortSchema = z.enum(['UNDER_43', '43_46', '46_50', 'OVER_50']);
export type ABVComfort = z.infer<typeof ABVComfortSchema>;

export const UserLevelSchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'CONNOISSEUR']);
export type UserLevel = z.infer<typeof UserLevelSchema>;

export const CaskTypeSchema = z.enum(['EX_BOURBON', 'SHERRY', 'ATYPICAL_FINISH', 'INDIFFERENT']);
export type CaskType = z.infer<typeof CaskTypeSchema>;

export const PeatLevelSchema = z.enum(['NON_PEATED', 'LIGHTLY_PEATED', 'HEAVILY_PEATED', 'NO_PREFERENCE']);
export type PeatLevel = z.infer<typeof PeatLevelSchema>;

export const WhiskyAgeSchema = z.enum(['NO_PREFERENCE', '8_12', '12_18', 'OVER_18']);
export type WhiskyAge = z.infer<typeof WhiskyAgeSchema>;

export const WhiskyTypeSchema = z.enum(['SINGLE_MALT', 'BLEND', 'BOURBON', 'INDIFFERENT']);
export type WhiskyType = z.infer<typeof WhiskyTypeSchema>;

export const ProductTypeSchema = z.enum(['SINGLE_CASK', 'CASK_STRENGTH', 'SINGLE_MALT', 'BLEND', 'GRAIN_WHISKY', 'INDIFFERENT']);
export type ProductType = z.infer<typeof ProductTypeSchema>;

export const FinishTypeSchema = z.enum(['SHERRY', 'PORT', 'RUM', 'RED_WINE', 'NEW_OAK', 'INDIFFERENT']);
export type FinishType = z.infer<typeof FinishTypeSchema>;

export const FlavorProfileSchema = z.enum(['SWEET', 'FRUITY', 'SMOKY', 'INDIFFERENT']);
export type FlavorProfile = z.infer<typeof FlavorProfileSchema>;

export const UsageSchema = z.enum(['NEAT', 'COCKTAIL', 'BOTH']);
export type Usage = z.infer<typeof UsageSchema>;

export const OriginPreferenceSchema = z.enum(['AMERICAN', 'IRISH', 'SCOTTISH', 'INDIFFERENT']);
export type OriginPreference = z.infer<typeof OriginPreferenceSchema>;

export interface QuizAnswers {
  userLevel: UserLevel | null;
  styleTags: StyleTag[];
  intensity: Intensity | null;
  mouthfeel: Mouthfeel[];
  finishLength: FinishLength | null;
  finishNotes: FinishNote[];
  regions: Region[];
  budget: PriceBand[];
  openness: Openness | null;
  abvComfort: ABVComfort | null;
  caskType?: CaskType | null;
  peatLevel?: PeatLevel | null;
  whiskyAge?: WhiskyAge | null;
  whiskyType?: WhiskyType | null;
  productType?: ProductType | null;
  finishType?: FinishType | null;
  flavorProfile?: FlavorProfile | null;
  usage?: Usage | null;
  originPreference?: OriginPreference | null;
  limitedEditions?: boolean | null;
}

export interface ScoreBreakdown {
  styleMatch: number;
  intensityMatch: number;
  mouthfeelMatch: number;
  finishMatch: number;
  regionMatch: number;
  budgetMatch: number;
  abvMatch: number;
  experimentalBonus: number;
  styleSimilarity: number;
}

export interface WhiskyMatch {
  whisky: Whisky;
  score: number;
  breakdown: ScoreBreakdown;
}
