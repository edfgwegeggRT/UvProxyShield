import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupProxy } from "./proxy";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register proxy route
  app.get("/api/proxy", async (req, res) => {
    const url = req.query.url as string;

    if (!url) {
      return res.status(400).json({ message: "URL parameter is required" });
    }

    try {
      // Validate URL
      new URL(url);
    } catch (error) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    try {
      // Forward the request to the proxy handler
      await setupProxy(req, res);
    } catch (error) {
      console.error("Proxy error:", error);
      return res.status(500).json({ message: "Failed to proxy the request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
