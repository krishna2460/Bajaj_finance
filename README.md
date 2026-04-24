# Hierarchical Data Processing with Graph Theory

A full-stack application for processing, visualizing, and analyzing hierarchical data structures using graph theory algorithms.

## Features

- **Hierarchical Data Management**: Store and manage tree/graph structures with parent-child relationships
- **Advanced Traversal**: DFS, BFS, path finding, ancestor/descendant queries
- **Real-time Visualization**: Interactive D3.js-based graph rendering
- **Real-time Updates**: WebSocket support for live data synchronization
- **Performance Analytics**: Query optimization, node statistics, depth analysis
- **RESTful API**: Comprehensive backend APIs for all operations
- **Scalable Architecture**: Designed for 10K-1M nodes

## Project Structure

```
├── backend/                 # Node.js/Express server
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── services/       # Business logic (graph algorithms)
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication, error handling
│   │   ├── utils/          # Helper functions
│   │   ├── socket/         # WebSocket handlers
│   │   └── index.js        # Express app setup
│   ├── package.json
│   └── .env.example
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utilities
│   │   ├── styles/         # CSS/Styled components
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── docs/                    # Documentation

## Quick Start

See individual README files in `backend/` and `frontend/` folders.

## Architecture Overview

### Data Model
- **Node**: Represents entities with metadata
- **Edge**: Represents relationships between nodes
- **Graph**: Collection of nodes and edges

### Key Algorithms
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Path Finding (Shortest path, all paths)
- Cycle Detection
- Ancestor/Descendant queries

### API Endpoints
- `POST /api/graphs` - Create graph
- `GET /api/graphs/:id` - Get graph
- `POST /api/graphs/:id/nodes` - Add node
- `POST /api/graphs/:id/edges` - Add edge
- `GET /api/graphs/:id/traverse?algorithm=dfs&start=nodeId` - Traverse
- `GET /api/graphs/:id/analytics` - Get statistics

## Performance Considerations

- Indexed MongoDB queries for fast lookups
- In-memory caching for frequent traversals
- Query optimization with proper indexing
- Batch operations support
- WebSocket compression for real-time updates
