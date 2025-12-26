#!/bin/bash
# Run migration using Supabase CLI
# This requires you to be logged in: supabase login

echo "🔄 Running migration to add state_json column..."

# Check if supabase is logged in
if ! supabase projects list &>/dev/null; then
  echo "❌ Not logged in to Supabase CLI"
  echo "   Run: supabase login"
  echo "   Then link your project: supabase link --project-ref YOUR_PROJECT_REF"
  exit 1
fi

# Run the migration
supabase db push

echo "✅ Migration complete!"

