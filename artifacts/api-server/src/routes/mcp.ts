import { Router, type Request, type Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "@workspace/mcp-server/src/server.js";

const router = Router();

router.all("/mcp", async (req: Request, res: Response) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    const server = createMcpServer();
    await server.connect(transport);
    await transport.handleRequest(req as any, res as any, req.body);
    res.on("finish", () => {
      server.close().catch(() => {});
    });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "MCP handler error" });
    }
  }
});

export default router;
