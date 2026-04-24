# Backend - Graph Hierarchy Server

RESTful API server for hierarchical data processing with graph theory algorithms.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

### Graphs
- `POST /api/graphs` - Create graph
- `GET /api/graphs` - Get all graphs (paginated)
- `GET /api/graphs/:id` - Get graph by ID
- `PUT /api/graphs/:id` - Update graph
- `DELETE /api/graphs/:id` - Delete graph
- `POST /api/graphs/:id/refresh-stats` - Refresh statistics

### Nodes
- `POST /api/nodes` - Create node
- `GET /api/nodes?graphId=X` - Get nodes by graph
- `GET /api/nodes/:id` - Get node by ID
- `PUT /api/nodes/:id` - Update node
- `DELETE /api/nodes/:id` - Delete node
- `GET /api/nodes/:id/ancestors` - Get all ancestors
- `GET /api/nodes/:id/descendants` - Get all descendants
- `GET /api/nodes/:id/siblings` - Get siblings

### Edges
- `POST /api/edges` - Create edge
- `GET /api/edges?graphId=X` - Get edges by graph
- `GET /api/edges/:id` - Get edge by ID
- `DELETE /api/edges/:id` - Delete edge
- `GET /api/edges/incoming/:nodeId` - Get incoming edges
- `GET /api/edges/outgoing/:nodeId` - Get outgoing edges
- `PATCH /api/edges/:id/weight` - Update edge weight

### Analytics
- `GET /api/analytics/graph/:graphId` - Get graph statistics
- `GET /api/analytics/metrics/:graphId` - Get node metrics
- `GET /api/analytics/depth/:graphId` - Get depth distribution
- `GET /api/analytics/node/:nodeId` - Get node statistics
- `GET /api/analytics/traverse/dfs/:graphId/:startNodeId` - DFS traversal
- `GET /api/analytics/traverse/bfs/:graphId/:startNodeId` - BFS traversal
- `GET /api/analytics/paths/all/:startNodeId/:endNodeId` - Find all paths
- `GET /api/analytics/paths/shortest/:startNodeId/:endNodeId` - Find shortest path
- `GET /api/analytics/subtree/:nodeId` - Get subtree
- `GET /api/analytics/level/:graphId/:level` - Get nodes by level
- `GET /api/analytics/leaves/:graphId` - Get leaf nodes
- `GET /api/analytics/roots/:graphId` - Get root nodes

## WebSocket Events

- `join-graph` - Join a graph room
- `leave-graph` - Leave a graph room
- `node-created` - Node created
- `node-updated` - Node updated
- `node-deleted` - Node deleted
- `edge-created` - Edge created
- `edge-deleted` - Edge deleted
- `graph-updated` - Graph updated
- `stats-updated` - Statistics updated
