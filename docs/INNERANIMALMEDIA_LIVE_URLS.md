# Inner Animal Media - Live URLs Map

**Domain**: `inneranimalmedia.com`  
**Last Updated**: February 8, 2026

---

## Public Pages (✅ Live)

| URL | Status | Description |
|-----|--------|-------------|
| `/` | 200 OK | Homepage - marketing site |
| `/work` | 200 OK | Portfolio/work showcase |
| `/about` | 200 OK | About page |
| `/services` | 200 OK | Services overview |
| `/contact` | 200 OK | Contact page |
| `/pricing` | 200 OK | Pricing information |
| `/privacy` | 200 OK | Privacy policy |

---

## Dashboard Routes (🔒 Auth Required)

| URL | Status | Description |
|-----|--------|-------------|
| `/dashboard` | 302 → `/auth/signin?next=%2Fdashboard` | Main dashboard (auth required) |
| `/dashboard/meauxwork` | 302 → `/auth/signin?next=%2Fdashboard%2Fmeauxwork` | MeauxWork dashboard section |

**Note**: All dashboard routes redirect to authentication when not signed in.

---

## Authentication Routes

| URL | Status | Description |
|-----|--------|-------------|
| `/auth/signin` | 200 OK | Sign-in page |
| `/auth/signup` | Available | Sign-up page (linked from homepage) |

---

## API Endpoints (🔒 Protected)

| URL | Status | Description |
|-----|--------|-------------|
| `/api/hello` | 403 Forbidden | Protected by Cloudflare bot detection |
| `/api/ai/workers` | 403 Forbidden | AI workers API (protected) |
| `/api/auth/google/callback` | - | Google OAuth callback |
| `/api/auth/google/verify` | - | Google identity verification |

**Note**: API endpoints are protected by Cloudflare's bot detection and may require authentication headers.

---

## App Routes (🔒 Protected)

| URL | Status | Description |
|-----|--------|-------------|
| `/games` | 403 Forbidden | Games section (protected) |

---

## Discovered Dashboard Sections

Based on authentication flow and homepage references:

- **`/dashboard`** - Main dashboard landing page
- **`/dashboard/meauxwork`** - MeauxWork project management section

**Likely additional dashboard routes** (based on platform structure):
- `/dashboard/projects` - Project management
- `/dashboard/analytics` - Analytics dashboard
- `/dashboard/api` - API management
- `/dashboard/workers` - Worker management
- `/dashboard/settings` - User settings

---

## Authentication Configuration

From the auth page (`mcp.inneranimalmedia.com/`):

```javascript
AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: '1084611205156-0ds0qj2m0oduvt0ek7mkvoet8p3kh7is.apps.googleusercontent.com',
  GITHUB_CLIENT_ID: 'Ov23liz6Q3zFcT1SFGyX',
  API_BASE: 'https://inneranimalmedia.com',
  REDIRECT_AFTER: 'https://inneranimalmedia.com/dashboard',
  WHITELIST: ['meauxbility@gmail.com', 'inneranimalclothing@gmail.com']
}
```

**Supported Auth Methods**:
- Google OAuth
- GitHub OAuth

**Whitelisted Emails**:
- meauxbility@gmail.com
- inneranimalclothing@gmail.com

---

## Subdomains

| Subdomain | Purpose |
|-----------|---------|
| `mcp.inneranimalmedia.com` | MCP server - AI tooling |
| `meauxcad.inneranimalmedia.com` | CAD application |
| `meauxsql.inneranimalmedia.com` | SQL application |
| `meauxgames.inneranimalmedia.com` | Games platform |

---

## Static Assets

Hosted on Cloudflare Image Delivery:
- `imagedelivery.net/g7wf09fCONpnidkRnR_5vw/*` - Various avatars and thumbnails

Referenced in `/assets/agent-widget` - AI agent widget

---

## Access Summary

### ✅ Public (No Auth Required)
- Homepage and marketing pages (`/`, `/work`, `/about`, `/services`, `/contact`, `/pricing`, `/privacy`)
- Authentication pages (`/auth/signin`, `/auth/signup`)

### 🔒 Authenticated (Sign-in Required)
- All `/dashboard/*` routes
- Redirects to `/auth/signin?next=<requested_url>`

### 🛡️ Protected (Bot Detection / API Auth)
- `/api/*` endpoints
- `/games` section

---

## Testing Access

### Check Dashboard Access
```bash
curl -I https://inneranimalmedia.com/dashboard
# Returns: 302 redirect to /auth/signin?next=%2Fdashboard
```

### Check Public Pages
```bash
curl -I https://inneranimalmedia.com/about
# Returns: 200 OK
```

### Check API Endpoints
```bash
curl -I https://inneranimalmedia.com/api/hello
# Returns: 403 Forbidden (Cloudflare protection)
```

---

## Notes

1. **Dashboard routes require authentication** - Must sign in with whitelisted Google or GitHub account
2. **API endpoints are protected** - Cloudflare bot detection active
3. **Main worker repository** - `InnerAnimal/inneranimalmedia` (GitHub)
4. **MCP server repository** - `InnerAnimal/inneranimalmedia-mcp` (this repo)

---

## Related Documentation

- Platform overview: `ECOSYSTEM-README.md`
- Platform map: `docs/PLATFORM_ECOSYSTEM_MAP.txt`
- Telemetry system: `docs/TELEMETRY.md`
- MCP server: `https://mcp.inneranimalmedia.com/mcp`
