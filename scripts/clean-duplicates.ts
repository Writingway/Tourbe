import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Whisky } from '../src/lib/scoring.types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function cleanDuplicates(): void {
  console.log('📖 Lecture du fichier whiskies.json...');
  const dataPath = join(__dirname, '..', 'src', 'data', 'whiskies.json');
  const whiskies: Whisky[] = JSON.parse(readFileSync(dataPath, 'utf-8'));

  console.log(`✅ ${whiskies.length} whiskies chargés`);

  // Find duplicates by ID
  const seenIds = new Set<string>();
  const seenNames = new Map<string, number>();
  const duplicateIds: string[] = [];
  const duplicateNames: string[] = [];

  whiskies.forEach((whisky) => {
    // Track duplicate IDs
    if (seenIds.has(whisky.id)) {
      duplicateIds.push(whisky.id);
    }
    seenIds.add(whisky.id);

    // Track duplicate names (trim to catch trailing spaces)
    const normalizedName = whisky.name.trim().toLowerCase();
    const count = seenNames.get(normalizedName) || 0;
    seenNames.set(normalizedName, count + 1);
    if (count > 0) {
      duplicateNames.push(whisky.name);
    }
  });

  console.log(`\n🔍 Doublons trouvés :`);
  console.log(`   - Par ID : ${duplicateIds.length}`);
  console.log(`   - Par nom : ${duplicateNames.length}`);

  if (duplicateIds.length > 0) {
    console.log(`\n🗑️  IDs dupliqués : ${[...new Set(duplicateIds)].join(', ')}`);
  }

  if (duplicateNames.length > 0) {
    console.log(`🗑️  Noms dupliqués : ${[...new Set(duplicateNames)].join(', ')}`);
  }

  // Remove duplicates - keep first occurrence by ID
  const uniqueWhiskies: Whisky[] = [];
  const processedIds = new Set<string>();

  whiskies.forEach((whisky) => {
    if (!processedIds.has(whisky.id)) {
      uniqueWhiskies.push(whisky);
      processedIds.add(whisky.id);
    }
  });

  console.log(`\n✨ Après nettoyage : ${uniqueWhiskies.length} whiskies uniques`);
  console.log(`🗑️  ${whiskies.length - uniqueWhiskies.length} doublons supprimés`);

  // Save cleaned data
  writeFileSync(dataPath, JSON.stringify(uniqueWhiskies, null, 2));
  console.log(`\n💾 Base de données nettoyée et sauvegardée !`);
}

cleanDuplicates();
