/**
 * Inner Animal Media MCP Server
 * Live: https://mcp.inneranimalmedia.com/mcp
 * Connects AI clients (Cursor, Copilot, Claude) to our 30+ Workers ecosystem.
 * R2 tools: r2_list, r2_search, r2_bucket_summary
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

interface Env {
  MCP_BUCKET?: R2Bucket;
  ASSETS_BUCKET?: R2Bucket;
  DB?: D1Database;
}

/** Set per-request so tool handlers can access R2/D1 */
let currentEnv: Env | null = null;

function getBucket(env: Env, bucketId: string): R2Bucket | null {
  if (bucketId === "agent-sam" || bucketId === "MCP_BUCKET") return env.MCP_BUCKET ?? null;
  if (bucketId === "inneranimalmedia-assets" || bucketId === "ASSETS_BUCKET") return env.ASSETS_BUCKET ?? null;
  return env.MCP_BUCKET ?? env.ASSETS_BUCKET ?? null;
}

export class InnerAnimalMCP extends McpAgent<Env> {
  server = new McpServer({
    name: "Inner Animal Media MCP",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "list_workers",
      { limit: z.number().optional() },
      async ({ limit }) => ({
        content: [
          {
            type: "text",
            text: "Workers: inneranimalmedia, inneranimal-mcp, meauxcad, meauxsql, pelicanpeptides, southernpetsanimalrescue, new-iberia-church, pawlove, acemedical, anything-floors-and-more, meauxcloud, meauxbility, meauxide, agent-command, mcprimeaux, mcp-server, and more. See ECOSYSTEM-README.md for full map.",
          },
        ],
      })
    );

    this.server.tool(
      "platform_info",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: "Platform: inneranimalmedia.com (main), mcp.inneranimalmedia.com (this MCP), meauxcad/meauxsql/meauxgames subdomains. D1: inneranimalmedia-business. R2: inneranimalmedia-assets, agent-sam, splineicons. See ECOSYSTEM-README.md and docs/PLATFORM_ECOSYSTEM_MAP.txt.",
          },
        ],
      })
    );

    this.server.tool(
      "r2_list",
      {
        bucket: z.enum(["agent-sam", "inneranimalmedia-assets"]),
        prefix: z.string().optional(),
        limit: z.number().min(1).max(1000).optional(),
      },
      async ({ bucket, prefix, limit = 100 }) => {
        const env = currentEnv;
        if (!env) return { content: [{ type: "text", text: "Error: no env" }] };
        const b = getBucket(env, bucket);
        if (!b) return { content: [{ type: "text", text: `Bucket ${bucket} not bound` }] };
        try {
          const list = await b.list({ prefix: prefix ?? "", limit });
          const rows = list.objects.map((o) => ({
            key: o.key,
            size: o.size,
            uploaded: o.uploaded?.toISOString(),
            etag: o.etag,
          }));
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  bucket,
                  truncated: list.truncated,
                  cursor: list.cursor,
                  count: rows.length,
                  objects: rows,
                }, null, 2),
              },
            ],
          };
        } catch (e: unknown) {
          return { content: [{ type: "text", text: `R2 list failed: ${e instanceof Error ? e.message : String(e)}` }] };
        }
      }
    );

    this.server.tool(
      "r2_search",
      {
        bucket: z.enum(["agent-sam", "inneranimalmedia-assets"]).optional(),
        prefix: z.string().optional(),
        suffix: z.string().optional(),
        limit: z.number().min(1).max(200).optional(),
      },
      async ({ bucket, prefix, suffix, limit = 50 }) => {
        const env = currentEnv;
        if (!env) return { content: [{ type: "text", text: "Error: no env" }] };
        if (env.DB) {
          try {
            const buckets = bucket ? [bucket] : ["agent-sam", "inneranimalmedia-assets"];
            const conds: string[] = [];
            const params: (string | number)[] = [];
            if (prefix) {
              conds.push("object_key LIKE ?");
              params.push(`${prefix}%`);
            }
            if (suffix) {
              conds.push("object_key LIKE ?");
              params.push(`%${suffix}`);
            }
            conds.push(`bucket_name IN (${buckets.map(() => "?").join(",")})`);
            params.push(...buckets, limit);
            const res = await env.DB.prepare(
              `SELECT bucket_name, object_key, size_bytes, last_modified_iso FROM r2_object_inventory WHERE ${conds.join(" AND ")} ORDER BY bucket_name, object_key LIMIT ?`
            )
              .bind(...params)
              .all();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ source: "r2_object_inventory", rows: res.results ?? [] }, null, 2),
                },
              ],
            };
          } catch (_) {
            /* fall through to R2 */
          }
        }
        const b = bucket ? getBucket(env, bucket) : env.MCP_BUCKET ?? env.ASSETS_BUCKET ?? null;
        if (!b) return { content: [{ type: "text", text: "No bucket bound for search" }] };
        const bn = bucket ?? (env.MCP_BUCKET ? "agent-sam" : "inneranimalmedia-assets");
        try {
          const list = await b.list({ prefix: prefix ?? "", limit: limit ?? 100 });
          let rows = list.objects.map((o) => ({ key: o.key, size: o.size, uploaded: o.uploaded?.toISOString() }));
          if (suffix) rows = rows.filter((r) => r.key.endsWith(suffix));
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ bucket: bn, source: "r2_list", count: rows.length, objects: rows }, null, 2),
              },
            ],
          };
        } catch (e: unknown) {
          return { content: [{ type: "text", text: `R2 search failed: ${e instanceof Error ? e.message : String(e)}` }] };
        }
      }
    );

    this.server.tool(
      "human_context_list",
      { topic: z.string().optional(), limit: z.number().min(1).max(50).optional() },
      async ({ topic, limit = 10 }) => {
        const env = currentEnv;
        if (!env?.DB) return { content: [{ type: "text", text: "Error: DB not bound" }] };
        try {
          const q = topic
            ? env.DB.prepare("SELECT id, topic, note, author, created_at FROM human_context WHERE topic = ? ORDER BY created_at DESC LIMIT ?").bind(topic, limit)
            : env.DB.prepare("SELECT id, topic, note, author, created_at FROM human_context ORDER BY created_at DESC LIMIT ?").bind(limit);
          const res = await q.all();
          return { content: [{ type: "text", text: JSON.stringify(res.results ?? [], null, 2) }] };
        } catch (e: unknown) {
          return { content: [{ type: "text", text: `human_context_list failed: ${e instanceof Error ? e.message : String(e)}` }] };
        }
      }
    );

    this.server.tool(
      "human_context_add",
      { topic: z.string().optional(), note: z.string(), author: z.string().optional() },
      async ({ topic, note, author = "sam" }) => {
        const env = currentEnv;
        if (!env?.DB) return { content: [{ type: "text", text: "Error: DB not bound" }] };
        try {
          await env.DB.prepare("INSERT INTO human_context (topic, note, author) VALUES (?, ?, ?)").bind(topic ?? null, note, author).run();
          return { content: [{ type: "text", text: "human_context note added" }] };
        } catch (e: unknown) {
          return { content: [{ type: "text", text: `human_context_add failed: ${e instanceof Error ? e.message : String(e)}` }] };
        }
      }
    );

    this.server.tool(
      "r2_bucket_summary",
      {
        bucket: z.enum(["agent-sam", "inneranimalmedia-assets"]).optional(),
      },
      async ({ bucket }) => {
        const env = currentEnv;
        if (!env) return { content: [{ type: "text", text: "Error: no env" }] };
        const buckets: { id: string; b: R2Bucket | null }[] = bucket
          ? [{ id: bucket, b: getBucket(env, bucket) }]
          : [
              { id: "agent-sam", b: env.MCP_BUCKET ?? null },
              { id: "inneranimalmedia-assets", b: env.ASSETS_BUCKET ?? null },
            ];
        const summaries: Record<string, { count: number; totalBytes: number }> = {};
        for (const { id, b } of buckets) {
          if (!b) {
            summaries[id] = { count: 0, totalBytes: 0 };
            continue;
          }
          try {
            let count = 0,
              totalBytes = 0;
            let cursor: string | undefined;
            do {
              const list = await b.list({ limit: 1000, cursor });
              for (const o of list.objects) {
                count++;
                totalBytes += o.size ?? 0;
              }
              cursor = list.truncated ? list.cursor : undefined;
            } while (cursor);
            summaries[id] = { count, totalBytes };
          } catch {
            summaries[id] = { count: -1, totalBytes: -1 };
          }
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summaries, null, 2),
            },
          ],
        };
      }
    );
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/mcp") {
      currentEnv = env;
      try {
        return await InnerAnimalMCP.serve("/mcp").fetch(request, env, ctx);
      } finally {
        currentEnv = null;
      }
    }
    if (url.pathname === "/" || url.pathname === "") {
      return new Response("Inner Animal Media MCP — use /mcp", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }
    return new Response("Not found", { status: 404 });
  },
};
