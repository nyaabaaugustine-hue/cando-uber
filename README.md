# CyberCando Transport Dashboard

A real-time driver location tracking system for the CyberCando transport platform.

## 🚀 Features

- **Real-time Driver Tracking**: Live location updates via WebSocket
- **Dashboard Analytics**: Comprehensive operational metrics
- **User Management**: Role-based access control (admin/dispatcher/viewer)
- **Interactive Maps**: Leaflet-powered geographic visualization
- **Authentication**: Secure JWT-based login system

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API communication
- Leaflet for maps

### Backend
- Node.js with Express
- WebSocket for real-time updates
- JWT authentication
- CSRF protection

### Mobile Driver App
- Java-based Android application
- Real-time location broadcasting
- WebSocket connectivity

## 📁 Project Structure

```
candi2.0/
├── dashboard/
│   ├── api/          # Node.js backend server
│   ├── web/          # React frontend
│   └── dash/         # Legacy dashboard (Horizon theme)
├── driber/           # Java mobile driver application
├── public/           # Static assets for deployment
└── server.js         # Combined deployment server
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Java 8+ (for driver app)
- npm or yarn

### Development Setup

1. **Install dependencies:**
```bash
# Install API dependencies
cd dashboard/api
npm install

# Install frontend dependencies  
cd ../web
npm install
```

2. **Start development servers:**
```bash
# Terminal 1: Start API server
cd dashboard/api
node server.js

# Terminal 2: Start React frontend
cd dashboard/web
npm run dev

# Terminal 3: Start driver simulator (optional)
node mock_driver_app.js
```

### Production Deployment

1. **Build the frontend:**
```bash
cd dashboard/web
npm run build
```

2. **Start production server:**
```bash
# From project root
npm start
```

## 🔧 Environment Variables

Create `.env` files in respective directories:

**dashboard/api/.env:**
```env
PORT=8080
JWT_SECRET=your-secret-key
TOKEN_EXPIRES=3600
CORS_ORIGIN=http://localhost:5173
OPERATIONS_BASE=http://localhost:8090
```

## 🎯 Default Credentials

**Admin Account:**
- Email: `admin@local.test`
- Password: `Admin123!`

## 🌐 API Endpoints

- `POST /auth/login` - User authentication
- `GET /me` - Current user info
- `GET /ops/events` - Operational events
- `GET /ops/rides` - Ride information
- `GET /users` - User management (admin only)

## 📱 Driver App Integration

The Java-based driver application connects via WebSocket to broadcast real-time location data to the dashboard.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions, please open an issue on GitHub.