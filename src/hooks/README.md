# Custom Hooks

This directory contains custom React hooks used throughout the Reload API Test App.

## Available Hooks

### useOAuth
- **File**: `useOAuth.js`
- **Purpose**: Manages OAuth authentication flow and token state
- **Returns**:
  - `isConnected`: Boolean indicating if user is authenticated
  - `billingAccountToken`: OAuth access token
  - `authData`: Complete authentication data object
  - `connectBillingAccount`: Function to initiate OAuth flow
  - `disconnect`: Function to disconnect and clear auth data
  - `exchangeCodeForToken`: Function to exchange authorization code for token
- **Features**:
  - PKCE implementation for secure OAuth flow
  - Token persistence in localStorage
  - Automatic token validation and refresh
  - Session restoration on page reload

### useAPICalls
- **File**: `useAPICalls.js`
- **Purpose**: Manages API calls and response handling
- **Parameters**:
  - `billingAccountToken`: OAuth access token for authentication
- **Returns**:
  - `loading`: Boolean indicating if API call is in progress
  - `response`: String containing formatted API response
  - `makeApiCall`: Function to make API calls
- **Features**:
  - Automatic request formatting
  - Response formatting with status codes
  - Error handling and display
  - Support for both GET and POST requests
  - Client credentials handled server-side

## Usage Examples

### OAuth Authentication
```jsx
import { useOAuth } from '@/hooks';

function MyComponent() {
  const { isConnected, billingAccountToken, authData, connectBillingAccount, disconnect } = useOAuth();
  
  const handleConnect = () => {
    connectBillingAccount({
      identity: true,
      usage_reporting: true,
      payment: true
    });
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected as: {authData.user.email}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect Billing Account</button>
      )}
    </div>
  );
}
```

### API Calls
```jsx
import { useAPICalls } from '@/hooks';

function MyComponent() {
  const { billingAccountToken } = useOAuth();
  const { loading, response, makeApiCall } = useAPICalls(billingAccountToken);
  
  const handleGetUserDetails = () => {
    makeApiCall({
      endpoint: '/user',
      method: 'GET'
    });
  };

  const handleReportUsage = () => {
    makeApiCall({
      endpoint: '/usage',
      method: 'POST',
      body: {
        aiAgentId: 'agent_123',
        description: 'Test usage',
        totalCost: 10.50,
        chargeUser: true
      }
    });
  };

  return (
    <div>
      <button onClick={handleGetUserDetails} disabled={loading}>
        Get User Details
      </button>
      <button onClick={handleReportUsage} disabled={loading}>
        Report Usage
      </button>
      {response && <pre>{response}</pre>}
    </div>
  );
}
```

## Integration with Constants

Hooks use constants from `@/lib/constants` for:
- API endpoint configuration
- OAuth permission handling
- Storage keys for localStorage
- Default values and validation rules

## Error Handling

Both hooks include comprehensive error handling:
- Network errors are caught and formatted
- API errors are displayed with user-friendly messages
- Validation errors are handled gracefully
- Console logging for debugging

## State Management

Hooks manage their own state internally and provide clean interfaces for components:
- No external state management required
- Automatic cleanup on component unmount
- Persistent state where appropriate (OAuth tokens)
- Optimized re-renders with proper dependency arrays