require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

// Import routes
const graphRoutes = require('./routes/graphs');
const nodeRoutes = require('./routes/nodes');
const edgeRoutes = require('./routes/edges');
const analyticsRoutes = require('./routes/analytics');
const bfhlRoutes = require('./routes/bfhl');

// Import socket handlers
const setupGraphSockets = require('./socket/graphEvents');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL || 25000),
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT || 60000)
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Make io accessible to routes
app.set('io', io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/graphs', graphRoutes);
app.use('/api/nodes', nodeRoutes);
app.use('/api/edges', edgeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/bfhl', bfhlRoutes);

// Socket.IO event handlers
setupGraphSockets(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/graph_hierarchy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('✗ MongoDB connection failed:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };
