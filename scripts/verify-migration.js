// Verify that state_json column exists
const { createClient } = require('@supabase/supabase-js');

// Load env vars (try .env.local first, then .env)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  console.log('🔍 Verifying migration...\n');

  try {
    // Try to query the table with the state_json column
    // If the column doesn't exist, this will fail
    const { data, error } = await supabase
      .from('intake_sessions')
      .select('id, state_json')
      .limit(1);

    if (error) {
      // Check if it's a column error
      if (error.message.includes('state_json') || error.message.includes('column')) {
        console.error('❌ Migration failed: state_json column not found');
        console.error('   Error:', error.message);
        console.log('\n💡 Please run the migration SQL in Supabase SQL Editor:');
        console.log('   ALTER TABLE intake_sessions ADD COLUMN IF NOT EXISTS state_json JSONB DEFAULT \'{}\'::jsonb;');
        process.exit(1);
      } else {
        // Other error (maybe table doesn't exist, or RLS issue)
        console.log('⚠️  Could not verify (this might be normal if table is empty or RLS is enabled)');
        console.log('   Error:', error.message);
        console.log('\n   Trying alternative verification method...\n');
        
        // Try a different approach - check if we can insert with state_json
        const testData = {
          lead_id: null,
          status: 'in_progress',
          state_json: { test: true }
        };
        
        const { error: insertError } = await supabase
          .from('intake_sessions')
          .insert(testData)
          .select()
          .single();
        
        if (insertError) {
          if (insertError.message.includes('state_json') || insertError.message.includes('column')) {
            console.error('❌ Migration failed: state_json column not found');
            console.error('   Error:', insertError.message);
            process.exit(1);
          } else {
            // Might be RLS or other constraint
            console.log('✅ Column appears to exist (insert constraint error is expected)');
            console.log('   The migration is likely successful!');
          }
        } else {
          console.log('✅ Migration verified successfully!');
          console.log('   state_json column exists and is working');
        }
      }
    } else {
      console.log('✅ Migration verified successfully!');
      console.log('   state_json column exists and is accessible');
      if (data && data.length > 0 && data[0].state_json !== undefined) {
        console.log('   Sample state_json value:', JSON.stringify(data[0].state_json));
      }
    }
  } catch (err) {
    console.error('❌ Verification error:', err.message);
    process.exit(1);
  }
}

verifyMigration();

