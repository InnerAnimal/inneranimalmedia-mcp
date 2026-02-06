/**
 * Inner Animal Media MCP Server
 * Live: https://mcp.inneranimalmedia.com/mcp
 * Connects AI clients (Cursor, Copilot, Claude) to our 30+ Workers ecosystem.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

interface Env {}

export class InnerAnimalMCP extends McpAgent {
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
            text: "Platform: inneranimalmedia.com (main), mcp.inneranimalmedia.com (this MCP), meauxcad/meauxsql/meauxgames subdomains. D1: inneranimalmedia-business. R2: inneranimalmedia-assets, splineicons. See ECOSYSTEM-README.md and docs/PLATFORM_ECOSYSTEM_MAP.txt.",
          },
        ],
      })
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/mcp") {
      return InnerAnimalMCP.serve("/mcp").fetch(request, env, ctx);
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
