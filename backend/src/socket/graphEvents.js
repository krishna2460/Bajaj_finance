const setupGraphSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('✓ Client connected:', socket.id);

    // Join graph room
    socket.on('join-graph', (graphId) => {
      socket.join(`graph-${graphId}`);
      console.log(`✓ Client joined graph: ${graphId}`);
      socket.emit('joined-graph', { graphId });
    });

    // Leave graph room
    socket.on('leave-graph', (graphId) => {
      socket.leave(`graph-${graphId}`);
      console.log(`✓ Client left graph: ${graphId}`);
    });

    // Relay real-time updates
    socket.on('node-change', (data) => {
      socket.broadcast.to(`graph-${data.graphId}`).emit('node-change', data);
    });

    socket.on('edge-change', (data) => {
      socket.broadcast.to(`graph-${data.graphId}`).emit('edge-change', data);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('✓ Client disconnected:', socket.id);
    });
  });
};

module.exports = setupGraphSockets;
