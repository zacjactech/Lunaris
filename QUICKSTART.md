# Quick Start Guide - Lunaris

Get Lunaris running locally in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm installed
- Terminal/Command Prompt

## 🚀 Fast Setup (Copy & Paste)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Lunaris

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### Step 2: Configure Environment Variables

**Backend (.env)**
```bash
cd backend
cp .env.example .env
```

Then edit `backend/.env` and set a secure JWT_SECRET:
```env
DB_PATH=data/sqlite.db
JWT_SECRET=your-super-secure-secret-key-change-this
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```bash
cd ../frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env
cd ..
```

### Step 3: Start the Application

**Option A: Two Terminals (Recommended)**

Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option B: One Terminal (Windows)**
```bash
cd backend && start cmd /k npm run start:dev && cd ../frontend && npm run dev
```

**Option B: One Terminal (Mac/Linux)**
```bash
cd backend && npm run start:dev & cd ../frontend && npm run dev
```

### Step 4: Open Your Browser

Navigate to: **http://localhost:3000**

## ✅ Verify It's Working

1. You should see the Lunaris login/register page
2. Click "Breathe" to register
3. Create an account with:
   - Email: test@example.com
   - Password: password123
   - Display Name: Test User
4. You should be redirected to the dashboard
5. Select an emotion (e.g., "Peaceful")
6. Write a note: "Testing my emotion journal!"
7. Click "Save Reflection"
8. Your entry should appear below

## 🐛 Troubleshooting

### Backend won't start

**Error**: `Cannot find module`
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Port 3001 already in use`
- Change PORT in `backend/.env` to 3002
- Update `frontend/.env` to `NEXT_PUBLIC_API_URL=http://localhost:3002`

### Frontend won't start

**Error**: `Cannot find module`
```bash
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

**Error**: `Port 3000 already in use`
```bash
# Frontend will automatically try 3001, 3002, etc.
# Or manually specify:
npm run dev -- -p 3005
```

### Can't connect to backend

1. Verify backend is running (check Terminal 1)
2. Check `frontend/.env` has correct `NEXT_PUBLIC_API_URL`
3. Open browser console (F12) and check for errors
4. Try accessing http://localhost:3001 directly - you should see "Cannot GET /"

### Database errors

```bash
cd backend
rm -rf data/
mkdir data
npm run start:dev
```

## 📝 Test Accounts

After starting, you can create test accounts:

```
Email: user1@test.com
Password: password123

Email: user2@test.com  
Password: password123
```

## 🎯 What to Test

- [ ] Register new account
- [ ] Login with credentials
- [ ] Create emotion entry
- [ ] View entries list
- [ ] Refresh page (entries persist)
- [ ] Logout
- [ ] Login again (entries still there)
- [ ] Create multiple entries
- [ ] Edit an entry (click on it)
- [ ] Delete an entry
- [ ] Try invalid login
- [ ] Try empty form submission

## 🔧 Development Commands

### Backend
```bash
cd backend

# Development with hot reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint
```

### Frontend
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Run tests
npm run test

# Lint code
npm run lint
```

## 📊 Project URLs

When running locally:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/entries (GET request)

## 🔐 Default Configuration

**Backend**:
- Port: 3001
- Database: SQLite (data/sqlite.db)
- JWT Access Token: 15 minutes
- JWT Refresh Token: 7 days

**Frontend**:
- Port: 3000
- API URL: http://localhost:3001

## 📚 Next Steps

1. ✅ Got it running? Great! Now test all features
2. 📖 Read the main README.md for detailed documentation
3. 🚀 Ready to deploy? Check DEPLOYMENT.md
4. ✉️ Ready to submit? Use SUBMISSION_CHECKLIST.md

## 💡 Pro Tips

1. **Keep both terminals visible** - you'll see errors immediately
2. **Use browser DevTools** (F12) - check Console and Network tabs
3. **Check backend logs** - they show all API requests
4. **Test in incognito** - ensures no cached data interferes
5. **Create multiple entries** - makes the UI look better

## 🆘 Still Having Issues?

1. Ensure Node.js 18+ is installed: `node --version`
2. Ensure npm is installed: `npm --version`
3. Check if ports 3000 and 3001 are available
4. Try restarting your computer (seriously, it helps sometimes!)
5. Delete node_modules and reinstall everything

---

**Happy coding! 🌙**
