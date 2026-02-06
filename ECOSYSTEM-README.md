# Inner Animal Media — Platform Ecosystem

A human-friendly overview of our platform. No secrets or credentials — use Cloudflare dashboard / wrangler for those.

---

## What This Repo Is

**inneranimalmedia-mcp** — The company-wide MCP (Model Context Protocol) server for Inner Animal Media.  
Live: **https://mcp.inneranimalmedia.com/mcp**

AI clients (Cursor, Copilot, Claude) can connect here to list Workers, inspect the platform, and eventually run CI/CD actions.

---

## At a Glance

| Layer | Component | Purpose |
|-------|-----------|---------|
| **Main site** | inneranimalmedia.com | Marketing, dashboard, API, auth |
| **MCP** | mcp.inneranimalmedia.com | This server — AI tooling |
| **Apps** | meauxcad, meauxsql, meauxgames | Subdomains (CAD, SQL, games) |
| **Database** | D1: inneranimalmedia-business | Business data, AI, registry |
| **Storage** | R2: inneranimalmedia-assets, splineicons | Static assets, icons |
| **Postgres** | Hyperdrive → Supabase | Client data, analytics |

---

## Workers (31 in account)

### Core

- **inneranimalmedia** — Main site Worker (dashboard, API, auth)
- **inneranimal-mcp** — This MCP Worker
- **agent-command** — Agent command runner
- **meauxcloud**, **meauxbility**, **meauxide** — Product Workers

### Client sites

- pelicanpeptides, southernpetsanimalrescue, new-iberia-church
- pawlove, acemedical, anything-floors-and-more
- lg3industries, reynoldswrite, fuelnfreetime, etc.

### Apps

- meauxcad, meauxsql, meaux-services, inneranimalmediaservices

---

## MCP Tools

| Tool | Description |
|------|-------------|
| list_workers | List Inner Animal Media Workers (Cloudflare account) |
| platform_info | Platform overview (domains, DB, R2) |

More tools (deploy, D1 migrate, R2 sync) coming as we build out CI/CD.

---

## Wireframe

See **docs/PLATFORM_ECOSYSTEM_MAP.txt** for a 2D ASCII wireframe you can glance at to recall the layout.

---

## Deploy

```bash
npm install
npx wrangler deploy
```

Custom domains are configured in wrangler.toml; no workers.dev.

---

## Related Repos

- **inneranimalmedia** — Main site (worker, migrations, static)
- **inneranimalmedia-mcp** — This repo (MCP server)
- GitHub: https://github.com/InnerAnimal/inneranimalmedia-mcp
