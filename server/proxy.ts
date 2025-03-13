
import { Request, Response } from "express";
import https from "https";
import http from "http";
import { URL } from "url";

// Function to decode base64 encoded URLs from UV
function decodeUrl(encodedUrl: string): string {
  try {
    return Buffer.from(encodedUrl, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error decoding URL:', error);
    return '';
  }
}

// Function to stream the proxied content
export async function setupProxy(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    let url: string;
    
    // Check for UV service pattern
    if (req.path.startsWith('/uv/service/')) {
      const encodedUrl = req.path.replace('/uv/service/', '');
      url = decodeUrl(encodedUrl);
    } else {
      url = req.query.url as string;
    }
    
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
        method: req.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Referer': 'https://duckduckgo.com/',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site',
          'Cache-Control': 'max-age=0',
        }
      };

      // Forward request body for POST, PUT, etc.
      if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
        options.headers['Content-Type'] = req.headers['content-type'] as string;
        options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(req.body));
      }

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

        // Set Headers for iframe embedding and fullscreen support
        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.setHeader('X-Frame-Options', 'ALLOW');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
        res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Permissions-Policy', 'fullscreen=*');

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

      // Send body data for POST, PUT, etc.
      if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
        proxyReq.write(JSON.stringify(req.body));
      }

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
