# Google OAuth Setup Guide

## Step 1: Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

## Step 2: Update Environment Variables

Update `backend/.env` with your Google OAuth credentials:

```
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
SESSION_SECRET=your_random_session_secret_here
```

## Step 3: Test Google Login

1. Start your servers: `start-dev.bat`
2. Go to login page
3. Click "Continue with Google"
4. Complete Google authentication
5. You'll be redirected back and logged in automatically

## Quick Test Setup (Demo)

For immediate testing, you can use these demo credentials in your `.env`:

```
GOOGLE_CLIENT_ID=demo-client-id
GOOGLE_CLIENT_SECRET=demo-client-secret
SESSION_SECRET=demo-session-secret-12345
```

Note: Demo credentials won't work with real Google OAuth, but the app will run without errors.