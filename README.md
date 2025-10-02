# Reload Test App

A modern, beautiful test application for integrating with Reload's OAuth flow and API endpoints. Features a stunning SaaS-like UI with glass morphism effects, smooth animations, and professional design.

## ✨ Features

- **🎨 Modern SaaS UI**: Beautiful glass morphism design with gradients and animations
- **🔐 OAuth 2.0 Integration**: PKCE flow with permission selection
- **🧪 API Testing Interface**: Interactive testing for all Reload endpoints
- **📱 Responsive Design**: Works perfectly on all device sizes
- **🌙 Dark Mode Support**: Beautiful dark theme with proper contrast
- **⚡ Smooth Animations**: Polished transitions and micro-interactions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Reload API Configuration
NEXT_PUBLIC_RELOAD_API_BASE_URL=https://api.withreload.com/v1
NEXT_PUBLIC_RELOAD_OAUTH_URL=http://localhost:3001
NEXT_PUBLIC_RELOAD_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_RELOAD_CLIENT_SECRET=your-client-secret-here
NEXT_PUBLIC_RELOAD_REDIRECT_URI=http://localhost:3000/callback

# Server-side configuration (for API routes)
RELOAD_API_BASE_URL=https://api.withreload.com/v1
RELOAD_OAUTH_URL=https://oauth.withreload.com
RELOAD_CLIENT_ID=your-client-id-here
RELOAD_CLIENT_SECRET=your-client-secret-here
RELOAD_REDIRECT_URI=http://localhost:3000/callback
```

## Required Environment Variables

- `NEXT_PUBLIC_RELOAD_CLIENT_ID`: Your Reload application client ID
- `NEXT_PUBLIC_RELOAD_REDIRECT_URI`: The redirect URI configured in your Reload application

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables in `.env.local`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- OAuth 2.0 with PKCE flow
- Permission selection (Identity, Usage Reporting, Payment)
- Wallet selection for payment operations
- API testing interface for various Reload endpoints
- Real-time API response display
- Copy-to-clipboard functionality

## Usage

1. Select the permissions you want to authorize
2. Click "Connect Reload Account" to start the OAuth flow
3. Complete authentication in the OAuth flow
4. Test various API endpoints using the provided interface