/**
 * ARCHETYPES SERVER - LITE VERSION
 * Backend léger sans base de données
 * Reçoit → Transmet directement à Lindy
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat';
import trackingRoutes from './routes/tracking';
import analyticsRoutes from './routes/analytics';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Server is reachable' });
});

// Chat routes
app.use('/api', chatRoutes);

// Tracking routes
app.use('/api', trackingRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('[Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// ============================================
// START SERVER
// ============================================

async function startServer() {
  try {
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    🚀 ARCHETYPES SERVER LITE STARTED SUCCESSFULLY 🚀      ║
║                                                            ║
║  Server running on: http://localhost:${PORT}                    ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  Database: ❌ NONE (In-memory only)                        ║
║                                                            ║
║  Endpoints:                                                ║
║  ✅ POST /api/track-behavior                              ║
║  ✅ POST /api/chat-opened                                 ║
║  ✅ POST /api/visitor-message                             ║
║  ✅ POST /api/send-popup-message                          ║
║  ✅ POST /api/send-chat-message                           ║
║  ✅ GET  /api/chat-response/:visitorId                    ║
║  ✅ POST /api/analytics/conversion                        ║
║  ✅ POST /api/analytics/product-update                    ║
║  ✅ GET  /test                                            ║
║                                                            ║
║  Webhooks Lindy:                                           ║
║  ✅ Flow 1 - Tracking                                     ║
║  ✅ Flow 2 - Chat                                         ║
║  ✅ Flow 3 - Conversions                                  ║
║  ✅ Flow 4 - Products                                     ║
║                                                            ║
║  Mode: DIRECT FORWARDING (No Database)                    ║
║  Messages stored in memory (resets on restart)            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
