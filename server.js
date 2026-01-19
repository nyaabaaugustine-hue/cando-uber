#!/usr/bin/env node

// Combined server for Railpack deployment
// Serves both API and static frontend files

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
const staticDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dashboard/web/dist');

// Create public directory if it doesn't exist
if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
}

app.use(express.static(staticDir));

// Also serve from dist directory if it exists
if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
}

// API routes - proxy to the actual API server
// For now, we'll just return a simple response
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API gateway is running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for Sliplane
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    message: 'CyberCando Transport Dashboard is running',
    timestamp: new Date().toISOString()
  });
});

// Catch-all handler to serve index.html for any route not handled above
// This enables client-side routing for React Router
app.get('*', (req, res) => {
  // Try to serve from public first, then from dist
  const indexPath = fs.existsSync(path.join(staticDir, 'index.html')) 
    ? path.join(staticDir, 'index.html')
    : fs.existsSync(path.join(distDir, 'index.html'))
      ? path.join(distDir, 'index.html')
      : path.join(staticDir, 'index.html'); // fallback
  
  res.sendFile(indexPath);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${staticDir} and ${distDir}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  // Don't close the server, just log the event
  // In cloud environments like Sliplane, we typically don't want to close the server
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  // Don't close the server, just log the event
});