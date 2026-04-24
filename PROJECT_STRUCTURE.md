project_tree = """
bajaj_finance/
├── README.md                          # Main documentation
├── QUICKSTART.md                      # 5-minute quick start guide
├── .gitignore                         # Git ignore file
│
├── backend/                           # Node.js/Express server
│   ├── src/
│   │   ├── index.js                   # Express app setup
│   │   ├── models/
│   │   │   ├── Graph.js               # Graph schema
│   │   │   ├── Node.js                # Node schema
│   │   │   └── Edge.js                # Edge schema
│   │   ├── services/
│   │   │   ├── graphService.js        # Graph operations
│   │   │   ├── nodeService.js         # Node operations
│   │   │   ├── edgeService.js         # Edge operations
│   │   │   ├── traversalService.js    # Graph algorithms (DFS, BFS, paths)
│   │   │   └── analyticsService.js    # Analytics & metrics
│   │   ├── routes/
│   │   │   ├── graphs.js              # Graph endpoints
│   │   │   ├── nodes.js               # Node endpoints
│   │   │   ├── edges.js               # Edge endpoints
│   │   │   └── analytics.js           # Analytics endpoints
│   │   └── socket/
│   │       └── graphEvents.js         # WebSocket handlers
│   ├── package.json                   # Dependencies
│   ├── .env.example                   # Environment template
│   └── README.md                      # Backend documentation
│
├── frontend/                          # React + D3.js application
│   ├── src/
│   │   ├── main.jsx                   # Entry point
│   │   ├── App.jsx                    # Main component
│   │   ├── index.html                 # HTML template
│   │   ├── components/
│   │   │   ├── GraphVisualization.jsx # D3.js visualization
│   │   │   ├── GraphExplorer.jsx      # Main explorer page
│   │   │   ├── GraphManagement.jsx    # Graph CRUD UI
│   │   │   ├── NodeEdgeManager.jsx    # Node/Edge management
│   │   │   ├── Analytics.jsx          # Charts & metrics
│   │   │   └── Common.jsx             # Reusable components
│   │   ├── services/
│   │   │   └── api.js                 # API client & socket
│   │   ├── store/
│   │   │   └── index.js               # Zustand store
│   │   └── styles/
│   │       └── index.css              # Tailwind styles
│   ├── package.json                   # Dependencies
│   ├── vite.config.js                 # Vite config
│   ├── tailwind.config.js             # Tailwind config
│   ├── postcss.config.js              # PostCSS config
│   ├── index.html                     # Main HTML
│   └── README.md                      # Frontend documentation
│
└── docs/                              # Documentation
    ├── API.md                         # API reference & examples
    ├── SETUP.md                       # Installation & setup
    ├── ARCHITECTURE.md                # System architecture
    ├── ALGORITHMS.md                  # Graph algorithms
    ├── EXAMPLES.md                    # Usage examples
    └── DEPLOYMENT.md                  # Production deployment
"""

print(project_tree)

# Technology Stack Summary
stack = {
    "Backend": {
        "Runtime": "Node.js",
        "Framework": "Express.js",
        "Database": "MongoDB",
        "Real-time": "Socket.IO",
        "ODM": "Mongoose",
        "Validation": "Joi",
        "Other": "Lodash, UUID"
    },
    "Frontend": {
        "Framework": "React 18",
        "Build Tool": "Vite",
        "Visualization": "D3.js 7",
        "Charts": "Recharts",
        "State": "Zustand",
        "Real-time": "Socket.IO Client",
        "Styling": "Tailwind CSS",
        "Icons": "Lucide React",
        "HTTP": "Axios"
    },
    "Database": {
        "Primary": "MongoDB",
        "Deployment": "Local or MongoDB Atlas",
        "Indexing": "Compound & Single indexes"
    },
    "Deployment": {
        "Local": "Node.js + MongoDB",
        "Docker": "Docker Compose",
        "Cloud": "Heroku, Vercel, AWS",
        "Scaling": "Horizontal with Kubernetes"
    }
}

print("\nTechnology Stack:")
for category, technologies in stack.items():
    print(f"\n{category}:")
    for tech, value in technologies.items():
        print(f"  • {tech}: {value}")
