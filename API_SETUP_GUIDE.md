# API Integration Documentation

## Setting Up Environment Variables for Vercel

### 1. Local Development (`.env.local`)
Create a `.env.local` file in your project root:
```
VITE_API_URL=http://localhost:5000/api
```

### 2. Vercel Production Settings
Go to your Vercel Project Dashboard:
1. Settings → Environment Variables
2. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api`
   - **Environment**: Production, Preview

### 3. Important Notes

- **VITE_API_URL** must start with `VITE_` prefix to be accessible in the browser via `import.meta.env.VITE_API_URL`
- The API URL should NOT include the trailing slash
- After adding environment variables to Vercel, trigger a redeployment
- The axios configuration automatically handles:
  - Request/response logging
  - Error handling and formatting
  - CORS support
  - Token management from localStorage

## API Configuration Files

### `src/lib/axiosConfig.ts`
- Centralized axios instance configuration
- Automatic request/response interceptors
- Enhanced error handling with detailed logging
- Token injection from localStorage

### `src/lib/api.ts`
- API URL resolution (local vs. production)
- Helper functions for common HTTP methods
- Integration with axios configuration

### `src/hooks/useAuth.ts`
- Authentication hook with login/register
- Comprehensive error handling
- Token and user data management

## Testing API Connection

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Check Console for logs:
   - 🔄 Request logs show what's being sent
   - ✅ Success logs confirm connection
   - ❌ Error logs with detailed information

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Connection refused" | Ensure backend server is running and accessible |
| "Network Error" on production | Check VITE_API_URL in Vercel environment variables |
| "CORS error" | Add Vercel domain to backend CORS whitelist |
| "undefined is not a function" | Ensure axios is installed: `npm install axios` |
| Environment variables not loading | Rebuild/redeploy after adding variables to Vercel |

## Vercel Environment Variables Setup (Visual Guide)

```
Dashboard → Your Project → Settings → Environment Variables

Add:
Name: VITE_API_URL
Value: https://api.sugar-business.com
Environment: ✓ Production  ✓ Preview  ✓ Development (optional)
```

Then redeploy for changes to take effect.

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Axios Documentation](https://axios-http.com/docs/intro)
