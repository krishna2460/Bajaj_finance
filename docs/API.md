# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently no authentication is required. Add JWT tokens to requests if needed.

## Graph Endpoints

### Create Graph
```http
POST /graphs
Content-Type: application/json

{
  "name": "Organization Chart",
  "description": "Company hierarchy",
  "type": "directed"
}
```

### Get All Graphs
```http
GET /graphs?page=1&limit=10
```

### Get Graph by ID
```http
GET /graphs/{graphId}
```

### Update Graph
```http
PUT /graphs/{graphId}
Content-Type: application/json

{
  "name": "Updated Name",
  "metadata": { "custom": "value" }
}
```

### Delete Graph
```http
DELETE /graphs/{graphId}
```

### Refresh Statistics
```http
POST /graphs/{graphId}/refresh-stats
```

## Node Endpoints

### Create Node
```http
POST /nodes
Content-Type: application/json

{
  "graphId": "{graphId}",
  "externalId": "node-1",
  "label": "CEO",
  "data": { "department": "Executive" },
  "metadata": { "color": "#1f77b4" }
}
```

### Get Nodes by Graph
```http
GET /nodes?graphId={graphId}&page=1&limit=50
```

### Get Node by ID
```http
GET /nodes/{nodeId}
```

### Update Node
```http
PUT /nodes/{nodeId}
Content-Type: application/json

{
  "label": "Updated Label",
  "data": { "updated": true }
}
```

### Delete Node
```http
DELETE /nodes/{nodeId}
```

### Get Ancestors
```http
GET /nodes/{nodeId}/ancestors
```

### Get Descendants
```http
GET /nodes/{nodeId}/descendants
```

### Get Siblings
```http
GET /nodes/{nodeId}/siblings
```

## Edge Endpoints

### Create Edge
```http
POST /edges
Content-Type: application/json

{
  "graphId": "{graphId}",
  "sourceId": "{sourceNodeId}",
  "targetId": "{targetNodeId}",
  "weight": 1,
  "label": "manages",
  "relationship": "parent-child"
}
```

### Get Edges by Graph
```http
GET /edges?graphId={graphId}&page=1&limit=50
```

### Delete Edge
```http
DELETE /edges/{edgeId}
```

### Update Edge Weight
```http
PATCH /edges/{edgeId}/weight
Content-Type: application/json

{
  "weight": 2
}
```

## Analytics Endpoints

### Get Graph Statistics
```http
GET /analytics/graph/{graphId}
```

Response:
```json
{
  "graphId": "{id}",
  "name": "Organization Chart",
  "nodeCount": 100,
  "edgeCount": 95,
  "maxDepth": 5,
  "avgDepth": 2.8,
  "isCyclic": false
}
```

### Get Node Metrics
```http
GET /analytics/metrics/{graphId}
```

### Get Depth Distribution
```http
GET /analytics/depth/{graphId}
```

### Get Node Statistics
```http
GET /analytics/node/{nodeId}
```

### DFS Traversal
```http
GET /analytics/traverse/dfs/{graphId}/{startNodeId}?direction=down
```

### BFS Traversal
```http
GET /analytics/traverse/bfs/{graphId}/{startNodeId}?direction=down
```

### Find All Paths
```http
GET /analytics/paths/all/{startNodeId}/{endNodeId}
```

### Find Shortest Path
```http
GET /analytics/paths/shortest/{startNodeId}/{endNodeId}
```

### Get Subtree
```http
GET /analytics/subtree/{nodeId}?depth=3
```

### Get Nodes by Level
```http
GET /analytics/level/{graphId}/{level}
```

### Get Leaf Nodes
```http
GET /analytics/leaves/{graphId}
```

### Get Root Nodes
```http
GET /analytics/roots/{graphId}
```

## WebSocket Events

### Connect
```javascript
const socket = io('http://localhost:5000')
```

### Join Graph
```javascript
socket.emit('join-graph', graphId)
socket.on('joined-graph', (data) => console.log(data))
```

### Listen for Updates
```javascript
socket.on('node-created', (node) => console.log('New node:', node))
socket.on('edge-created', (edge) => console.log('New edge:', edge))
socket.on('node-updated', (node) => console.log('Node updated:', node))
socket.on('stats-updated', (stats) => console.log('Stats updated:', stats))
```

## Error Handling

All endpoints return errors in this format:
```json
{
  "error": "Error message"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error
