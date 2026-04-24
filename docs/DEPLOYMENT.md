# Deployment Guide

## Development Deployment

### Local Machine
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: MongoDB (if local)
mongod
```

## Production Deployment

### 1. Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### 2. Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Update API endpoint in code if needed
```

Or use GitHub Actions for auto-deploy:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 3. Database (MongoDB Atlas)

```bash
# 1. Create cluster at https://cloud.mongodb.com
# 2. Create database user
# 3. Get connection string
# 4. Whitelist IP addresses
# 5. Update backend .env with connection string
```

## Docker Deployment

### Build Images

```bash
# Backend
cd backend
docker build -t graph-backend:latest .

# Frontend
cd frontend
docker build -t graph-frontend:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Production Docker Compose

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network

  backend:
    image: graph-backend:latest
    restart: always
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/graph_hierarchy
      NODE_ENV: production
      CORS_ORIGIN: https://yourdomain.com
    depends_on:
      - mongodb
    networks:
      - app-network

  frontend:
    image: graph-frontend:latest
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mongo_data:

networks:
  app-network:
```

## Performance Optimization

### Backend Optimization

```javascript
// 1. Enable caching
const cache = require('redis').createClient()

// 2. Use connection pooling
const poolSize = 10

// 3. Add compression
app.use(compression())

// 4. Rate limiting
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api/', limiter)

// 5. GZIP compression
app.use(compression())
```

### Frontend Optimization

```javascript
// 1. Code splitting
import { lazy, Suspense } from 'react'
const GraphExplorer = lazy(() => import('./components/GraphExplorer'))

// 2. Image optimization
import { Image } from 'next/image'

// 3. Lazy loading
<Suspense fallback={<Loader />}>
  <GraphExplorer />
</Suspense>

// 4. Service Workers
import { register } from 'workbox-window'
```

### Database Optimization

```javascript
// 1. Connection pooling
const poolSize = process.env.POOL_SIZE || 10

// 2. Query optimization
db.nodes.createIndex({ graphId: 1, depth: 1 })

// 3. Pagination
db.collection.find().limit(50).skip(page * 50)

// 4. TTL indexes for cache
db.cache.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
```

## Monitoring & Logging

### Logging Setup

```javascript
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = logger
```

### Error Tracking (Sentry)

```javascript
const Sentry = require("@sentry/node")

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

app.use(Sentry.Handlers.errorHandler())
```

### Performance Monitoring

```javascript
const newrelic = require('newrelic')
// Tracks performance automatically
```

## Scaling Strategies

### Horizontal Scaling

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: graph-backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: backend
        image: graph-backend:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### Database Sharding

For > 10M nodes:
- Shard by graphId
- Distribute across multiple MongoDB instances
- Use consistent hashing for node distribution

### Caching Layer

```javascript
const redis = require('redis')
const client = redis.createClient()

// Cache graph stats
const key = `graph:${graphId}:stats`
const cached = await client.get(key)
if (cached) return JSON.parse(cached)

const stats = await computeStats()
await client.setex(key, 3600, JSON.stringify(stats))
return stats
```

## Security Checklist

- [ ] Enable HTTPS/TLS
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add input validation (Joi)
- [ ] Enable CORS only for trusted origins
- [ ] Use secure WebSocket (WSS)
- [ ] Implement JWT authentication
- [ ] Add database backups
- [ ] Enable MongoDB authentication
- [ ] Use firewall rules
- [ ] Regular security updates
- [ ] OWASP compliance

## Backup & Recovery

### MongoDB Backup

```bash
# Backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/dbname" \
  --out ./backup

# Restore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/dbname" \
  ./backup
```

### Automated Backup

```yaml
# Cron job for daily backups
0 2 * * * mongodump --uri "..." --out /backups/$(date +\%Y-\%m-\%d)
```

## Health Checks

```javascript
// Health endpoint
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  res.json(health)
})

// Readiness check
app.get('/ready', async (req, res) => {
  try {
    await db.admin().ping()
    res.json({ ready: true })
  } catch (err) {
    res.status(503).json({ ready: false })
  }
})
```

## Rollback Procedures

```bash
# Git rollback
git revert <commit-hash>
git push production main

# Docker rollback
docker pull graph-backend:previous
docker tag graph-backend:previous graph-backend:latest
docker-compose up -d
```

## Maintenance Windows

- Schedule during low-traffic hours
- Send notifications in advance
- Keep rollback plan ready
- Monitor during and after deployment
- Document all changes
