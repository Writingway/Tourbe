import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Whisky, PriceBand, Region, Intensity } from '../src/lib/scoring.types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CSVRow {
  Bottle: string;
  Price: string;
  Rating: string;
  Region: string;
  [key: string]: string;
}

// Mapping des régions CSV vers nos régions typées
const REGION_MAPPING: Record<string, Region> = {
  'Islay': 'SCOTLAND_ISLAY',
  'Speyside': 'SCOTLAND_SPEYSIDE',
  'Highland': 'SCOTLAND_HIGHLANDS',
  'Highland ': 'SCOTLAND_HIGHLANDS',
  'Lowland': 'SCOTLAND_LOWLANDS',
  'Island': 'SCOTLAND_ISLANDS',
  'Island ': 'SCOTLAND_ISLANDS',
  'Campbeltown': 'SCOTLAND_HIGHLANDS',
  'Bourbon': 'USA_BOURBON',
  'Rye': 'USA_RYE',
  'American': 'USA_BOURBON',
  'Wheat': 'USA_BOURBON',
  'Blend': 'SCOTLAND_HIGHLANDS',
  'Ireland': 'IRELAND',
  'India': 'INDIA',
  'Japan': 'JAPAN',
  'Canada': 'OTHER',
  'Taiwan': 'TAIWAN',
};

// Coordonnées GPS approximatives par région
const REGION_COORDINATES: Record<Region, { lat: number; lng: number }> = {
  'SCOTLAND_ISLAY': { lat: 55.75, lng: -6.25 },
  'SCOTLAND_SPEYSIDE': { lat: 57.45, lng: -3.15 },
  'SCOTLAND_HIGHLANDS': { lat: 57.50, lng: -4.50 },
  'SCOTLAND_LOWLANDS': { lat: 55.90, lng: -3.50 },
  'SCOTLAND_ISLANDS': { lat: 57.50, lng: -6.00 },
  'USA_BOURBON': { lat: 38.20, lng: -85.00 },
  'USA_RYE': { lat: 38.20, lng: -85.00 },
  'IRELAND': { lat: 52.50, lng: -8.00 },
  'JAPAN': { lat: 35.00, lng: 136.00 },
  'INDIA': { lat: 13.00, lng: 77.50 },
  'TAIWAN': { lat: 24.65, lng: 121.76 },
  'OTHER': { lat: 51.50, lng: -0.12 },
};

// Profils aromatiques qui indiquent différents attributs
const AROMATIC_PROFILES = {
  peaty: ['peaty', 'smokey'],
  fruity: ['apple', 'banana', 'cherry', 'citrus', 'fruity', 'lemon', 'orange', 'pear', 'raisins'],
  sweet: ['candy', 'chocolate', 'honey', 'toffee', 'butterscotch', 'caramel', 'sweet', 'sugar'],
  spicy: ['cinnamon', 'clove', 'nutmeg', 'peppery', 'spices', 'ginger'],
  sherry: ['sherry', 'raisins'],
  wine: ['raisins'],
  floral: ['floral', 'roses'],
  malty: ['malty', 'barley'],
  vanilla: ['vanilla'],
  smoky: ['smokey', 'peaty', 'tobacco'],
  nutty: ['nutty'],
  oaky: ['oak', 'wood'],
  rich: ['rich', 'heavy', 'complex'],
  maritime: ['brine', 'salty'],
};

function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: CSVRow = { Bottle: '', Price: '', Rating: '', Region: '' };

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    return row;
  });
}

function getPriceBand(price: number): PriceBand {
  if (price < 40) return 'UNDER_40';
  if (price < 70) return '40_70';
  if (price < 120) return '70_120';
  return 'OVER_120';
}

function getIntensity(row: CSVRow): Intensity {
  const peatScore = parseFloat(row['peaty'] || '0') + parseFloat(row['smokey'] || '0');
  const heavyScore = parseFloat(row['heavy'] || '0') + parseFloat(row['rich'] || '0');
  const lightScore = parseFloat(row['light'] || '0') + parseFloat(row['mild'] || '0');

  const totalIntensity = peatScore + heavyScore - lightScore;

  if (totalIntensity > 5) return 'BOLD';
  if (totalIntensity < -3 || lightScore > 2) return 'LIGHT';
  return 'MEDIUM';
}

function getStyleTags(row: CSVRow): string[] {
  const styles: string[] = [];

  // Peaty/Smoky
  const peatyScore = parseFloat(row['peaty'] || '0') + parseFloat(row['smokey'] || '0');
  if (peatyScore > 2) {
    styles.push('PEATY', 'SMOKY');
  } else if (peatyScore > 0) {
    styles.push('SMOKY');
  }

  // Fruity
  const fruityScore = AROMATIC_PROFILES.fruity.reduce((sum, key) =>
    sum + parseFloat(row[key] || '0'), 0);
  if (fruityScore > 3) styles.push('FRUITY');

  // Sweet
  const sweetScore = AROMATIC_PROFILES.sweet.reduce((sum, key) =>
    sum + parseFloat(row[key] || '0'), 0);
  if (sweetScore > 4) styles.push('SWEET');

  // Sherry
  const sherryScore = parseFloat(row['sherry'] || '0');
  if (sherryScore > 2) styles.push('SHERRY');

  // Spicy
  const spicyScore = AROMATIC_PROFILES.spicy.reduce((sum, key) =>
    sum + parseFloat(row[key] || '0'), 0);
  if (spicyScore > 3) styles.push('SPICY');

  // Vanilla/Bourbon Cask
  const vanillaScore = parseFloat(row['vanilla'] || '0');
  if (vanillaScore > 2) styles.push('VANILLA', 'BOURBON_CASK');

  // Floral
  const floralScore = parseFloat(row['floral'] || '0') + parseFloat(row['roses'] || '0');
  if (floralScore > 1) styles.push('FLORAL');

  // Malty
  if (parseFloat(row['malty'] || '0') > 2 || parseFloat(row['barley'] || '0') > 2) {
    styles.push('MALTY');
  }

  // Nutty
  if (parseFloat(row['nutty'] || '0') > 1) styles.push('NUTTY');

  // Oak/Wood
  const oakScore = parseFloat(row['oak'] || '0') + parseFloat(row['wood'] || '0');
  if (oakScore > 2) styles.push('OAK');

  // Maritime/Coastal
  const maritimeScore = parseFloat(row['brine'] || '0') + parseFloat(row['salty'] || '0');
  if (maritimeScore > 1) styles.push('MARITIME');

  // Wine Cask
  if (parseFloat(row['raisins'] || '0') > 3 && sherryScore < 2) {
    styles.push('WINE_CASK');
  }

  // Body - must be at end and only add ONE
  const richScore = parseFloat(row['rich'] || '0') + parseFloat(row['heavy'] || '0');
  if (richScore > 3) {
    styles.push('FULL_BODY');
  } else if (parseFloat(row['light'] || '0') > 2) {
    styles.push('LIGHT_BODY');
  } else {
    styles.push('MEDIUM');
  }

  // Remove duplicates
  const uniqueStyles = [...new Set(styles)];

  // Ensure minimum 4 tags - add defaults if needed
  while (uniqueStyles.length < 4) {
    if (!uniqueStyles.includes('MALTY')) uniqueStyles.push('MALTY');
    else if (!uniqueStyles.includes('SWEET')) uniqueStyles.push('SWEET');
    else if (!uniqueStyles.includes('VANILLA')) uniqueStyles.push('VANILLA');
    else if (!uniqueStyles.includes('BOURBON_CASK')) uniqueStyles.push('BOURBON_CASK');
    else break;
  }

  // Cap at 8 tags
  return uniqueStyles.slice(0, 8);
}

function getMouthfeel(row: CSVRow): string[] {
  const mouthfeel: string[] = [];

  const oilyScore = parseFloat(row['creamy'] || '0') + parseFloat(row['rich'] || '0');
  if (oilyScore > 2) mouthfeel.push('OILY');

  const smoothScore = parseFloat(row['smooth'] || '0') + parseFloat(row['mellow'] || '0');
  if (smoothScore > 2 || oilyScore < 2) mouthfeel.push('SOFT');

  const dryScore = parseFloat(row['dry'] || '0');
  if (dryScore > 1) mouthfeel.push('DRY');

  // Assume high ABV or bold intensity = HOT
  const intensity = getIntensity(row);
  if (intensity === 'BOLD' && mouthfeel.length === 0) {
    mouthfeel.push('HOT');
  }

  if (mouthfeel.length === 0) mouthfeel.push('SOFT');

  return mouthfeel;
}

function getFinishLength(row: CSVRow): 'SHORT' | 'MEDIUM' | 'LONG' {
  const lingeringScore = parseFloat(row['lingering'] || '0');
  const complexScore = parseFloat(row['complex'] || '0');

  if (lingeringScore > 2 || complexScore > 3) return 'LONG';
  if (lingeringScore > 0 || complexScore > 1) return 'MEDIUM';
  return 'SHORT';
}

function getFinishNotes(row: CSVRow): string[] {
  const notes: string[] = [];

  const smokeScore = parseFloat(row['smokey'] || '0') + parseFloat(row['peaty'] || '0');
  if (smokeScore > 1) notes.push('SMOKE');

  const sweetScore = AROMATIC_PROFILES.sweet.reduce((sum, key) =>
    sum + parseFloat(row[key] || '0'), 0);
  if (sweetScore > 2) notes.push('SWEET');

  const spiceScore = AROMATIC_PROFILES.spicy.reduce((sum, key) =>
    sum + parseFloat(row[key] || '0'), 0);
  if (spiceScore > 2) notes.push('SPICE');

  const fruitScore = parseFloat(row['raisins'] || '0');
  if (fruitScore > 2) notes.push('DRIED_FRUIT');

  if (notes.length === 0) notes.push('SWEET');

  return notes;
}

function inferABV(region: Region, intensity: Intensity, price: number): number {
  // Bourbon tends to be 40-50% ABV
  if (region === 'USA_BOURBON' || region === 'USA_RYE') {
    if (price > 100) return 57.5; // Cask strength
    if (intensity === 'BOLD') return 50;
    return 45;
  }

  // Scotch varies more
  if (intensity === 'BOLD') return 46;
  if (intensity === 'LIGHT') return 40;
  return 43;
}

function isExperimental(row: CSVRow, price: number): boolean {
  // High-end or limited editions
  if (price > 120) return true;

  // Wine cask finishes
  const raisinScore = parseFloat(row['raisins'] || '0');
  if (raisinScore > 4) return true;

  // Unusual flavor profiles
  const uniqueScore = parseFloat(row['herbal'] || '0') + parseFloat(row['maple'] || '0');
  if (uniqueScore > 2) return true;

  return false;
}

function generateTastingNote(row: CSVRow, styles: string[]): string {
  const descriptors: string[] = [];

  if (styles.includes('PEATY')) descriptors.push('tourbé puissant');
  else if (styles.includes('SMOKY')) descriptors.push('fumé élégant');

  if (styles.includes('FRUITY')) descriptors.push('notes fruitées');
  if (styles.includes('SHERRY')) descriptors.push('influence sherry');
  if (styles.includes('SWEET')) descriptors.push('douceur gourmande');
  if (styles.includes('SPICY')) descriptors.push('épices complexes');

  if (descriptors.length === 0) {
    descriptors.push('profil équilibré', 'notes maltées');
  }

  return descriptors.join(', ');
}

function extractDistilleryName(bottleName: string): string {
  // Extract distillery name from bottle name
  const parts = bottleName.split(' ');
  return parts[0];
}

function createWhiskyId(bottleName: string): string {
  return bottleName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Main conversion function
function convertCSVToWhiskies(): void {
  console.log('📖 Lecture du fichier CSV...');
  const csvPath = join(__dirname, '..', 'database.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');

  console.log('🔄 Parsing du CSV...');
  const rows = parseCSV(csvContent);
  console.log(`✅ ${rows.length} whiskies trouvés dans le CSV`);

  console.log('🧠 Conversion et inférence des propriétés...');
  const whiskies: Whisky[] = rows
    .filter(row => row.Bottle && row.Price && row.Region)
    .map(row => {
      const price = parseFloat(row.Price);
      const region = REGION_MAPPING[row.Region] || 'OTHER';
      const styles = getStyleTags(row);
      const intensity = getIntensity(row);

      const whisky: Whisky = {
        id: createWhiskyId(row.Bottle),
        name: row.Bottle,
        region,
        distillery: extractDistilleryName(row.Bottle),
        abv: inferABV(region, intensity, price),
        priceBand: getPriceBand(price),
        style: styles,
        intensity,
        mouthfeel: getMouthfeel(row),
        finish: {
          length: getFinishLength(row),
          notes: getFinishNotes(row),
        },
        experimental: isExperimental(row, price),
        tastingNoteShort: generateTastingNote(row, styles),
        image: '/images/placeholder.jpg',
        distilleryLocation: REGION_COORDINATES[region],
      };

      return whisky;
    });

  console.log('💾 Sauvegarde de la base de données...');
  const outputPath = join(__dirname, '..', 'src', 'data', 'whiskies.json');
  writeFileSync(outputPath, JSON.stringify(whiskies, null, 2));

  console.log(`✅ Base de données générée avec succès !`);
  console.log(`📊 Statistiques :`);
  console.log(`   - Total: ${whiskies.length} whiskies`);
  console.log(`   - Regions: ${[...new Set(whiskies.map(w => w.region))].length}`);
  console.log(`   - Prix moyen: $${(whiskies.reduce((sum, w) => {
    const prices = { 'UNDER_40': 30, '40_70': 55, '70_120': 95, 'OVER_120': 150 };
    return sum + prices[w.priceBand];
  }, 0) / whiskies.length).toFixed(2)}`);

  const intensityCounts = whiskies.reduce((acc, w) => {
    acc[w.intensity] = (acc[w.intensity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log(`   - Intensités: LIGHT(${intensityCounts.LIGHT || 0}), MEDIUM(${intensityCounts.MEDIUM || 0}), BOLD(${intensityCounts.BOLD || 0})`);
}

// Run the conversion
convertCSVToWhiskies();
