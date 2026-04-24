# Graph Hierarchy Explorer - Quick Start

Get up and running in 5 minutes!

## 1️⃣ Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows: Run MongoDB service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
mongo --version  # Verify it's running
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Get connection string from "Connect" button
- Update backend `.env` with your URI

## 2️⃣ Start Backend (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

✓ You should see: `✓ Server running on http://localhost:5000`

## 3️⃣ Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✓ Browser should open: `http://localhost:3000`

## 4️⃣ Create Your First Graph

1. Click **"New Graph"** button
2. Enter name: "My Organization"
3. Click **"Create"**
4. Click on your graph to explore it

## 5️⃣ Add Nodes & Edges

### Add Nodes (People/Entities)
1. Go to **"Manage"** tab
2. Click **"Add Node"**
3. Enter:
   - External ID: `ceo-001`
   - Label: `CEO`
4. Click **"Create"**
5. Repeat for more nodes

### Add Edges (Relationships)
1. Click **"Add Edge"**
2. Select:
   - Source: CEO
   - Target: Manager
   - Weight: 1
3. Click **"Create"**

## 6️⃣ Visualize Your Graph

1. Go to **"Visualization"** tab
2. See interactive force-directed graph
3. Click nodes to select them
4. Drag to reposition

## 7️⃣ Analyze Your Data

Go to **"Analytics"** tab to see:
- 📊 Node degree distribution
- 📈 Depth level analysis
- 🎯 Top nodes by importance

## 📚 Learn More

- 🔧 [Setup Guide](docs/SETUP.md) - Detailed installation
- 🌐 [API Docs](docs/API.md) - All endpoints
- 📖 [Examples](docs/EXAMPLES.md) - Real-world usage
- 🧮 [Algorithms](docs/ALGORITHMS.md) - Technical details
- 🏗️ [Architecture](docs/ARCHITECTURE.md) - System design

## 🎯 Common Tasks

### Export Graph Data
```bash
curl http://localhost:5000/api/analytics/export/GRAPH_ID > export.json
```

### Get Graph Statistics
```bash
curl http://localhost:5000/api/analytics/graph/GRAPH_ID
```

### Find All Paths Between Nodes
```bash
curl http://localhost:5000/api/analytics/paths/all/NODE1_ID/NODE2_ID
```

### Get Shortest Path
```bash
curl http://localhost:5000/api/analytics/paths/shortest/NODE1_ID/NODE2_ID
```

### Traverse Graph (DFS)
```bash
curl "http://localhost:5000/api/analytics/traverse/dfs/GRAPH_ID/START_NODE_ID?direction=down"
```

## ⚡ Tips

- **Real-time Updates**: Open multiple browser tabs for a single graph to see real-time sync
- **Performance**: Graphs work best with 10K-1M nodes
- **Mobile**: UI is responsive and works on tablets
- **Keyboard**: Use arrow keys to navigate between tabs

## 🐛 Troubleshooting

**Backend won't start**
```bash
# Check MongoDB is running
mongo --version

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Frontend blank page**
```bash
# Clear browser cache (Ctrl+Shift+Del)
# Check console for errors (F12)
# Verify backend is running on port 5000
```

**WebSocket connection fails**
- Check backend is running
- Verify CORS settings
- Check browser console for exact error

## 📞 Support

For more help, see:
- Error logs in backend console
- Browser console (F12)
- Network tab (F12) to debug API calls
- MongoDB logs for database issues

---

**Happy exploring! 🚀**

Next: [Read the API Documentation](docs/API.md)
