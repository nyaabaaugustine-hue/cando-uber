#!/usr/bin/env node

// Combined server for Railpack deployment
// Serves both API and static frontend files

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// API routes - proxy to the actual API server
// For now, we'll just return a simple response
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API gateway is running',
    timestamp: new Date().toISOString()
  });
});

// Catch-all handler to serve index.html for any route not handled above
// This enables client-side routing for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${staticDir}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});