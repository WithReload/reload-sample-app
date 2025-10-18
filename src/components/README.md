# Components

This directory contains all the React components used in the Reload API Test App.

## Component Structure

### Core Components

### HeroSection
- **File**: `HeroSection.js`
- **Purpose**: Main hero section with app title and description
- **Props**: None
- **Features**:
  - App branding
  - Clear value proposition
  - Call-to-action buttons

### Navigation
- **File**: `Navigation.js`
- **Purpose**: Top navigation bar
- **Props**:
  - `isConnected`: Boolean indicating if user is connected
- **Features**:
  - App logo and title
  - Connection status indicator
  - Responsive design

### PermissionSelector
- **File**: `PermissionSelector.js`
- **Purpose**: OAuth permission selection interface
- **Props**:
  - `selectedPermissions`: Object containing selected permissions
  - `onPermissionChange`: Function to handle permission changes
- **Features**:
  - Checkbox interface for permissions
  - Real-time permission validation
  - Clear permission descriptions

### UserInfo
- **File**: `UserInfo.js`
- **Purpose**: Display connected user information
- **Props**:
  - `authData`: Object containing user authentication data
  - `onDisconnect`: Function to handle disconnection
- **Features**:
  - User details display
  - Organization information
  - Permission status
  - Disconnect functionality

### BillingAccountConnection
- **File**: `BillingAccountConnection.js`
- **Purpose**: Billing account connection interface
- **Props**:
  - `selectedPermissions`: Object containing selected permissions
  - `onPermissionChange`: Function to handle permission changes
  - `onConnect`: Function to handle billing account connection
  - `clientConfig`: Object containing client configuration
- **Features**:
  - Permission selection
  - OAuth flow initiation
  - Configuration validation
  - Error handling

## Form Components

Form components are located in the `forms/` subdirectory and handle specific API endpoint interactions:

- **UserDetailsForm**: Get user information
- **PreviewChargeForm**: Preview charges before execution
- **ReportUsageForm**: Report usage and optionally charge users
- **UsageReportsForm**: Get usage history with filters
- **UsageReportByIdForm**: Get specific usage report by ID
- **RevokeTokenForm**: Revoke OAuth access tokens
- **IntrospectTokenForm**: Check token validity and status

### Usage

```jsx
import { HeroSection, Navigation, UserInfo } from '@/components';
import { UserDetailsForm, ReportUsageForm } from '@/components/forms';
```

## Styling

All components use Tailwind CSS for styling and are designed to be responsive and accessible.

## State Management

Components use React hooks for local state management and custom hooks for shared state and API interactions.

## Constants and Utilities

Components use centralized constants and utilities from `@/lib/constants` and `@/lib/utils` for:
- Consistent UI text and labels
- Form validation
- API endpoint configuration
- OAuth permission handling
- Local storage management