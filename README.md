<div align="center">
  <h1>🍬 Sugar Business EG</h1>
  <p><strong>A Modern React + Vite Platform for Sugar Business Management</strong></p>
  
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
  ![React](https://img.shields.io/badge/React-19.0-61dafb)
  ![Vite](https://img.shields.io/badge/Vite-6.2-646cff)
  ![Node](https://img.shields.io/badge/Node.js-Required-green)
  ![License](https://img.shields.io/badge/License-MIT-green)
  
  [Live Demo](https://sugar-business.vercel.app) • [Documentation](./API_SETUP_GUIDE.md) • [Setup Guide](./IMPLEMENTATION_SUMMARY.md)
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Authentication](#-authentication)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - Login/Register with token management
- 🏢 **Governorate Management** - Administrative dashboard for regional management
- 🛍️ **E-Commerce Shop** - Product catalog and ordering system
- 📊 **Analytics Dashboard** - User tracking and performance metrics
- 💼 **Service Management** - Request handling and approval workflows
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- 🎨 **Modern UI** - Beautiful animations with Motion library
- 🌙 **Dark Theme** - Professional dark mode interface

### Technical Features
- ⚡ **Fast Build** - Vite for rapid development
- 🎯 **Type Safe** - Full TypeScript support
- 🔄 **Real-time Updates** - CMS context for live content updates
- 📡 **API Integration** - Axios with advanced error handling
- 📸 **PDF Export** - Generate reports with html2canvas and jsPDF
- 🎪 **Rich Animations** - Motion library for smooth UX
- 🎯 **Code Quality** - ESLint and TypeScript linting

---

## 📦 Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Git** for version control
- A modern web browser

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/crystal-One1/Sugar-Business-.git
cd Sugar-Business-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env.local` file in the project root:

```env
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Application URL
APP_URL=http://localhost:5173

# API Server URL (for development)
VITE_API_URL=http://localhost:5000/api

# Environment
NODE_ENV=development
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | `AIzaSy...` |
| `APP_URL` | Application's public URL | `http://localhost:5173` |
| `VITE_API_URL` | Backend API endpoint (must start with `VITE_`) | `http://localhost:5000/api` |
| `NODE_ENV` | Runtime environment | `development` or `production` |

### For Vercel Deployment

1. Go to **Vercel Dashboard** → Your Project → **Settings**
2. Navigate to **Environment Variables**
3. Add the following:

```
VITE_API_URL = https://your-backend-api.com/api
```

4. Click **Redeploy** for changes to take effect

**Important:** Variables must start with `VITE_` to be accessible in the browser.

---

## 🏃 Running the App

### Development Mode
```bash
# Start development server with hot reload
npm run dev

# App will be available at: http://localhost:5173
```

### Build for Production
```bash
# Create optimized production build
npm run build

# Output will be in: dist/server.cjs
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
# Check TypeScript errors
npm run lint
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update: API configuration and authentication"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment:**
   - In Project Settings → Environment Variables
   - Add `VITE_API_URL` with your backend URL
   - Click "Redeploy Project"

4. **Verify Deployment:**
   - Check build logs for any errors
   - Open the provided Vercel URL
   - Test login functionality

### Deploy Backend Server

The backend API server configuration:
- **Route:** `/api/(.*)`
- **Destination:** Handled by Express server
- **Configuration:** See `server.ts` and `vercel.json`

---

## 📁 Project Structure

```
Sugar-Business-/
├── src/
│   ├── components/          # React components
│   │   ├── AuthModal.tsx    # Authentication dialog
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Shop.tsx         # E-commerce shop
│   │   ├── Services.tsx     # Service management
│   │   └── ...
│   ├── hooks/
│   │   └── useAuth.ts       # Authentication hook [NEW]
│   ├── lib/
│   │   ├── axiosConfig.ts   # Axios configuration [NEW]
│   │   ├── api.ts           # API utilities [UPDATED]
│   │   └── tracking.ts      # Analytics tracking
│   ├── App.tsx              # Main application
│   ├── CMSContext.tsx       # Content management
│   ├── ThemeContext.tsx     # Theme provider
│   └── main.tsx             # Entry point
├── server.ts                # Express backend server
├── vite.config.ts           # Vite configuration
├── vercel.json              # Vercel deployment config
├── .env.example             # Environment variables template [UPDATED]
├── API_SETUP_GUIDE.md       # API setup documentation [NEW]
├── IMPLEMENTATION_SUMMARY.md# Implementation guide [NEW]
└── package.json             # Project dependencies [UPDATED]
```

---

## 🔌 API Integration

### Overview

The application uses **Axios** for HTTP requests with:
- 🔄 Automatic request/response logging
- ✅ Comprehensive error handling
- 🔐 Token-based authentication
- 📊 Detailed debugging information

### Configuration Files

**`src/lib/axiosConfig.ts`**
- Central axios instance
- Request/response interceptors
- Token injection from localStorage
- Error handling and formatting

**`src/lib/api.ts`**
- API URL resolution
- Helper functions for HTTP methods
- Environment variable support

### Making API Calls

```typescript
import axiosInstance from '@/lib/axiosConfig';

// GET request
const response = await axiosInstance.get('/api/users');

// POST request
const result = await axiosInstance.post('/api/users/login', {
  phone: '01234567890',
  password: 'password123'
});

// Error handling
try {
  const data = await axiosInstance.post('/api/endpoint', payload);
  console.log('Success:', data);
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## 🔐 Authentication

### Using the useAuth Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { login, loading, error } = useAuth();

  const handleLogin = async (phone: string, password: string) => {
    const result = await login({ phone, password });
    
    if (result?.success) {
      // Login successful
      window.location.href = '/dashboard';
    } else {
      // Show error message
      console.error(error);
    }
  };

  return (
    // Component JSX
  );
}
```

### Authentication Flow

1. **Login Request** → User submits credentials
2. **Server Validation** → Backend verifies credentials
3. **Token Generation** → Server returns auth token
4. **Storage** → Token saved to localStorage
5. **Auto-injection** → Subsequent requests include token
6. **Validation** → Server validates token on each request
7. **401 Handling** → Auto-logout if token invalid

### Token Management

- **Storage Key:** `sugar_token`
- **Header:** `Authorization: Bearer <token>`
- **Expiration:** Handled by server
- **Refresh:** Manual re-login required

---

## 📊 Console Debugging

### Request Logs

When making API calls, check the browser console (F12):

```
🔄 [API Request] Sending to: http://localhost:5000/api/users/login
   Method: POST
   Data: { phone: '01234567890', password: '...' }
   Timestamp: 2026-07-04T21:30:00.000Z
```

### Success Logs

```
✅ [API Response] Received successfully:
   Status: 200
   URL: /users/login
   Data: { success: true, user: {...} }
   Timestamp: 2026-07-04T21:30:01.234Z
```

### Error Logs

```
❌ [API Server Error]
   Status: 401
   StatusText: Unauthorized
   Data: { message: 'Invalid credentials' }
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused" Error

**Problem:** Backend server not running or unreachable

**Solutions:**
1. Verify backend server is running
2. Check VITE_API_URL is correct
3. Ensure firewall allows connections
4. Test with: `curl http://localhost:5000/api/status`

### Issue: "CORS Error"

**Problem:** Backend not allowing requests from frontend domain

**Solutions:**
1. Add Vercel domain to backend CORS whitelist
2. Example: `https://your-app.vercel.app`
3. Or use `*` for development (not recommended for production)

### Issue: Environment Variables Not Loading

**Problem:** VITE_API_URL not accessible in browser

**Solutions:**
1. Ensure variable starts with `VITE_` prefix
2. Restart dev server: `npm run dev`
3. Check `.env.local` file syntax
4. Verify file is in project root

### Issue: Authentication Not Working

**Problem:** Login fails or token not persisting

**Solutions:**
1. Check browser localStorage is enabled
2. Verify API endpoint is correct
3. Check server response in Network tab (F12)
4. Look for error logs in browser console
5. Verify credentials are correct

### Issue: Vercel Deployment Fails

**Problem:** Build or deployment errors

**Solutions:**
1. Check build logs in Vercel dashboard
2. Ensure axios is in dependencies: `npm install axios`
3. Verify environment variables are set
4. Check `.env.example` for required variables
5. Try: `npm run build` locally to debug

---

## 📚 Documentation

- **[API Setup Guide](./API_SETUP_GUIDE.md)** - Detailed API configuration
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Complete changes overview
- **[Vite Documentation](https://vitejs.dev/guide/)**
- **[React Documentation](https://react.dev/)**
- **[Axios Documentation](https://axios-http.com/docs/intro)**
- **[Tailwind CSS](https://tailwindcss.com/docs)**

---

## 🤝 Contributing

### Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test:**
   ```bash
   npm run dev
   npm run lint
   ```

3. **Commit with clear message:**
   ```bash
   git commit -m "feat: Add your feature description"
   ```

4. **Push and create Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- Use TypeScript for all new code
- Follow component naming conventions
- Add comments for complex logic
- Test changes locally before pushing
- Run linter before committing

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support & Contact

- **Issues:** Report bugs via GitHub Issues
- **Questions:** Check existing documentation first
- **Email:** contact@sugar-business.com
- **WhatsApp:** +20 (phone number)

---

## 🎉 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Motion](https://motion.dev/)
- Icons by [Lucide React](https://lucide.dev/)
- Powered by [Vite](https://vitejs.dev/)

---

<div align="center">
  <p><strong>Made with ❤️ for Sugar Business EG</strong></p>
  <p><a href="https://github.com/crystal-One1">@crystal-One1</a></p>
  <p>© 2026 Sugar Business. All rights reserved.</p>
</div>
