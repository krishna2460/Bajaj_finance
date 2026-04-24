# Usage Examples

## Creating and Managing Graphs

### Example 1: Organization Chart

```bash
# 1. Create a graph
curl -X POST http://localhost:5000/api/graphs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "description": "Company organizational structure",
    "type": "directed"
  }'

# Response:
# {
#   "_id": "graph123",
#   "name": "Acme Corp",
#   ...
# }
```

### Example 2: Add Nodes (Employees)

```bash
# Add CEO
curl -X POST http://localhost:5000/api/nodes \
  -H "Content-Type: application/json" \
  -d '{
    "graphId": "graph123",
    "externalId": "emp001",
    "label": "John CEO",
    "data": {
      "title": "Chief Executive Officer",
      "department": "Executive"
    }
  }'

# Add Director
curl -X POST http://localhost:5000/api/nodes \
  -H "Content-Type: application/json" \
  -d '{
    "graphId": "graph123",
    "externalId": "emp002",
    "label": "Sarah Director",
    "data": {
      "title": "Director of Engineering",
      "department": "Engineering"
    }
  }'
```

### Example 3: Add Relationships (Edges)

```bash
# CEO manages Director
curl -X POST http://localhost:5000/api/edges \
  -H "Content-Type: application/json" \
  -d '{
    "graphId": "graph123",
    "sourceId": "emp001_id",
    "targetId": "emp002_id",
    "relationship": "manages",
    "label": "reports to"
  }'
```

## Querying Data

### Example 4: Get Graph Statistics

```bash
curl http://localhost:5000/api/analytics/graph/graph123
```

Response:
```json
{
  "graphId": "graph123",
  "name": "Acme Corp",
  "nodeCount": 150,
  "edgeCount": 147,
  "rootNodeCount": 1,
  "leafNodeCount": 45,
  "maxDepth": 4,
  "avgDepth": 2.3,
  "isCyclic": false
}
```

### Example 5: Traverse Organization (DFS)

```bash
# Start from CEO, go down
curl "http://localhost:5000/api/analytics/traverse/dfs/graph123/emp001_id?direction=down"
```

Response:
```json
{
  "algorithm": "DFS",
  "direction": "down",
  "result": [
    {
      "_id": "emp001_id",
      "label": "John CEO",
      "externalId": "emp001",
      "depth": 0
    },
    {
      "_id": "emp002_id",
      "label": "Sarah Director",
      "externalId": "emp002",
      "depth": 1
    },
    ...
  ]
}
```

### Example 6: Find Reporting Chain (Ancestors)

```bash
curl http://localhost:5000/api/nodes/emp010_id/ancestors
```

Response:
```json
{
  "nodeId": "emp010_id",
  "ancestors": [
    {
      "_id": "emp001_id",
      "label": "John CEO",
      "externalId": "emp001"
    },
    {
      "_id": "emp005_id",
      "label": "Manager Smith",
      "externalId": "emp005"
    }
  ]
}
```

### Example 7: Find Direct Reports (Descendants)

```bash
curl http://localhost:5000/api/nodes/emp002_id/descendants
```

## Analytics & Metrics

### Example 8: Get Node Importance

```bash
curl http://localhost:5000/api/analytics/metrics/graph123
```

Shows nodes ranked by degree (importance):
```json
[
  {
    "nodeId": "emp001_id",
    "label": "John CEO",
    "inDegree": 0,
    "outDegree": 8,
    "totalDegree": 8,
    "isRoot": true,
    "isLeaf": false
  },
  {
    "nodeId": "emp002_id",
    "label": "Sarah Director",
    "inDegree": 1,
    "outDegree": 5,
    "totalDegree": 6,
    "isRoot": false,
    "isLeaf": false
  },
  ...
]
```

### Example 9: Get Depth Distribution

```bash
curl http://localhost:5000/api/analytics/depth/graph123
```

Response:
```json
[
  { "depth": 0, "count": 1 },    # 1 CEO
  { "depth": 1, "count": 3 },    # 3 Directors
  { "depth": 2, "count": 25 },   # 25 Managers
  { "depth": 3, "count": 80 },   # 80 Individual Contributors
  { "depth": 4, "count": 41 }    # 41 Contractors
]
```

### Example 10: Get Leaf Nodes (Employees with no reports)

```bash
curl http://localhost:5000/api/analytics/leaves/graph123
```

## Real-time Updates (WebSocket)

### JavaScript Example:

```javascript
import io from 'socket.io-client'

const socket = io('http://localhost:5000')

// Join graph room
socket.emit('join-graph', 'graph123')

// Listen for real-time updates
socket.on('node-created', (node) => {
  console.log('New employee:', node.label)
})

socket.on('edge-created', (edge) => {
  console.log('New relationship created')
})

socket.on('graph-updated', (graph) => {
  console.log('Graph updated:', graph.name)
})
```

## Bulk Operations

### Example 11: Import Multiple Nodes

```javascript
const nodes = [
  { externalId: 'emp001', label: 'CEO' },
  { externalId: 'emp002', label: 'CTO' },
  { externalId: 'emp003', label: 'CFO' },
]

for (const node of nodes) {
  await fetch('/api/nodes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      graphId: 'graph123',
      ...node
    })
  })
}
```

## Path Finding

### Example 12: Find Path Between Employees

```bash
# Find all paths from John CEO to Employee X
curl "http://localhost:5000/api/analytics/paths/all/emp001_id/emp050_id"
```

### Example 13: Find Shortest Path

```bash
# Find shortest management chain
curl "http://localhost:5000/api/analytics/paths/shortest/emp001_id/emp050_id"
```

## Advanced Queries

### Example 14: Get Subtree of Manager

```bash
# Get all direct and indirect reports of Sarah
curl "http://localhost:5000/api/analytics/subtree/emp002_id?depth=3"
```

Response:
```json
{
  "_id": "emp002_id",
  "label": "Sarah Director",
  "depth": 1,
  "children": [
    {
      "_id": "emp010_id",
      "label": "Manager A",
      "depth": 2,
      "children": [...]
    },
    ...
  ]
}
```

## Data Export

### Example 15: Export Graph Data

```bash
curl http://localhost:5000/api/analytics/export/graph123 > graph_export.json
```

Exported file structure:
```json
{
  "graph": { ... },
  "nodes": [ ... ],
  "edges": [ ... ]
}
```

## Performance Tips

1. **Pagination**: Always use pagination for large result sets
   ```bash
   curl "http://localhost:5000/api/nodes?graphId=graph123&page=1&limit=50"
   ```

2. **Caching**: Cache frequently accessed nodes
   ```javascript
   const cache = new Map()
   ```

3. **Batch Operations**: Use batch endpoints when available

4. **Lazy Loading**: Load children on demand in UI

5. **Index Queries**: Ensure indexed fields are used in queries

## Monitoring Performance

Monitor query performance:
```bash
# Check graph stats
curl http://localhost:5000/api/analytics/graph/graph123
```

Look for:
- `nodeCount`: Should be reasonable (< 1M for medium scale)
- `maxDepth`: Should be reasonable (< 50)
- `isCyclic`: Should be false for tree structures
