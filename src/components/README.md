# Components

This directory contains reusable React components for the Reload API Testing application.

## Component Structure

### Navigation
- **File**: `Navigation.js`
- **Purpose**: Top navigation bar with app branding and connection status
- **Props**: `isConnected` (boolean)

### HeroSection
- **File**: `HeroSection.js`
- **Purpose**: Main hero section with app title and status information
- **Props**: None

### PermissionSelector
- **File**: `PermissionSelector.js`
- **Purpose**: Interactive permission selection interface
- **Props**: 
  - `selectedPermissions` (object)
  - `onPermissionChange` (function)

### WalletConnection
- **File**: `WalletConnection.js`
- **Purpose**: Complete wallet connection flow with permissions and configuration
- **Props**:
  - `selectedPermissions` (object)
  - `onPermissionChange` (function)
  - `onConnect` (function)
  - `clientConfig` (object)

### UserInfo
- **File**: `UserInfo.js`
- **Purpose**: Display connected user information and permissions
- **Props**:
  - `authData` (object)
  - `onDisconnect` (function)

### APITester
- **File**: `APITester.js`
- **Purpose**: API testing interface with tabs and forms
- **Props**:
  - `activeTab` (string)
  - `setActiveTab` (function)
  - `apiEndpoints` (object)
  - `tabs` (array)
  - `onMakeApiCall` (function)
  - `loading` (boolean)
  - `response` (string)

### ResponseViewer
- **File**: `ResponseViewer.js`
- **Purpose**: Display API responses with copy functionality
- **Props**:
  - `response` (string)
  - `loading` (boolean)

## Usage

```jsx
import { Navigation, HeroSection, WalletConnection } from '@/components';

// Use components in your JSX
<Navigation isConnected={isConnected} />
<HeroSection />
<WalletConnection 
  selectedPermissions={permissions}
  onPermissionChange={handlePermissionChange}
  onConnect={handleConnect}
  clientConfig={config}
/>
```

## Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Reusability**: Components are designed to be reused across the application
3. **Props Interface**: Clear, typed props for easy integration
4. **Styling**: Consistent Tailwind CSS classes throughout
5. **Accessibility**: Proper ARIA labels and keyboard navigation
