import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import path from "path";
import fs from "fs";

// Rate limiting storage (in-memory for production, use Redis for scaling)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max requests per window
  
  let record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitStore.set(ip, record);
    next();
    return;
  }
  
  record.count++;
  
  if (record.count > maxRequests) {
    res.status(429).json({ 
      message: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    });
    return;
  }
  
  next();
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([ip, record]) => {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  });
}, 5 * 60 * 1000);

// Security headers middleware
function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Content Security Policy
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://fonts.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://www.google-analytics.com;"
  );
  
  // X-Frame-Options
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  
  // X-Content-Type-Options
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Referrer-Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Permissions-Policy
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  
  // Strict-Transport-Security (HTTPS)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  
  next();
}

// Cache control middleware
function cacheControl(req: Request, res: Response, next: NextFunction) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2'];
  const url = req.url;
  
  if (staticExtensions.some(ext => url.endsWith(ext))) {
    // Static assets - long cache
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (url.startsWith('/api/')) {
    // API requests - no cache
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  } else {
    // HTML pages - short cache
    res.setHeader("Cache-Control", "public, max-age=3600");
  }
  
  next();
}

const app = express();
const httpServer = createServer(app);

// Apply security and cache middleware
app.use(securityHeaders);
app.use(cacheControl);

// Apply rate limiting
app.use(rateLimitMiddleware);

// Session middleware
app.use(session({
  secret: "marketzone-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Dynamic sitemap generation
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://www.marketzone.com';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/ar/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/en/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/auth</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/stores</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/checkout</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/orders</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/track</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/seller/dashboard</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/driver/dashboard</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/admin/dashboard</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  res.type('application/xml');
  res.send(sitemap);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  const robots = `# MarketZone Robots.txt
# https://www.marketzone.com

User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.marketzone.com/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Block admin paths
Disallow: /api/
Disallow: /seller/dashboard
Disallow: /driver/dashboard
Disallow: /admin/dashboard

# Googlebot
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Bingbot
User-agent: Bingbot
Allow: /
Crawl-delay: 1
`;
  res.type('text/plain');
  res.send(robots);
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();

