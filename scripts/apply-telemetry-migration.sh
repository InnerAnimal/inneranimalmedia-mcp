#!/bin/bash

# Apply Agent Telemetry Migration to D1 Database
# Database: inneranimalmedia-business

set -e

echo "🔧 Applying agent_telemetry schema to D1..."

wrangler d1 execute inneranimalmedia-business \
  --file=./migrations/001_create_agent_telemetry.sql

echo "✅ Migration applied successfully!"

echo ""
echo "🔍 Verifying table creation..."

wrangler d1 execute inneranimalmedia-business \
  --command="SELECT name FROM sqlite_master WHERE type='table' AND name='agent_telemetry';"

echo ""
echo "📊 Checking indexes..."

wrangler d1 execute inneranimalmedia-business \
  --command="SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='agent_telemetry';"

echo ""
echo "✨ Setup complete! The agent_telemetry table is ready."
echo "📖 See docs/TELEMETRY.md for usage instructions."
