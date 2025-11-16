# Lunaris - Emotion Journal Web App

> A calm, minimalist emotion journal application that helps people express better, repair faster, and grow together.

![Lunaris Banner](https://img.shields.io/badge/Built%20with-Next.js%20%2B%20NestJS-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🌙 Overview

Lunaris is a full-stack emotion journal web application designed to provide users with a secure, tranquil digital space to record and reflect on their feelings. The application features a modern tech stack with Next.js frontend and NestJS backend, offering a seamless experience for emotional wellness tracking.

**Live Demo:** 
- **Frontend**: https://cosmic-babka-a9c6fd.netlify.app/
- **Backend API**: https://lunaris-production-92be.up.railway.app

## ✨ Features

- **Emotion Selection**: Choose from 10 predefined emotions (Peaceful, Grateful, Hopeful, Joyful, Anxious, Sad, Frustrated, Overwhelmed, Neutral, Reflective)
- **Journal Entries**: Write detailed notes about your feelings with a clean, distraction-free interface
- **Entry History**: View all past emotions and notes in a beautiful, organized timeline
- **Secure Authentication**: JWT-based authentication with refresh token rotation
- **Smooth Animations**: Subtle, calming animations powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Optional Ambient Audio**: Enhance your reflective experience with background music

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API communication

### Backend
- **NestJS** (Node.js framework)
- **TypeORM** for database operations
- **SQLite** for data persistence
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security headers

## 📦 Project Structure

```
Lunaris/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── contexts/            # React contexts (Auth)
│   ├── lib/                 # Utilities and configurations
│   └── package.json
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management module
│   │   ├── entries/        # Journal entries module
│   │   ├── common/         # Shared utilities
│   │   └── main.ts         # Application entry point
│   ├── data/               # SQLite database storage
│   └── package.json
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/zacjactech/Lunaris.git
cd Lunaris
```

2. **Set up the Backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env and set your JWT_SECRET
# JWT_SECRET=your-secure-random-secret-key-here
```

3. **Set up the Frontend**
```bash
cd ../frontend
npm install

# Create .env file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env
```

### Running Locally

1. **Start the Backend** (Terminal 1)
```bash
cd backend
npm run start:dev
```
The backend will run on `http://localhost:3001`

2. **Start the Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with credentials
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Entries
- `GET /api/entries` - Get all entries for authenticated user
- `POST /api/entries` - Create a new entry
- `GET /api/entries/:id` - Get a specific entry
- `PUT /api/entries/:id` - Update an entry
- `DELETE /api/entries/:id` - Delete an entry

## 💭 Reflection Questions

### Architecture Thinking: Why this frontend + backend? How do they communicate?

I chose **Next.js** for the frontend because it provides an excellent developer experience with built-in TypeScript support, server-side rendering capabilities, and optimized performance out of the box. The App Router architecture allows for intuitive file-based routing and modern React patterns. For the backend, **NestJS** was selected for its robust, scalable architecture that mirrors Angular's modular design. It provides excellent TypeScript support, built-in dependency injection, and a clean separation of concerns through modules, controllers, and services.

The communication between frontend and backend follows a **RESTful API pattern** using JSON over HTTP. The frontend uses Axios to make authenticated requests to the backend, with JWT tokens passed in the Authorization header. I implemented an axios interceptor that automatically attaches the access token to every request and handles token refresh on 401 errors, ensuring seamless authentication without user interruption. CORS is properly configured to allow the frontend origin, and all sensitive data is transmitted securely with HttpOnly cookies for refresh tokens.

### Problem Solving: What was the hardest part, and how did you solve it?

The most challenging aspect was implementing **secure, seamless authentication with automatic token refresh**. The complexity came from coordinating multiple moving parts: short-lived access tokens (15 minutes), long-lived refresh tokens (7 days), HttpOnly cookies, and handling race conditions when multiple API calls fail simultaneously due to an expired token.

I solved this by creating a centralized authentication context that manages token state and implements an axios response interceptor. When a 401 error occurs, the interceptor attempts to refresh the token using the refresh token stored in an HttpOnly cookie. If successful, it retries the original request with the new token. To prevent multiple simultaneous refresh attempts, I added a promise queue that ensures only one refresh request happens at a time. Additionally, I implemented proper error boundaries and fallback UI states to handle authentication failures gracefully, redirecting users to the login page only when refresh is impossible.

### Database Design: How is the data structured? How would you scale it for 1M users?

The database uses a **simple relational structure** with two main entities: Users and Entries. The User entity stores id (UUID), email (unique indexed), passwordHash, displayName, and createdAt. The Entry entity contains id (UUID), userId (foreign key with CASCADE delete), emotion, note (text), and createdAt (indexed). This design ensures data integrity through foreign key constraints and enables efficient queries through strategic indexing on userId and createdAt fields.

For scaling to **1 million users**, I would implement several strategies: (1) **Migrate from SQLite to PostgreSQL** for better concurrent write performance and advanced features like connection pooling and replication. (2) **Add database indexing** on frequently queried fields and implement pagination for entry lists to avoid loading thousands of records at once. (3) **Implement caching** using Redis for frequently accessed data like user profiles and recent entries, reducing database load. (4) **Partition the entries table** by date ranges (monthly or yearly) to improve query performance as data grows. (5) **Add read replicas** for the database to distribute read traffic and implement a CDN for static assets. (6) **Consider sharding** by userId if a single database becomes a bottleneck, distributing users across multiple database instances.

### User Experience: How did you ensure smooth, simple UX?

I prioritized **simplicity and calmness** throughout the design. The emotion selection uses a visual button grid rather than a dropdown, making it immediately clear what options are available without extra clicks. The color palette uses soft, muted tones (#F8FAFC background, #4C8BF5 accent) that create a peaceful atmosphere. Form validation provides immediate, helpful feedback without being intrusive, and error messages are clear and actionable.

**Smooth interactions** were achieved through Framer Motion animations that feel natural and purposeful—entry cards fade in with a subtle upward motion, buttons have gentle hover effects (scale 1.02), and page transitions use easing functions that feel organic. I implemented optimistic UI updates where new entries appear immediately in the list without waiting for server confirmation, then reconcile with the server response. The interface respects user preferences by detecting `prefers-reduced-motion` and disabling non-essential animations. Loading states are clear with spinners, and the empty state provides encouraging messaging: "No entries yet — take a moment to reflect."

### Improvement Vision: If you had 3 more days, what would you improve?

With three additional days, I would focus on three key areas:

**1. Enhanced Analytics & Insights** - Implement a dashboard showing emotion trends over time with charts (using Chart.js or Recharts). Users could see patterns like "You felt anxious 5 times this week" or "Your most common emotion this month was Grateful." This would add value by helping users understand their emotional patterns and track progress over time.

**2. Rich Text Editor & Media Support** - Upgrade the note textarea to a rich text editor (like Tiptap or Slate) allowing formatting, bullet points, and the ability to attach photos or voice notes. Many people express emotions better through images or voice, and this would make the journal more versatile and personal.

**3. Social Features & Sharing** - Add optional features like sharing anonymous entries with a supportive community, following friends' public reflections, or sending encouragement to others. This aligns with Comminxy's mission of helping people "grow together" and would transform Lunaris from a solo tool into a community platform while maintaining privacy controls.

### Deployment Steps: Step-by-step guide to deploy both frontend & backend

#### Backend Deployment (Render)

1. **Prepare the Backend**
   - Ensure `package.json` has a `start:prod` script: `"start:prod": "node dist/main"`
   - Create a `render.yaml` or use Render dashboard

2. **Deploy to Render**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: lunaris-backend
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install && npm run build`
     - **Start Command**: `cd backend && npm run start:prod`
     - **Add Environment Variables**:
       - `JWT_SECRET`: (generate a secure random string)
       - `DB_PATH`: `data/sqlite.db`
       - `PORT`: `3001`
       - `FRONTEND_URL`: (will add after frontend deployment)
       - `NODE_ENV`: `production`

3. **Add Persistent Disk**
   - In Render dashboard, go to your service
   - Navigate to "Disks" tab
   - Add disk: Mount path `/opt/render/project/src/backend/data`, Size: 1GB
   - This ensures your SQLite database persists across deployments

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://lunaris-backend.onrender.com`)

#### Frontend Deployment (Vercel)

1. **Prepare the Frontend**
   - Ensure `package.json` has proper build scripts
   - Update `next.config.js` if needed for production settings

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`

3. **Add Environment Variables**
   - In project settings, add:
     - `NEXT_PUBLIC_API_URL`: (your Render backend URL from step 4 above)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the deployment URL (e.g., `https://lunaris.vercel.app`)

5. **Update Backend CORS**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the backend service

#### Verification

1. Visit your Vercel URL
2. Register a new account
3. Create an emotion entry
4. Verify it appears in your entries list
5. Test logout and login functionality

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Generate coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Short-lived access tokens (15min) with refresh token rotation
- **HttpOnly Cookies**: Refresh tokens stored securely to prevent XSS attacks
- **Input Validation**: class-validator for all DTOs
- **XSS Protection**: Input sanitization on all user-generated content
- **CORS Configuration**: Restricted to frontend origin only
- **Security Headers**: Helmet middleware for HTTP security headers
- **Rate Limiting**: Throttling on authentication endpoints to prevent brute force attacks

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built for Comminxy's technical assessment. Special thanks to the team for creating a challenge that focuses on meaningful, human-centered technology.

---

**Note**: This project was built with care and attention to detail, focusing on creating something I'd personally be proud to use. The calm, minimalist design reflects the belief that technology should support our wellbeing, not distract from it.
