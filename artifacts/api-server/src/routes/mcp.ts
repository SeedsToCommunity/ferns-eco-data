import { Router } from "express";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "@workspace/mcp-server/src/server.js";

const router = Router();

router.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  const server = createMcpServer();

  try {
    await server.connect(transport);

    // Register cleanup before handleRequest so the finish/close events
    // are always captured, even if the response ends synchronously.
    let closed = false;
    const cleanup = () => {
      if (!closed) {
        closed = true;
        server.close().catch(() => {});
      }
    };
    res.on("finish", cleanup);
    res.on("close", cleanup);

    // Express Request/Response structurally satisfy IncomingMessage/ServerResponse
    // since they extend those Node.js HTTP types.
    await transport.handleRequest(
      req as unknown as IncomingMessage,
      res as unknown as ServerResponse,
      req.body,
    );
  } catch (err) {
    server.close().catch(() => {});
    if (!res.headersSent) {
      res.status(500).json({ error: "MCP handler error" });
    }
  }
});

export default router;
