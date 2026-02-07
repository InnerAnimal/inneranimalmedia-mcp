# inneranimalmedia-mcp — Setup (Cannot Fuck Up Edition)

## 1. Add ONE Secret

**Repo:** [InnerAnimal/inneranimalmedia-mcp](https://github.com/InnerAnimal/inneranimalmedia-mcp)

1. Click **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `CLOUDFLARE_API_TOKEN`
4. Value: Cloudflare API token ([create one](https://dash.cloudflare.com/profile/api-tokens) → Edit Cloudflare Workers)

Without this, deploy fails with a clear error. Add it once, never think about it again.

---

## 2. Push to Main = Deploy

- **Push to main** → validate → deploy → R2 backup
- **PR** → validate only (no deploy)
- ** workflow_dispatch** → Manual run from Actions tab

---

## 3. Local Git (SSH)

Remote is set to use the deploy key:

```
git@github.com-inneranimal-mcp:InnerAnimal/inneranimalmedia-mcp.git
```

SSH config (`~/.ssh/config`) already has the host. Just `git push origin main`.

---

## 4. What Can Go Wrong

| Issue | Fix |
|-------|-----|
| "CLOUDFLARE_API_TOKEN not set" | Add secret (step 1) |
| npm ci fails | Delete `package-lock.json`, run `npm install`, commit new lockfile |
| wrangler deploy fails | Check token has Workers + R2 permissions |
| R2 backup fails | Non-blocking (deploy still succeeds) |

---

## 5. Workflow File

Single file: `.github/workflows/ci.yml`. No other workflows. No conflicts.
