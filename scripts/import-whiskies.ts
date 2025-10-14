/**
 * Script to import whiskies from JSON file to Supabase
 *
 * Usage:
 *   pnpm tsx scripts/import-whiskies.ts
 *
 * This script will:
 * 1. Load whiskies from src/data/whiskies.json
 * 2. Transform the data to match the database schema
 * 3. Insert all whiskies into Supabase in batches
 */

import { createClient } from '@supabase/supabase-js';
import whiskiesData from '../src/data/whiskies.json' assert { type: 'json' };
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface WhiskyJSON {
  id: string;
  name: string;
  region: string;
  distillery: string;
  abv: number;
  priceBand: string;
  style: string[];
  intensity: string;
  mouthfeel: string[];
  finish: {
    length: string;
    notes: string[];
  };
  experimental: boolean;
  tastingNoteShort: string;
  image: string;
  distilleryLocation: {
    lat: number;
    lng: number;
  };
}

interface WhiskyDB {
  id: string;
  name: string;
  region: string;
  distillery: string;
  abv: number;
  price_band: string;
  style: string[];
  intensity: string;
  mouthfeel: string[];
  finish: {
    length: string;
    notes: string[];
  };
  experimental: boolean;
  tasting_note_short: string;
  image: string;
  distillery_location: {
    lat: number;
    lng: number;
  };
}

/**
 * Transform JSON whisky format to database format
 */
function transformWhisky(whisky: WhiskyJSON): WhiskyDB {
  return {
    id: whisky.id,
    name: whisky.name,
    region: whisky.region,
    distillery: whisky.distillery,
    abv: whisky.abv,
    price_band: whisky.priceBand,
    style: whisky.style,
    intensity: whisky.intensity,
    mouthfeel: whisky.mouthfeel,
    finish: whisky.finish,
    experimental: whisky.experimental,
    tasting_note_short: whisky.tastingNoteShort,
    image: whisky.image,
    distillery_location: whisky.distilleryLocation,
  };
}

/**
 * Insert whiskies in batches to avoid timeouts
 */
async function importWhiskies() {
  console.log('🥃 Starting whisky import...');
  console.log(`📊 Total whiskies to import: ${whiskiesData.length}`);

  // Transform all whiskies
  const transformedWhiskies = whiskiesData.map((w) => transformWhisky(w as WhiskyJSON));

  // Delete existing whiskies first
  console.log('\n🗑️  Clearing existing whiskies...');
  const { error: deleteError } = await supabase.from('whiskies').delete().neq('id', '');

  if (deleteError) {
    console.error('❌ Error deleting existing whiskies:', deleteError);
    // Continue anyway - table might be empty
  } else {
    console.log('✅ Existing whiskies cleared');
  }

  // Insert in batches of 100
  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;

  console.log('\n📦 Inserting whiskies in batches...');

  for (let i = 0; i < transformedWhiskies.length; i += batchSize) {
    const batch = transformedWhiskies.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(transformedWhiskies.length / batchSize);

    console.log(`\n📤 Batch ${batchNumber}/${totalBatches} (${batch.length} whiskies)`);

    const { data, error } = await supabase.from('whiskies').insert(batch).select('id');

    if (error) {
      console.error(`❌ Error in batch ${batchNumber}:`, error.message);
      errorCount += batch.length;

      // Try to insert one by one to identify problematic whiskies
      console.log('  ⚠️  Trying individual inserts...');
      for (const whisky of batch) {
        const { error: individualError } = await supabase
          .from('whiskies')
          .insert(whisky)
          .select('id');

        if (individualError) {
          console.error(`    ❌ Failed: ${whisky.name} (${whisky.id})`);
          console.error(`       Error: ${individualError.message}`);
        } else {
          successCount++;
          console.log(`    ✅ Success: ${whisky.name}`);
        }
      }
    } else {
      successCount += batch.length;
      console.log(`✅ Batch ${batchNumber} completed (${data?.length || batch.length} whiskies)`);
    }

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < transformedWhiskies.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${successCount} whiskies`);
  if (errorCount > 0) {
    console.log(`❌ Failed to import: ${errorCount} whiskies`);
  }
  console.log(`📈 Success rate: ${((successCount / whiskiesData.length) * 100).toFixed(1)}%`);

  // Verify count in database
  const { count, error: countError } = await supabase
    .from('whiskies')
    .select('*', { count: 'exact', head: true });

  if (!countError) {
    console.log(`\n🗄️  Total whiskies in database: ${count}`);
  }

  console.log('\n🎉 Import completed!');
}

// Run the import
importWhiskies()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
