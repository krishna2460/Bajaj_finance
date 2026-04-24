# MongoDB Setup Guide - Graph Hierarchy Explorer

## ⚠️ MongoDB Not Found

MongoDB is not currently installed on your system. Choose one of these 3 options to proceed:

---

## Option 1: Quick Setup - MongoDB Atlas (Cloud) ⭐ RECOMMENDED

**Easiest option - No installation needed**

1. **Create Account** (Free):
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email

2. **Create Cluster**:
   - Click "Build a Database"
   - Select "Shared" (Free tier)
   - Choose region closest to you
   - Wait for deployment (3-5 minutes)

3. **Get Connection String**:
   - Click "Connect"
   - Select "Drivers"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Update Backend .env**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/graph_hierarchy?retryWrites=true&w=majority
   ```

5. **Save and run**:
   ```powershell
   cd backend
   npm run dev
   ```

---

## Option 2: Local Installation - MongoDB Community

**More control, local data**

### Windows (MSI Installer):

1. **Download**:
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64, MSI package
   - Click "Download"

2. **Install**:
   - Run the MSI installer
   - Follow the wizard
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```powershell
   mongod --version
   ```

4. **Start MongoDB**:
   - **Option A** - Windows Service (auto-starts):
     ```powershell
     # MongoDB runs as service automatically after installation
     Get-Service MongoDB
     ```
   
   - **Option B** - Manual Start:
     ```powershell
     mongod --dbpath "C:\data\db"
     ```

5. **Run the project**:
   ```powershell
   cd backend
   npm run dev
   ```

### macOS:

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install and start
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

## Option 3: Docker (If Docker is installed)

```powershell
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify connection
docker logs mongodb

# Stop when done
docker stop mongodb
```

---

## Verify MongoDB Connection

After starting MongoDB, test the connection:

```powershell
# In a new terminal
mongosh  # or 'mongo' for older versions

# Then in the mongo shell:
> db.version()
```

You should see the MongoDB version number.

---

## Quick Test: Run Without MongoDB

If you want to see the full application UI without data persistence:

1. Modify backend `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/graph_hierarchy
   NODE_ENV=development
   SKIP_DB_CHECK=true  # Add this (if backend supports)
   ```

2. The frontend will still load and show the UI, but:
   - Creating graphs won't persist
   - Good for testing UI/visualization

---

## Next Steps

Once MongoDB is running (local or cloud):

### Terminal 1 - Start Backend:
```powershell
cd c:\Users\krish\Downloads\bajaj_finance\backend
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected to: mongodb://localhost:27017/graph_hierarchy
Socket.IO ready
```

### Terminal 2 - Start Frontend:
```powershell
cd c:\Users\krish\Downloads\bajaj_finance\frontend
npm run dev
```

Expected output:
```
Local: http://localhost:5173/
```

### Terminal 3 - Open Browser:
```powershell
Start-Process "http://localhost:3000"
```

---

## Troubleshooting

### MongoDB connection refused?
- Check if MongoDB is running: `tasklist | findstr mongo` (Windows)
- Restart MongoDB service: `net start MongoDB`
- Check connection string in `.env`

### Port 5000 already in use?
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Port 3000 already in use?
```powershell
# Change in frontend/vite.config.js:
# port: 3000 → port: 3001
```

### Still having issues?
1. Check [docs/SETUP.md](docs/SETUP.md)
2. Review [QUICKSTART.md](QUICKSTART.md)
3. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## Recommended: MongoDB Atlas (Option 1)

For fastest setup with no local installation:
1. 5 minutes to get running
2. Free tier with 512 MB storage
3. Automatic backups
4. Easy to scale later

👉 [Create Free MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas/register)

---

After setting up MongoDB, run:
```powershell
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

Then open: http://localhost:3000
