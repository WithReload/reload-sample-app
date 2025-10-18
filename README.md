# Reload API Test App

A comprehensive test application for integrating with the Reload API platform. This app demonstrates how to implement OAuth authentication, usage reporting, and payment processing for AI agent monetization.

## 🚀 Features

- **OAuth 2.0 Integration**: Complete PKCE flow implementation
- **API Testing**: Interactive testing of all Reload API endpoints
- **Usage Reporting**: Report usage and optionally charge users
- **Token Management**: Revoke and introspect OAuth tokens
- **Real-time Responses**: Live API response viewing with copy functionality
- **Permission-based UI**: Dynamic UI based on OAuth permissions
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Reload API credentials (Client ID, Client Secret)
- Reload API access (Sandbox or Production)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reload-test-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```

4. **Configure Environment Variables**
   Edit `.env.local` with your Reload API credentials:
   ```env
   # Client-side variables (exposed to browser)
   NEXT_PUBLIC_RELOAD_API_BASE_URL=https://api.withreload.com/v1
   NEXT_PUBLIC_RELOAD_OAUTH_URL=https://oauth.withreload.com
   NEXT_PUBLIC_RELOAD_CLIENT_ID=your_client_id_here
   NEXT_PUBLIC_RELOAD_REDIRECT_URI=http://localhost:3002/callback

   # Server-side variables (not exposed to browser)
   RELOAD_API_BASE_URL=https://api.withreload.com/v1
   RELOAD_OAUTH_URL=https://oauth.withreload.com
   RELOAD_CLIENT_ID=your_client_id_here
   RELOAD_CLIENT_SECRET=your_client_secret_here
   RELOAD_REDIRECT_URI=http://localhost:3002/callback
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3002](http://localhost:3002)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_RELOAD_API_BASE_URL` | Reload API base URL | Yes | `https://api.withreload.com/v1` |
| `NEXT_PUBLIC_RELOAD_OAUTH_URL` | OAuth authorization URL | Yes | `https://oauth.withreload.com` |
| `NEXT_PUBLIC_RELOAD_CLIENT_ID` | Your Reload client ID | Yes | `client_1234567890` |
| `NEXT_PUBLIC_RELOAD_REDIRECT_URI` | OAuth redirect URI | Yes | `http://localhost:3002/callback` |
| `RELOAD_CLIENT_SECRET` | Your Reload client secret | Yes | `secret_abcdef123456` |

### Sandbox vs Production

For **Sandbox** testing:
```env
NEXT_PUBLIC_RELOAD_API_BASE_URL=https://sandbox-api.withreload.com/v1
NEXT_PUBLIC_RELOAD_OAUTH_URL=https://sandbox-oauth.withreload.com
```

For **Production**:
```env
NEXT_PUBLIC_RELOAD_API_BASE_URL=https://api.withreload.com/v1
NEXT_PUBLIC_RELOAD_OAUTH_URL=https://oauth.withreload.com
```

## 📚 Usage Guide

### 1. OAuth Authentication

1. **Select Permissions**: Choose which permissions to request (Identity, Usage Reporting, Payment)
2. **Connect Billing Account**: Click "Connect Reload Billing Account" to start OAuth flow
3. **Authorize**: Complete authorization in the Reload portal
4. **Connected**: You'll be redirected back with an access token

### 2. API Testing

Once connected, you can test various API endpoints:

#### User Details
- **Endpoint**: `GET /user`
- **Purpose**: Get authenticated user information
- **Required**: OAuth token with `identity` permission

#### Preview Charge
- **Endpoint**: `POST /preview-charge`
- **Purpose**: Check if user can be charged without charging
- **Required**: OAuth token with `payment` permission
- **Fields**: AI Agent ID, Amount, Description

#### Report Usage
- **Endpoint**: `POST /usage`
- **Purpose**: Report usage and optionally charge user
- **Required**: OAuth token with `usage_reporting` permission
- **Fields**: AI Agent ID, Description, Total Cost, optional charging

#### Usage Reports
- **Endpoint**: `GET /usage-reports`
- **Purpose**: Get usage history with filters
- **Required**: OAuth token with `usage_reporting` permission
- **Filters**: Date range, AI Agent, amount range, etc.

#### Token Management
- **Revoke Token**: `POST /revoke-token` - Revoke OAuth access token
- **Introspect Token**: `POST /introspect-token` - Check token validity

### 3. Form Fields

#### Required Fields
- **AI Agent ID**: Unique identifier for your AI agent
- **Description**: Detailed description of the usage
- **Total Cost**: Cost in USD (can be 0 for free usage)

#### Optional Fields
- **Short Description**: Brief description
- **Usage Type**: Type of usage (API Call, Token Usage, etc.)
- **LLM Model**: AI model used (gpt-4, claude-3, etc.)
- **LLM Provider**: Model provider (OpenAI, Anthropic, etc.)
- **Input/Output Tokens**: Token usage details
- **Internal Tokens/Credits**: Your internal token/credit system
- **Idempotency Key**: Prevent duplicate charges

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── callback/          # OAuth callback page
│   └── page.js            # Main application page
├── components/            # React components
│   ├── forms/            # Form components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configuration
│   ├── constants.js      # Application constants
│   ├── config.js         # Configuration management
│   └── utils.js          # Utility functions
└── styles/               # CSS styles
```

### Key Components

- **`useOAuth`**: Handles OAuth flow and token management
- **`useAPICalls`**: Manages API calls and responses
- **Form Components**: Individual forms for each API endpoint
- **`ResponseViewer`**: Displays API responses with copy functionality

### API Integration

The app uses a proxy pattern where:
1. Frontend makes calls to `/api/ai-agent/*` endpoints
2. Backend API routes handle authentication and proxy to Reload API
3. Client credentials are handled server-side for security

## 🔒 Security

- **Client Credentials**: Stored server-side only
- **OAuth Tokens**: Stored in localStorage (consider using httpOnly cookies for production)
- **PKCE**: Implements PKCE for secure OAuth flow
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Sensitive data in environment variables only

## 🧪 Testing

### Manual Testing
1. Test OAuth flow with different permission combinations
2. Test all API endpoints with valid and invalid data
3. Test error handling and edge cases
4. Test responsive design on different screen sizes

### API Testing Checklist
- [ ] OAuth authentication works
- [ ] User details endpoint returns correct data
- [ ] Preview charge validates user balance
- [ ] Usage reporting creates records correctly
- [ ] Charging deducts from user billing account
- [ ] Usage reports filter correctly
- [ ] Token management works (revoke/introspect)
- [ ] Error handling displays user-friendly messages

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the application: `npm run build`
2. Set environment variables
3. Deploy the `out` directory (static export) or use Node.js hosting

### Environment Variables for Production
```env
NEXT_PUBLIC_RELOAD_API_BASE_URL=https://api.withreload.com/v1
NEXT_PUBLIC_RELOAD_OAUTH_URL=https://oauth.withreload.com
NEXT_PUBLIC_RELOAD_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_RELOAD_REDIRECT_URI=https://yourdomain.com/callback
RELOAD_CLIENT_SECRET=your_production_client_secret
```

## 📖 API Documentation

For complete API documentation, visit:
- [Reload API Documentation](https://docs.withreload.com)
- [OAuth Integration Guide](https://docs.withreload.com/oauth)
- [Usage Reporting Guide](https://docs.withreload.com/usage-reporting)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.withreload.com](https://docs.withreload.com)
- **Support**: [support@withreload.com](mailto:support@withreload.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/reload-test-app/issues)

## 🔄 Changelog

### v1.0.0
- Initial release
- OAuth 2.0 integration
- Complete API testing suite
- Responsive design
- Token management
- Usage reporting and charging

---

**Happy Testing! 🎉**

This test app provides a complete foundation for integrating with the Reload API. Use it as a reference implementation and starting point for your own AI agent monetization platform.