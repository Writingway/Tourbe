# Whisky Finder 🥃

**No more guessing — discover the whisky made for you.**

A production-ready MVP web app that helps bar and shop customers find their ideal whisky in ~30 seconds via a short quiz, then shows a map of the distillery.

## Features

- **Ultra-fast quiz**: 8 questions covering taste profile, intensity, finish, region, budget, and openness to experimentation
- **Intelligent matching**: Transparent, explainable scoring algorithm with detailed breakdowns
- **100 whisky database**: Curated selection from Scotland, Ireland, Japan, USA, India, Taiwan, and beyond
- **Distillery map**: Interactive Leaflet map showing exact distillery locations
- **Mobile-first**: Clean, responsive UI optimized for QR code access in bars/shops
- **Offline-ready**: PWA support for flaky bar Wi-Fi
- **No backend required**: Pure static hosting, all logic client-side

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS v4 (mobile-first)
- **State**: Zustand (lightweight)
- **Map**: Leaflet + OpenStreetMap tiles
- **Data**: Local JSON with Zod schema validation
- **Testing**: Vitest + React Testing Library
- **UI Components**: Headless UI
- **Build**: Vercel/Netlify ready (pure static)

## Quick Start

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open http://localhost:5173 to view the app.

### Build

```bash
pnpm build
```

Creates an optimized production build in `dist/`.

### Preview Production Build

```bash
pnpm preview
```

### Run Tests

```bash
pnpm test
```

### Lint & Format

```bash
pnpm lint
pnpm format
```

### Generate Seed Data

```bash
pnpm generate:seed
```

Re-generates the 101-whisky dataset in `src/data/whiskies.json`.

## Project Structure

```
src/
├── components/
│   ├── Hero.tsx              # Landing page hero with CTA
│   ├── Quiz/
│   │   ├── QuizShell.tsx     # Main quiz orchestrator (8 steps)
│   │   ├── Question.tsx      # Reusable question wrapper
│   │   └── Progress.tsx      # Progress bar
│   ├── Results/
│   │   ├── ResultCard.tsx    # Whisky result card
│   │   └── ScoreBreakdown.tsx # Expandable score details
│   ├── Map/
│   │   └── DistilleryMap.tsx # Leaflet map with distillery pins
│   ├── QR/
│   │   └── QrCard.tsx        # QR code for bar use
│   └── UI/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Badge.tsx
├── pages/
│   ├── Home.tsx              # Landing page
│   ├── Quiz.tsx              # Quiz page
│   ├── Results.tsx           # Results page (top 3 matches)
│   ├── Map.tsx               # Distillery map page
│   ├── QR.tsx                # QR code page
│   └── Insights.tsx          # Dev-only analytics
├── lib/
│   ├── matching.ts           # Matching algorithm
│   ├── scoring.types.ts      # TypeScript types + Zod schemas
│   └── analytics.ts          # Local analytics (localStorage)
├── store/
│   └── useQuizStore.ts       # Zustand quiz state
├── data/
│   └── whiskies.json         # 101 whisky database
└── styles/
    └── tailwind.css          # Tailwind v4 config + custom theme
```

## Quiz Structure

The quiz consists of 8 steps (~30 seconds total):

1. **Taste Profile** (multi-select): Smoky/Peaty, Fruity, Floral, Spicy, Sweet, Nutty, Malty, Wine-cask/Sherry, Vanilla
2. **Intensity** (single): Light / Medium / Bold
3. **Mouthfeel** (multi): Soft / Oily / Dry / Hot (cask strength-leaning)
4. **Finish Length** (single): Short / Medium / Long
5. **Finish Flavors** (multi): Sweet, Spice, Smoke, Dried Fruit
6. **Region Preference** (multi): Scotland (Islay/Highlands/Speyside/Islands/Lowlands), Ireland, Japan, USA (Bourbon/Rye), Others
7. **Budget** (multi): Under €40, €40–€70, €70–€120, €120+
8. **Openness** (single): Conservative / Curious / Adventurous + **ABV Comfort** (single): <43%, 43–46%, 46–50%, 50%+

## Matching Algorithm

The algorithm uses a weighted scoring system with transparent breakdowns:

### Scoring Rules

- **Style Match** (+1 per matching tag): Direct tag overlap
- **Intensity Match** (+3 exact, +1 adjacent): Preference alignment
- **Mouthfeel Match** (+1 per overlap): Texture preferences
- **Finish Match** (+2 length exact, +1 per note): Finish characteristics
- **Region Match** (+2 exact, +1 country): Geographic preference
- **Budget Match** (+2 in range, +1 soft ceiling): Price alignment
- **ABV Match** (+2 in range, +1 adjacent): Alcohol preference
- **Experimental Bonus** (+2 adventurous, -1 conservative): Openness weighting
- **Style Similarity** (+4 × Jaccard similarity): Set-based style matching

### Tie-Breaking

When scores are equal:

1. Closer ABV to user's preferred range midpoint
2. Longer finish if user chose "Long"
3. Within budget preference

### Normalization

All scores are normalized to 0–100 scale for consistency.

## Data Model

See `src/lib/scoring.types.ts` for full TypeScript types and Zod schemas.

### Whisky Schema

```typescript
interface Whisky {
  id: string;               // Unique slug
  name: string;
  region: Region;           // e.g., SCOTLAND_ISLAY, JAPAN
  distillery: string;
  abv: number;              // 35–75
  priceBand: PriceBand;     // UNDER_40 | 40_70 | 70_120 | OVER_120
  style: StyleTag[];        // 4–8 tags (PEATY, FRUITY, etc.)
  intensity: Intensity;     // LIGHT | MEDIUM | BOLD
  mouthfeel: Mouthfeel[];   // SOFT | OILY | DRY | HOT
  finish: {
    length: FinishLength;   // SHORT | MEDIUM | LONG
    notes: FinishNote[];    // SWEET | SPICE | SMOKE | DRIED_FRUIT
  };
  experimental: boolean;    // Unusual casks, NAS, peated bourbon, etc.
  tastingNoteShort: string; // ≤140 chars
  image: string;            // Local asset path or CDN
  distilleryLocation: {
    lat: number;
    lng: number;
  };
}
```

## Deployment

### Vercel

```bash
vercel
```

### Netlify

```bash
netlify deploy --prod
```

### Manual Static Hosting

```bash
pnpm build
# Upload dist/ to any static host (S3, GitHub Pages, etc.)
```

## Analytics

Client-only analytics are stored in `localStorage`:

- Quiz starts
- Quiz completions
- Completion rate
- Top 5 style preferences

Access at `/insights` (dev-only page).

## PWA Support

The app includes:

- Service worker for offline caching
- Web manifest for "Add to Home Screen"
- OSM tile caching for map offline support

## Performance

- Initial bundle: <200KB gzipped
- Code-split: React vendor + Map vendor chunks
- Lighthouse mobile performance target: ≥90

## Browser Support

- Modern browsers (ES2020+)
- Mobile Safari, Chrome, Firefox
- Responsive: 360×640 up to desktop

## License

ISC

## Privacy

**No personal data collected. All choices stay on your device.**

---

Built with ❤️ for whisky lovers everywhere.
