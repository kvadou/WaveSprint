// Migration script to add state_json column
// Run with: npx tsx scripts/migrate.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  console.log('🔄 Running migration: Add state_json column...');
  
  try {
    // Run the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE intake_sessions 
        ADD COLUMN IF NOT EXISTS state_json JSONB DEFAULT '{}'::jsonb;
      `
    });

    if (error) {
      // If RPC doesn't exist, try direct query (might need service role key)
      console.log('⚠️  RPC method not available, trying alternative approach...');
      
      // Alternative: Use the REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `ALTER TABLE intake_sessions ADD COLUMN IF NOT EXISTS state_json JSONB DEFAULT '{}'::jsonb;`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('   Added state_json column to intake_sessions table');
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n💡 Alternative: Run this SQL directly in Supabase SQL Editor:');
    console.log('   ALTER TABLE intake_sessions ADD COLUMN IF NOT EXISTS state_json JSONB DEFAULT \'{}\'::jsonb;');
    process.exit(1);
  }
}

runMigration();

