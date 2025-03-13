import { Request, Response } from "express";
import https from "https";
import http from "http";
import { URL } from "url";

// Function to stream the proxied content
export async function setupProxy(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = req.query.url as string;
    if (!url) {
      res.status(400).send('URL parameter is required');
      return reject(new Error('URL parameter is required'));
    }

    try {
      const targetUrl = new URL(url);
      const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Referer': targetUrl.origin,
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site',
          'Cache-Control': 'max-age=0',
        }
      };

      // Choose protocol
      const protocol = targetUrl.protocol === 'https:' ? https : http;

      const proxyReq = protocol.request(options, (proxyRes) => {
        // Set headers from the proxied response
        Object.keys(proxyRes.headers).forEach(key => {
          if (key !== 'content-length' && key !== 'transfer-encoding') {
            try {
              res.setHeader(key, proxyRes.headers[key] as string);
            } catch (err) {
              console.warn(`Could not set header ${key}:`, err);
            }
          }
        });

        // Set Content-Security-Policy to allow embedding in iframe
        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");

        // Set status code
        res.statusCode = proxyRes.statusCode || 200;

        // Pipe the proxy response to the client response
        proxyRes.pipe(res);

        proxyRes.on('end', () => {
          resolve();
        });
      });

      proxyReq.on('error', (error) => {
        console.error(`Error proxying request to ${url}:`, error);
        if (!res.headersSent) {
          res.status(500).send(`Failed to proxy request: ${error.message}`);
        }
        reject(error);
      });

      // End the request
      proxyReq.end();

    } catch (error) {
      console.error('Error in proxy setup:', error);
      if (!res.headersSent) {
        res.status(500).send(`Failed to set up proxy: ${(error as Error).message}`);
      }
      reject(error);
    }
  });
}
