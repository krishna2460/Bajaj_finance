# Graph Algorithms Reference

## Overview

This document details the graph algorithms implemented in the hierarchical data processing application.

## Traversal Algorithms

### 1. Depth-First Search (DFS)

**Purpose**: Explore graph by going as deep as possible before backtracking

**Time Complexity**: O(V + E)
**Space Complexity**: O(V) for recursion stack

**Implementation**:
```javascript
async dfs(graphId, startNodeId, direction = 'down') {
  const visited = new Set()
  const result = []
  
  const traverse = async (nodeId) => {
    if (visited.has(nodeId)) return
    visited.add(nodeId)
    result.push({ _id: nodeId, ... })
    
    const node = await Node.findById(nodeId)
    const nextNodes = direction === 'down' ? node.children : node.parents
    
    for (const nextId of nextNodes) {
      await traverse(nextId)
    }
  }
  
  await traverse(startNodeId)
  return result
}
```

**Use Cases**:
- Finding all descendants of a node
- Detecting cycles in a graph
- Topological sorting
- Finding connected components

**Example**: Get all employees under a manager
```
CEO
├─ Manager A (depth 1)
│  ├─ Developer 1 (depth 2)
│  ├─ Developer 2 (depth 2)
│  └─ QA 1 (depth 2)
└─ Manager B (depth 1)
   └─ Designer 1 (depth 2)
```

### 2. Breadth-First Search (BFS)

**Purpose**: Explore graph level-by-level

**Time Complexity**: O(V + E)
**Space Complexity**: O(V) for queue

**Implementation**:
```javascript
async bfs(graphId, startNodeId, direction = 'down') {
  const visited = new Set()
  const result = []
  const queue = [startNodeId]
  visited.add(startNodeId)
  
  while (queue.length > 0) {
    const nodeId = queue.shift()
    const node = await Node.findById(nodeId)
    result.push({ _id: nodeId, ... })
    
    const nextNodes = direction === 'down' ? node.children : node.parents
    for (const nextId of nextNodes) {
      if (!visited.has(nextId)) {
        visited.add(nextId)
        queue.push(nextId)
      }
    }
  }
  
  return result
}
```

**Use Cases**:
- Finding shortest path
- Level-order traversal
- Finding connected components
- Social network distance

**Example**: Get all employees by management level
```
Level 0: CEO
Level 1: 3 Directors
Level 2: 25 Managers
Level 3: 80 Individual Contributors
```

## Path Finding Algorithms

### 3. All Paths Between Two Nodes

**Purpose**: Find every possible path from source to target

**Time Complexity**: O(V × V!) worst case
**Space Complexity**: O(V)

**Implementation**:
```javascript
async findAllPaths(startNodeId, endNodeId) {
  const paths = []
  const visited = new Set()
  
  const findPath = async (currentId, targetId, currentPath) => {
    if (currentId === targetId) {
      paths.push([...currentPath, currentId])
      return
    }
    
    if (visited.has(currentId)) return
    visited.add(currentId)
    
    const node = await Node.findById(currentId)
    for (const childId of node.children) {
      await findPath(childId, targetId, [...currentPath, currentId])
    }
    
    visited.delete(currentId)
  }
  
  await findPath(startNodeId, endNodeId, [])
  return paths
}
```

**Use Cases**:
- Finding alternative paths in networks
- Route optimization
- Dependency analysis
- Circular reference detection

**Example**: All chains of command from CEO to employee
```
Path 1: CEO → Director A → Manager 1 → Employee X
Path 2: CEO → Director B → Manager 2 → Employee X
```

### 4. Shortest Path (BFS-based)

**Purpose**: Find the minimum number of edges between two nodes

**Time Complexity**: O(V + E)
**Space Complexity**: O(V)

**Implementation**:
```javascript
async findShortestPath(startNodeId, endNodeId) {
  const visited = new Set()
  const queue = [[startNodeId]]
  visited.add(startNodeId)
  
  while (queue.length > 0) {
    const path = queue.shift()
    const nodeId = path[path.length - 1]
    
    if (nodeId === endNodeId) return path
    
    const node = await Node.findById(nodeId)
    for (const childId of node.children) {
      if (!visited.has(childId)) {
        visited.add(childId)
        queue.push([...path, childId])
      }
    }
  }
  
  return null
}
```

**Use Cases**:
- Navigation systems
- Network routing
- Social network distance (degrees of separation)
- Organizational hierarchy distance

**Example**: Shortest management chain
```
CEO → CTO → Engineering Manager → Senior Engineer
(Shortest: 3 hops)
```

## Relationship Queries

### 5. Get All Ancestors

**Purpose**: Find all nodes that lead to current node (upstream)

**Implementation**: Recursive search up the parent chain

**Example**: Get all managers above an employee
```
Employee
├─ Direct Manager
├─ Department Director
├─ VP of Engineering
├─ CTO
└─ CEO
```

### 6. Get All Descendants

**Purpose**: Find all nodes that can be reached from current node (downstream)

**Implementation**: Recursive search down the children

**Example**: Get entire team under a director
```
Director
├─ Manager 1
│  ├─ Employee A
│  ├─ Employee B
│  └─ Employee C
├─ Manager 2
│  ├─ Employee D
│  └─ Employee E
└─ Manager 3
   ├─ Employee F
   └─ Employee G
```

### 7. Get Siblings

**Purpose**: Find nodes with same parent

**Implementation**: Get parent's children and filter out self

## Analytics Algorithms

### 8. Centrality Metrics

**In-Degree**: Number of incoming edges
```
In-Degree tells you who manages/supervises this node
```

**Out-Degree**: Number of outgoing edges
```
Out-Degree tells you how many direct reports this node has
```

**Total Degree**: Sum of in and out degree
```
Total Degree indicates overall importance/connectivity
```

**Use Case**: Identify critical employees
```
CEO:
- In-Degree: 0 (nobody manages CEO)
- Out-Degree: 5 (manages 5 directors)
- Total Degree: 5 (highly connected)
```

### 9. Depth Calculation

**Purpose**: Determine level in hierarchy

**Implementation**: 
- Root nodes have depth 0
- Depth increases by 1 for each level

**Example**: Organization depth levels
```
Depth 0: 1 node (CEO)
Depth 1: 5 nodes (Directors)
Depth 2: 30 nodes (Managers)
Depth 3: 100 nodes (Individual Contributors)
Depth 4: 50 nodes (Contractors)
```

### 10. Cycle Detection

**Purpose**: Detect circular references (should not exist in hierarchies)

**Time Complexity**: O(V + E)
**Space Complexity**: O(V)

**Implementation**: DFS with recursion stack
- Track nodes in current path
- If we revisit a node in current path = cycle found
- Backtrack and clear from recursion stack

**Example**: Detect invalid circular reporting
```
❌ Invalid: Employee A reports to B, B reports to C, C reports to A
✓ Valid: Tree structure with no cycles
```

## Optimization Techniques

### 1. Memoization
Cache previously computed results:
```javascript
const cache = new Map()
if (cache.has(key)) return cache.get(key)
const result = computeExpensive()
cache.set(key, result)
```

### 2. Lazy Loading
Only load data when needed:
```javascript
// Load children only when expanded
const children = await node.populate('children')
```

### 3. Pagination
Process large result sets in chunks:
```javascript
const page = 1
const limit = 50
const results = await getResults(page, limit)
```

### 4. Indexing
Database indexes on frequently queried fields:
```javascript
nodeSchema.index({ graphId: 1, externalId: 1 }, { unique: true })
edgeSchema.index({ graphId: 1, source: 1, target: 1 })
```

## Complexity Analysis Summary

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| DFS | O(V+E) | O(V) | Deep exploration, cycles |
| BFS | O(V+E) | O(V) | Shortest path, levels |
| All Paths | O(V×V!) | O(V) | Alternative routes |
| Shortest Path | O(V+E) | O(V) | Optimal connections |
| Ancestors | O(V) | O(V) | Upstream relationships |
| Descendants | O(V) | O(V) | Downstream relationships |
| Centrality | O(V+E) | O(V) | Node importance |

## Performance Recommendations

For medium-scale graphs (10K-1M nodes):

1. **Use BFS for shortest path** (not DFS)
2. **Cache ancestor queries** (frequently accessed)
3. **Paginate large result sets** (avoid loading all at once)
4. **Use database indexes** (optimize queries)
5. **Batch operations** (reduce network round trips)
6. **Lazy load children** (UI optimization)

## Testing Algorithms

Sample test cases:

```javascript
// Test DFS
const result = await dfs(graphId, rootNodeId, 'down')
assert(result.length > 0, 'DFS should return results')
assert(result[0]._id === rootNodeId, 'First result should be start node')

// Test cycle detection
const cyclic = await detectCycles(graphId)
assert(cyclic === false, 'Tree should not have cycles')

// Test shortest path
const path = await findShortestPath(nodeA, nodeZ)
assert(path.length < alternatives.length, 'Should be shortest')
```
