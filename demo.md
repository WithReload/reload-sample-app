# Reload Test App Demo

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_RELOAD_CLIENT_ID=your-client-id-here
   NEXT_PUBLIC_RELOAD_CLIENT_SECRET=your-client-secret-here
   NEXT_PUBLIC_RELOAD_REDIRECT_URI=http://localhost:3000/callback
   NEXT_PUBLIC_RELOAD_OAUTH_URL=http://localhost:3001
   NEXT_PUBLIC_RELOAD_API_BASE_URL=https://api.withreload.com/v1
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

### 🎨 Modern SaaS UI
- Beautiful gradient backgrounds
- Glass morphism effects
- Smooth animations and hover effects
- Responsive design for all screen sizes
- Dark mode support

### 🔐 OAuth 2.0 Integration
- PKCE (Proof Key for Code Exchange) flow
- Permission selection (Identity, Usage Reporting, Payment)
- Secure token exchange
- Automatic wallet selection for payment operations

### 🧪 API Testing Interface
- Interactive API testing for all Reload endpoints
- Real-time response display
- Copy-to-clipboard functionality
- Form validation and error handling

### 🛠️ Developer Experience
- Environment variable configuration
- Comprehensive error messages
- Loading states and feedback
- Clean, maintainable code structure

## API Endpoints Tested

- **Wallet Details** - Get wallet information
- **Transactions** - List wallet transactions with pagination
- **Transaction Details** - Get specific transaction information
- **Preview Charge** - Preview wallet charges before execution
- **Charge Wallet** - Deduct credits from wallet
- **Refund Transaction** - Process transaction refunds
- **Token Introspection** - Validate wallet tokens

## Configuration

The app automatically reads configuration from environment variables:

- `NEXT_PUBLIC_RELOAD_CLIENT_ID` - Your Reload application client ID
- `NEXT_PUBLIC_RELOAD_CLIENT_SECRET` - Your Reload application client secret
- `NEXT_PUBLIC_RELOAD_REDIRECT_URI` - OAuth redirect URI
- `NEXT_PUBLIC_RELOAD_OAUTH_URL` - OAuth flow frontend URL
- `NEXT_PUBLIC_RELOAD_API_BASE_URL` - Reload API base URL

## Troubleshooting

### Environment Variables Not Set
If you see a "Configuration Required" warning, make sure you've set up your `.env.local` file with the required environment variables.

### OAuth Flow Issues
- Ensure the OAuth flow frontend is running on the configured URL
- Check that your client ID and redirect URI are correctly configured in your Reload application
- Verify that the OAuth flow frontend is accessible from your browser

### API Connection Issues
- Check that the Reload API is accessible
- Verify your API credentials are correct
- Ensure your network allows connections to the API endpoints

## Customization

The app uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the `globals.css` file for custom styles
2. Updating the component classes in `page.js`
3. Adding new API endpoints in the `apiEndpoints` object
4. Customizing the permission descriptions and UI text

## Support

For issues or questions:
1. Check the console for error messages
2. Verify your environment configuration
3. Ensure all required services are running
4. Check the network tab for API call details
