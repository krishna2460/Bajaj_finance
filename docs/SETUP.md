# Installation & Setup Guide

## Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB 4.4+ (local or Atlas)
- Git

## Quick Start

### 1. Clone and Setup

```bash
cd bajaj_finance
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and configure:
```env
MONGODB_URI=mongodb://localhost:27017/graph_hierarchy
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

Expected output:
```
✓ Server running on http://localhost:5000
✓ MongoDB connected
```

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser to `http://localhost:3000`

## Docker Setup (Optional)

### Using Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/graph_hierarchy
      NODE_ENV: development
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Run:
```bash
docker-compose up
```

## MongoDB Setup

### Local Installation

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB runs as service on port 27017

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/graph_hierarchy
```

## Verification

### Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status": "ok", "timestamp": "2024-04-24T..."}
```

### Test Graph Creation
```bash
curl -X POST http://localhost:5000/api/graphs \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "type": "directed"}'
```

## Troubleshooting

### Backend fails to start

**Error: Cannot find module**
```bash
cd backend
npm install
```

**Error: MongoDB connection failed**
- Ensure MongoDB is running: `mongo --version`
- Check connection string in `.env`
- Verify MongoDB is accessible: `telnet localhost 27017`

### Frontend shows blank page

**Check console for errors (F12)**
- Verify backend is running on port 5000
- Check proxy configuration in `vite.config.js`
- Clear browser cache

### WebSocket connection fails

- Ensure backend is running
- Check browser console for exact error
- Verify CORS settings in backend `index.js`

## Development Workflow

### Hot Reload

Both frontend and backend support hot reload:

**Backend (Nodemon):**
```bash
npm run dev
```

**Frontend (Vite):**
```bash
npm run dev
```

### Building for Production

**Backend:**
```bash
# No build needed, uses Node.js directly
npm install --production
NODE_ENV=production node src/index.js
```

**Frontend:**
```bash
npm run build
npm run preview
```

## Next Steps

1. Read [API Documentation](./API.md)
2. Explore [Architecture Overview](./ARCHITECTURE.md)
3. Check [Usage Examples](./EXAMPLES.md)
4. Review [Graph Algorithms](./ALGORITHMS.md)

## Support

For issues:
1. Check error logs in backend console
2. Check browser console (F12)
3. Verify MongoDB connection
4. Check firewall/network settings
