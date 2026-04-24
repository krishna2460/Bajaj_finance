# Developer Guide

## Getting Started with Development

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+ (local or Atlas)
- Git
- VS Code (recommended)

### Development Environment Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd bajaj_finance

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev

# 3. In new terminal, Frontend setup
cd frontend
npm install
npm run dev

# 4. Open http://localhost:3000
```

## Code Organization

### Backend Structure

```
backend/src/
├── models/           # Mongoose schemas
├── services/         # Business logic
├── routes/          # Express routes
├── socket/          # WebSocket handlers
└── index.js         # Express setup
```

**Models** (`models/`):
- Define data structure
- Handle validation at schema level
- Create indexes for performance

**Services** (`services/`):
- Core business logic
- Graph algorithms
- Data manipulation
- Reusable functions

**Routes** (`routes/`):
- HTTP endpoints
- Request validation
- Response formatting
- Emit WebSocket events

### Frontend Structure

```
frontend/src/
├── components/      # React components
├── pages/          # Page layouts (if using routing)
├── services/       # API calls & WebSocket
├── store/          # Global state (Zustand)
├── styles/         # CSS
├── App.jsx         # Main component
└── main.jsx        # Entry point
```

**Components**:
- Reusable UI pieces
- Receive props from parent
- Use hooks for state

**Services**:
- API client (Axios)
- WebSocket management
- Authentication (if needed)

**Store**:
- Global state with Zustand
- Separate stores for different domains
- Actions for state updates

## Common Development Tasks

### Add a New API Endpoint

1. **Create service method** in `backend/src/services/`
   ```javascript
   async myNewMethod(param) {
     // Business logic
     return result
   }
   ```

2. **Create route** in `backend/src/routes/`
   ```javascript
   router.post('/myendpoint', async (req, res, next) => {
     try {
       const result = await service.myNewMethod(req.body)
       res.json(result)
    } catch (error) {
       next(error)
     }
   })
   ```

3. **Register route** in `backend/src/index.js`
   ```javascript
   app.use('/api/myroute', routeHandler)
   ```

4. **Use in frontend** in `frontend/src/services/api.js`
   ```javascript
   export const myAPI = {
     callEndpoint: (data) => axios.post(`${API_BASE}/myendpoint`, data)
   }
   ```

5. **Call from component**
   ```javascript
   const handleClick = async () => {
     const result = await myAPI.callEndpoint(data)
   }
   ```

### Add a New React Component

1. Create file `frontend/src/components/MyComponent.jsx`
   ```javascript
   export const MyComponent = ({ prop1, prop2 }) => {
     return <div>{prop1}</div>
   }
   ```

2. Export from `frontend/src/components/index.js` (if exists)

3. Import in parent component
   ```javascript
   import { MyComponent } from '../components/MyComponent'
   ```

### Add Database Schema

1. Create model in `backend/src/models/MyModel.js`
   ```javascript
   const mySchema = new mongoose.Schema({
     name: { type: String, required: true },
     // ... fields
   }, { timestamps: true })
   
   mySchema.index({ name: 1 })
   module.exports = mongoose.model('MyModel', mySchema)
   ```

2. Create service in `backend/src/services/myService.js`
   ```javascript
   const MyModel = require('../models/MyModel')
   
   class MyService {
     async create(data) { ... }
     async getById(id) { ... }
     // ... other methods
   }
   ```

3. Create routes in `backend/src/routes/myroutes.js`

## Testing

### Backend Tests

```bash
cd backend
npm test
```

Sample test:
```javascript
describe('NodeService', () => {
  test('should create node', async () => {
    const node = await nodeService.createNode(...)
    expect(node._id).toBeDefined()
    expect(node.label).toBe('Test')
  })
})
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Debugging

### Backend Debugging

**VS Code Debug Configuration** (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

**Console Logging**:
```javascript
console.log('Debug:', variable)
console.error('Error:', error)
```

### Frontend Debugging

**Browser DevTools**:
- Press F12 to open
- Network tab: See API calls
- Console tab: See errors
- React DevTools: Inspect components
- Redux DevTools: Inspect state

**VS Code Debugger**:
```json
{
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceFolder}/frontend/src"
}
```

## Performance Optimization

### Backend

```javascript
// 1. Add caching
const cache = new Map()

// 2. Use pagination
const LIMIT = 50

// 3. Index queries
nodeSchema.index({ graphId: 1, depth: 1 })

// 4. Batch operations
Promise.all([query1, query2, query3])
```

### Frontend

```javascript
// 1. Memoize components
const MyComponent = React.memo(Component)

// 2. Code splitting
const Component = lazy(() => import('./Component'))

// 3. Virtualization for long lists
<FixedSizeList />

// 4. Lazy load images
<img loading="lazy" />
```

## Code Style & Standards

### Backend

```javascript
// Use async/await, not callbacks
async function getData() {
  const data = await fetchData()
  return data
}

// Use try/catch for errors
try {
  await operation()
} catch (error) {
  logger.error(error)
}

// Use destructuring
const { name, id } = object
```

### Frontend

```javascript
// Use functional components
export const MyComponent = () => {
  const [state, setState] = useState()
  return <div />
}

// Use hooks, not classes
const MyComponent = () => {
  useEffect(() => {
    // Setup
    return () => { // Cleanup
    }
  }, [dependency])
}

// Use arrow functions
const handler = () => { }
```

## Commit Conventions

```bash
# Format: type(scope): description

git commit -m "feat(nodes): add node filtering"
git commit -m "fix(api): handle null responses"
git commit -m "docs(setup): update installation steps"
git commit -m "style: format code with prettier"
git commit -m "test(nodes): add node creation test"
git commit -m "refactor(services): extract common logic"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `test`: Tests
- `refactor`: Code reorganization

## Useful Commands

### Backend
```bash
npm run dev          # Start with hot reload
npm run test         # Run tests
npm run lint         # Check code style
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style
```

### Database
```bash
# MongoDB shell
mongo
show dbs
use graph_hierarchy
db.graphs.find()

# Backup
mongodump --db graph_hierarchy --out ./backup

# Restore
mongorestore --db graph_hierarchy ./backup/graph_hierarchy
```

## Troubleshooting Development

### Hot Reload Not Working

```bash
# Restart servers
# Kill processes: Ctrl+C
npm run dev
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues

```bash
# Test connection
# Backend terminal
node -e "require('mongoose').connect(process.env.MONGODB_URI)"

# Check MongoDB is running
mongo --version
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

## Adding Dependencies

### Backend
```bash
npm install package-name --save
npm install --save-dev dev-tool
```

### Frontend
```bash
npm install react-component
npm install --save-dev build-tool
```

## Removing Dependencies

```bash
npm uninstall package-name
npm uninstall --save-dev dev-tool
```

## Documentation

- Update README when adding features
- Add JSDoc comments to functions
- Update API documentation when changing endpoints
- Add examples for complex features

## Security Considerations

- Never commit `.env` file
- Use environment variables for secrets
- Validate all user input
- Use parameterized queries
- Sanitize data before displaying
- Use HTTPS in production
- Implement rate limiting
- Add authentication headers

## Resources

- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [D3.js Documentation](https://d3js.org/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
