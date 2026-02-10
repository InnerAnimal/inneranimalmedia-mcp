#!/bin/bash

# Upload Dashboard Files to R2
# Uploads dashboard HTML files to inneranimalmedia-assets bucket

set -e

BUCKET="inneranimalmedia-assets"
FILE="/workspace/dashboard-pipelines.html"
R2_PATH="dashboard/pipelines.html"

echo "🚀 Uploading dashboard/pipelines.html to R2..."
echo "Bucket: $BUCKET"
echo "Path: $R2_PATH"
echo ""

# Check if Cloudflare API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ Error: CLOUDFLARE_API_TOKEN not set"
    echo ""
    echo "Please set your Cloudflare API token:"
    echo "  export CLOUDFLARE_API_TOKEN='your-token-here'"
    echo ""
    echo "Or add it in Cursor Dashboard > Cloud Agents > Secrets"
    exit 1
fi

# Upload using Cloudflare API
ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"

echo "📦 Uploading file..."

curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/$BUCKET/objects/$R2_PATH" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: text/html; charset=utf-8" \
  --data-binary "@$FILE" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "✅ Upload complete!"
echo "📍 URL: https://inneranimalmedia.com/dashboard/pipelines"
echo ""
echo "Test the deployment:"
echo "  curl -I https://inneranimalmedia.com/dashboard/pipelines"
