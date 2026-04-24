# Frontend - Graph Hierarchy UI

React + D3.js frontend for visualizing and managing hierarchical graph data.

## Setup

```bash
npm install
npm run dev
```

## Features

- **Interactive Graph Visualization**: D3.js force-directed graph rendering
- **Real-time Updates**: WebSocket support for live data synchronization
- **Analytics Dashboard**: Node metrics and depth distribution charts
- **Graph Management**: Create, delete, and manage graphs
- **Node/Edge Management**: Add, delete, and modify nodes and edges
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Project Structure

```
src/
├── components/
│   ├── GraphVisualization.jsx    # D3.js graph rendering
│   ├── GraphManagement.jsx       # Graph CRUD operations
│   ├── NodeEdgeManager.jsx       # Node/Edge management
│   ├── Analytics.jsx             # Charts and metrics
│   └── Common.jsx                # Reusable components
├── pages/
│   └── GraphExplorer.jsx         # Main explorer page
├── services/
│   └── api.js                    # API client
├── store/
│   └── index.js                  # Zustand store
├── styles/
│   └── index.css                 # Tailwind styles
├── App.jsx
└── main.jsx
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Configuration

The frontend connects to the backend at `http://localhost:5000`. 
Modify the proxy setting in `vite.config.js` to change this.
