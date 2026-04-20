import { Router } from "express";
import type { IncomingMessage, ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "@workspace/mcp-server/src/server.js";

const router = Router();

// Expose all 48 FERNS tools via MCP Streamable HTTP transport (stateless).
// Accessible at data.ecologicalcommons.org/mcp in production.
router.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const server = createMcpServer();
  await server.connect(transport);
  // Close the MCP server once the HTTP response is complete.
  res.on("finish", () => server.close().catch(() => {}));
  // Express Request/Response extend Node.js IncomingMessage/ServerResponse.
  await transport.handleRequest(req as IncomingMessage, res as ServerResponse, req.body);
});

export default router;
