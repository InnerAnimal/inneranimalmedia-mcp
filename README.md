# inneranimalmedia-mcp

Inner Animal Media's company-wide MCP (Model Context Protocol) server. Connects AI clients (Cursor, Copilot, Claude) to our 30+ Workers ecosystem.

**Live:** https://mcp.inneranimalmedia.com/mcp

## Quick start

```bash
npm install
npx wrangler deploy
```

## MCP tools

- **list_workers** — List Inner Animal Media Cloudflare Workers
- **platform_info** — Platform overview (domains, D1, R2)

## Docs

- [ECOSYSTEM-README.md](./ECOSYSTEM-README.md) — Human-friendly platform overview
- [docs/PLATFORM_ECOSYSTEM_MAP.txt](./docs/PLATFORM_ECOSYSTEM_MAP.txt) — 2D ASCII wireframe

## CI/CD

Push to `main` deploys via GitHub Actions. Add `CLOUDFLARE_API_TOKEN` as a repo secret (Settings → Secrets → Actions).

## GitHub

[InnerAnimal/inneranimalmedia-mcp](https://github.com/InnerAnimal/inneranimalmedia-mcp)
