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

## CI/CD (bulletproof)

**One secret:** `CLOUDFLARE_API_TOKEN`

1. Settings → Secrets and variables → Actions → New repository secret
2. Name: `CLOUDFLARE_API_TOKEN`
3. Value: [Create token](https://dash.cloudflare.com/profile/api-tokens) → Edit Cloudflare Workers template

**Flow:** Push to `main` → validate → deploy → R2 backup. PRs validate only.

**Deploy key:** For SSH push/pull, use `git@github.com-inneranimal-mcp:InnerAnimal/inneranimalmedia-mcp.git`

## GitHub

[InnerAnimal/inneranimalmedia-mcp](https://github.com/InnerAnimal/inneranimalmedia-mcp)
