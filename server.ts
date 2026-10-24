import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { getDb, closeDb, exec } from './server/db/database';
import { apiV1Router } from './server/routes';
import { requestLogger } from './server/middleware/logger';
import { errorHandler } from './server/middleware/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = express();

  // 1. Security & Parsing Middlewares
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 2. Structured Request Logging
  app.use(requestLogger);

  // 3. Database Initialization (connect to PostgreSQL via Supabase)
  await getDb();

  // 4. Run schema migrations (idempotent CREATE TABLE IF NOT EXISTS)
  const fsPromises = await import('fs/promises');
  const schemaPath = path.resolve(__dirname, 'server', 'db', 'schema.sql');
  const schemaSql = await fsPromises.readFile(schemaPath, 'utf-8');
  await exec(schemaSql);

  // 5. Mount Authoritative API V1 Router
  app.use('/api/v1', apiV1Router);

  // 6. Frontend Delivery (Vite middlewares in dev, dist static in prod)
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  // 7. Central Error Handler
  app.use(errorHandler);

  // 8. Start Server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 Ala El Saree Authoritative Backend & UI Running`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`📑 REST API v1: http://localhost:${PORT}/api/v1`);
    console.log(`📘 OpenAPI Docs: http://localhost:${PORT}/api/v1/docs`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/v1/system/health`);
    console.log(`====================================================`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing database pool...');
    await closeDb();
    process.exit(0);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
