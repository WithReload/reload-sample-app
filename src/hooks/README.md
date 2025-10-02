# Custom Hooks

This directory contains custom React hooks for the Reload API Testing application.

## Hook Structure

### useOAuth
- **File**: `useOAuth.js`
- **Purpose**: Manages OAuth flow, token exchange, and authentication state
- **Returns**:
  - `isConnected` (boolean): Whether user is authenticated
  - `walletToken` (string): OAuth access token
  - `authData` (object): Complete authentication data
  - `connectWallet` (function): Initiate OAuth flow
  - `disconnect` (function): Clear authentication
  - `exchangeCodeForToken` (function): Exchange auth code for token

### useAPICalls
- **File**: `useAPICalls.js`
- **Purpose**: Manages API calls and response state
- **Parameters**: `walletToken` (string)
- **Returns**:
  - `loading` (boolean): API call in progress
  - `response` (string): API response data
  - `makeApiCall` (function): Execute API call

## Usage

```jsx
import { useOAuth, useAPICalls } from '@/hooks';

function MyComponent() {
  const { isConnected, walletToken, authData, connectWallet, disconnect } = useOAuth();
  const { loading, response, makeApiCall } = useAPICalls(walletToken);

  // Use the hooks in your component logic
  const handleConnect = () => {
    connectWallet(selectedPermissions);
  };

  const handleApiCall = () => {
    makeApiCall('/user');
  };

  return (
    // Your JSX
  );
}
```

## Design Principles

1. **Separation of Concerns**: Each hook handles a specific domain
2. **State Management**: Centralized state management for related functionality
3. **Reusability**: Hooks can be used across multiple components
4. **Error Handling**: Built-in error handling and user feedback
5. **Persistence**: Automatic state persistence using localStorage
6. **Type Safety**: Clear parameter and return types
