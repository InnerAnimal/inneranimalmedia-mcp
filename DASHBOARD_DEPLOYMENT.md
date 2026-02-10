# Dashboard Deployment Guide

## Overview

Your fully functional dashboard is now connected to your D1 database (`inneranimalmedia-business`) and displays real-time data from your infrastructure.

## What's Been Built

### 1. **Dashboard API** (`src/api/dashboard.ts`)
Connected to real D1 tables:
- **`builds`** - 6 build records with deployment info
- **`workflows`** - 3 AI workflows with automated steps  
- **`worker_registry`** - 33 active Cloudflare Workers
- **`agent_telemetry`** - Cost tracking and LLM usage

### 2. **API Endpoints** (served by MCP server)
- `GET /api/dashboard/pipelines` - Build/deployment data
- `GET /api/dashboard/ai-workflows` - AI workflows
- `GET /api/dashboard/deployments` - Worker registry
- `GET /api/dashboard/stats` - Aggregate statistics
- `GET /api/dashboard/tables` - List all D1 tables
- `GET /api/dashboard/table/{name}` - Query any table

### 3. **Functional Dashboard UI** (`dashboard-pipelines-functional.html`)
- **4 tabs**: Builds, AI Workflows, Workers, Statistics
- **Real-time stats**: Total builds, active workers, workflows, costs
- **Interactive cards**: View logs, open deployments, run workflows
- **Beautiful UI**: Glassmorphic design, animations, responsive

## Deployment Steps

### Step 1: Deploy MCP Server (API Backend)

The MCP server now includes the dashboard API endpoints.

```bash
# Deploy to Cloudflare Workers
cd /workspace
npx wrangler deploy

# Or use npm script
npm run deploy
```

**URL**: `https://mcp.inneranimalmedia.com`

**Test API**:
```bash
curl https://mcp.inneranimalmedia.com/api/dashboard/stats
curl https://mcp.inneranimalmedia.com/api/dashboard/pipelines
```

### Step 2: Upload Dashboard to R2

The dashboard HTML needs to be uploaded to your R2 bucket to be served at `inneranimalmedia.com/dashboard/pipelines`.

#### Option A: Using Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Navigate to **R2** → **inneranimalmedia-assets**
3. Create folder: `dashboard`
4. Upload `dashboard-pipelines-functional.html` as `dashboard/pipelines.html`

#### Option B: Using Wrangler (Cloudflare CLI)

```bash
# Upload dashboard file to R2
npx wrangler r2 object put inneranimalmedia-assets/dashboard/pipelines.html \
  --file=dashboard-pipelines-functional.html \
  --content-type="text/html"
```

#### Option C: Using the Upload Script

```bash
# Set API token (already done in your environment)
export CLOUDFLARE_API_TOKEN="<your-token>"

# Run upload script
./scripts/upload-dashboard-to-r2.sh
```

### Step 3: Configure R2 Serving

Your main `inneranimalmedia` worker needs to serve files from R2. Update your worker to handle:

```typescript
// In your inneranimalmedia worker
if (url.pathname.startsWith('/dashboard/')) {
  const key = url.pathname.replace('/dashboard/', 'dashboard/');
  const object = await env.ASSETS.get(key);
  
  if (object) {
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'text/html',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
}
```

### Step 4: Test the Dashboard

1. **Access the dashboard**:
   ```
   https://inneranimalmedia.com/dashboard/pipelines
   ```

2. **Verify API connectivity**:
   - Open browser developer console
   - Check for successful API calls to `/api/dashboard/*`
   - Verify data is loading in all tabs

3. **Test features**:
   - Switch between tabs (Builds, Workflows, Workers)
   - Check statistics are displaying
   - Click "View Logs" and "Open" buttons

## Current Data in D1

### Builds Table (6 records)
- anything-floors-001
- acemedical-deploy-2026-01-27
- pawlove-build-2026-01-27-stripe
- nicoc-build-2026-01-16
- pelican-build-001
- And more...

### Workflows Table (3 workflows)
- **monthly_invoice_generation** - Auto-invoicing workflow
- **client_onboarding** - Automated client setup
- **content_publish_pipeline** - AI-assisted content

### Worker Registry (33 active workers)
- inneranimalmedia
- meauxcloud
- new-iberia-church
- pelicanpeptides
- southernpetsanimalrescue
- And 28 more...

### Agent Telemetry
- Real-time cost tracking
- Token usage metrics
- Model performance data

## API Response Examples

### Stats Endpoint
```json
{
  "success": true,
  "data": {
    "builds": {
      "total_builds": 6,
      "successful_builds": 5,
      "failed_builds": 0
    },
    "workers": {
      "total_workers": 35,
      "active_workers": 33,
      "failed_workers": 1,
      "total_requests_30d": 754
    },
    "workflows": {
      "total_workflows": 3,
      "total_successes": 0,
      "total_failures": 0,
      "active_workflows": 3
    },
    "costs": {
      "total_cost_today": 0.0,
      "total_calls_today": 0
    }
  }
}
```

### Pipelines Endpoint
```json
{
  "success": true,
  "data": [
    {
      "id": "build-anything-floors-001",
      "name": "anything-floors-and-more",
      "branch": "main",
      "status": "active",
      "deployment_url": "https://anythingfloorsandmore.com",
      "build_number": 1,
      "last_run_duration_ms": null,
      "commit_message": null,
      "created_by": null,
      "last_run_at": null,
      "completed_at": null,
      "environment": "production"
    }
  ]
}
```

## Troubleshooting

### Dashboard shows "Failed to load"

1. **Check MCP server is deployed**:
   ```bash
   curl https://mcp.inneranimalmedia.com/api/dashboard/stats
   ```

2. **Check CORS headers** are set correctly in `src/index.ts`

3. **Verify D1 binding** in `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "inneranimalmedia-business"
   database_id = "cf87b717-d4e2-4cf8-bab0-a81268e32d49"
   ```

### API returns 500 error

1. **Check Worker logs**:
   ```bash
   npx wrangler tail
   ```

2. **Test D1 connection**:
   ```bash
   npx wrangler d1 execute inneranimalmedia-business --remote \
     --command="SELECT COUNT(*) FROM builds;"
   ```

### Dashboard not loading from R2

1. **Verify file exists in R2**:
   ```bash
   npx wrangler r2 object get inneranimalmedia-assets/dashboard/pipelines.html
   ```

2. **Check worker routing** for `/dashboard/*` paths

3. **Verify Content-Type header** is `text/html`

## Next Steps

### Enhancements
- [ ] Add real-time WebSocket updates
- [ ] Implement workflow execution triggers
- [ ] Build detailed log viewer
- [ ] Add deployment rollback functionality
- [ ] Create analytics charts and graphs
- [ ] Implement search and filtering
- [ ] Add user permissions and auth
- [ ] Build notification system

### Additional Dashboards
- `/dashboard` - Main overview
- `/dashboard/analytics` - Detailed analytics
- `/dashboard/workers` - Worker management
- `/dashboard/costs` - Cost analysis
- `/dashboard/settings` - Configuration

## Support

- **MCP Server**: https://mcp.inneranimalmedia.com
- **Documentation**: `/workspace/docs/`
- **Database**: inneranimalmedia-business (D1)
- **R2 Bucket**: inneranimalmedia-assets

---

**Status**: ✅ Ready to deploy  
**Last Updated**: February 10, 2026  
**API**: Live at mcp.inneranimalmedia.com  
**Dashboard**: Ready for R2 upload
