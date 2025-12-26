// Check table structure
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  console.log('📊 Checking intake_sessions table structure...\n');
  console.log('Current SUPABASE_URL:', supabaseUrl?.substring(0, 30) + '...');
  console.log('');

  // Try to get table info via RPC (if available)
  try {
    const { data, error } = await supabase.rpc('get_table_columns', {
      table_name: 'intake_sessions'
    });
    
    if (data) {
      console.log('Table columns:', data);
    }
  } catch (e) {
    // RPC might not exist, that's okay
  }

  // Try a simple select to see what columns we can access
  const { data, error } = await supabase
    .from('intake_sessions')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ Error querying table:', error.message);
    console.log('\n💡 This might indicate:');
    console.log('   1. The table doesn\'t exist (run schema.sql first)');
    console.log('   2. RLS is blocking access');
    console.log('   3. The column migration hasn\'t been applied');
  } else {
    console.log('✅ Table exists and is accessible');
    if (data && data.length > 0) {
      console.log('\n📋 Current columns in table:');
      console.log(Object.keys(data[0]).join(', '));
      
      if ('state_json' in data[0]) {
        console.log('\n✅ state_json column EXISTS!');
      } else {
        console.log('\n❌ state_json column NOT FOUND');
        console.log('   Please run the migration SQL in Supabase SQL Editor');
      }
    } else {
      console.log('   (Table is empty, but exists)');
      console.log('\n💡 To verify the column exists, try running this in SQL Editor:');
      console.log('   SELECT column_name, data_type FROM information_schema.columns');
      console.log("   WHERE table_name = 'intake_sessions';");
    }
  }
}

checkTable();

