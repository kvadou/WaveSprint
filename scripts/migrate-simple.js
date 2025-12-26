// Simple migration script
// Usage: node scripts/migrate-simple.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  console.log('   Make sure your .env.local file has these values');
  process.exit(1);
}

console.log('📝 Migration SQL to run:');
console.log('');
console.log('ALTER TABLE intake_sessions');
console.log("ADD COLUMN IF NOT EXISTS state_json JSONB DEFAULT '{}'::jsonb;");
console.log('');
console.log('💡 Since Supabase requires elevated permissions for DDL, please:');
console.log('   1. Go to your Supabase dashboard');
console.log('   2. Open SQL Editor');
console.log('   3. Paste the SQL above and run it');
console.log('');
console.log('   Or use Supabase CLI:');
console.log('   supabase login');
console.log('   supabase link --project-ref YOUR_PROJECT_REF');
console.log('   supabase db push');

