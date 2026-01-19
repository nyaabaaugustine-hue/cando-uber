# Docker Deployment Guide for CyberCando Transport Dashboard

This document provides instructions for deploying the CyberCando Transport Dashboard using Docker containers.

## Prerequisites

- Docker Engine (v20.10 or higher)
- Docker Compose (v2.0 or higher)
- Git (for cloning the repository)

## Project Structure

The application consists of three main services:
- **Backend**: Java-based driver management and real-time tracking (port 8088)
- **API**: Node.js API gateway (port 8080)
- **Web**: React frontend (ports 5173 for dev, 80 for prod)

## Environment Variables

Before deploying, ensure you have a `.env.production` file in the root directory with the following variables:

```env
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
DISPATCH_CHAT_ID=your-dispatch-chat-id
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Deployment Options

### 1. Development Environment

To run the application in development mode with live reloading:

```bash
# Clone the repository
git clone <repository-url>
cd candi2.0

# Build and start all services
docker-compose -f docker-compose.dev.yml up --build
```

The application will be accessible at:
- Frontend: http://localhost:5173
- API: http://localhost:8080
- Backend: http://localhost:8088

### 2. Production Environment

To deploy the application in production mode:

```bash
# Clone the repository
git clone <repository-url>
cd candi2.0

# Build and start all services
docker-compose -f docker-compose.prod.yml up --build -d
```

The application will be accessible at:
- Frontend: http://localhost (port 80 mapped to host)
- API: http://localhost:8080
- Backend: http://localhost:8088

### 3. Default Environment (Staging)

To run with the default docker-compose.yml:

```bash
# Build and start all services
docker-compose up --build
```

## Docker Images

Three Docker images will be built:

### Backend Service (Dockerfile.backend)
- Based on Eclipse Temurin JDK 17 Alpine
- Runs the Java driver management system
- Exposes port 8088
- Handles real-time location tracking and Telegram bot integration

### API Service (Dockerfile.api)
- Based on Node.js 18 Alpine
- Runs the Node.js API gateway
- Exposes port 8080
- Manages authentication, WebSocket connections, and API routing

### Web Service (Dockerfile)
- Multi-stage build using Node.js for building and Nginx for serving
- Builds the React application
- Serves static files via Nginx
- Handles React Router via nginx configuration
- Exposes port 80 (or 5173 in dev mode)

## Docker Compose Networks

All services communicate through a shared network named `app-network`:
- backend: accessible as `http://backend:8088`
- api: accessible as `http://api:8080`
- web: serves the frontend

## Useful Commands

### Build and run:
```bash
docker-compose up --build
```

### Run in detached mode:
```bash
docker-compose up -d --build
```

### View logs:
```bash
docker-compose logs -f
```

### View specific service logs:
```bash
docker-compose logs -f api
docker-compose logs -f backend
docker-compose logs -f web
```

### Stop all services:
```bash
docker-compose down
```

### Stop and remove volumes:
```bash
docker-compose down -v
```

### Rebuild a specific service:
```bash
docker-compose build api
docker-compose up -d --no-deps api
```

## Production Considerations

1. **Security**: 
   - Change default JWT secrets
   - Use HTTPS in production
   - Restrict access to sensitive endpoints

2. **Environment Variables**:
   - Store sensitive data in environment variables
   - Use Docker secrets for sensitive production data

3. **Resource Limits**:
   - Set memory and CPU limits for containers
   - Monitor resource usage in production

4. **Backup Strategy**:
   - Implement backup procedures for critical data
   - Regularly test backup restoration

5. **Monitoring**:
   - Set up health checks
   - Implement logging aggregation
   - Configure alerting for critical issues

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs <service-name>`
- Verify environment variables are set correctly
- Ensure ports are not in use by other services

### Frontend not connecting to API
- Verify CORS settings in API service
- Check that API service is running and accessible
- Confirm network connectivity between containers

### Telegram bot not responding
- Verify TELEGRAM_BOT_TOKEN is correct
- Check that the bot is added to the correct group
- Ensure backend service is running and configured properly

## Scaling

The current setup is suitable for single-instance deployments. For scaling considerations:
- Use a load balancer for multiple instances
- Implement external database for persistent data
- Use external message queue for improved reliability
- Consider using Kubernetes for orchestration at scale

## Updating

To update the application:
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose up --build -d
```

This setup provides a complete containerized deployment solution for the CyberCando Transport Dashboard with proper service separation, networking, and environment management.