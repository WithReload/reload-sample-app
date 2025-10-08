// API Endpoints
export const API_ENDPOINTS = {
  USER_DETAILS: "/user",
  PREVIEW_CHARGE: "/preview-charge",
  REPORT_USAGE: "/usage",
  USAGE_REPORTS: "/usage-reports",
  REVOKE_TOKEN: "/revoke-token",
  INTROSPECT_TOKEN: "/introspect-token",
};

// OAuth Permissions
export const OAUTH_PERMISSIONS = {
  IDENTITY: "identity",
  USAGE_REPORTING: "usage_reporting",
  PAYMENT: "payment",
};

// Default Permission Selection
export const DEFAULT_PERMISSIONS = {
  [OAUTH_PERMISSIONS.IDENTITY]: true,
  [OAUTH_PERMISSIONS.USAGE_REPORTING]: true,
  [OAUTH_PERMISSIONS.PAYMENT]: true,
};

// Tab Configuration
export const TABS = [
  {
    key: "user",
    title: "User Details",
    description: "Get user information and permissions",
  },
  {
    key: "previewCharge",
    title: "Preview Charge",
    description: "Check if user can be charged",
  },
  {
    key: "reportUsage",
    title: "Report Usage",
    description: "Report usage and optionally charge",
  },
  {
    key: "usageReports",
    title: "Usage Reports",
    description: "Get usage history with filters",
  },
  {
    key: "usageReportById",
    title: "Get Report by ID",
    description: "Get specific usage report",
  },
  {
    key: "revokeToken",
    title: "Revoke Token",
    description: "Revoke OAuth access token",
  },
  {
    key: "introspectToken",
    title: "Introspect Token",
    description: "Check token validity and status",
  },
];

// UI Text Constants
export const UI_TEXT = {
  APP_TITLE: "Reload API Test App",
  APP_DESCRIPTION:
    "Test and integrate with Reload APIs for AI agent monetization",
  WALLET_CONNECTED: "Wallet Connected",
  READY_TO_TEST: "Ready to test Reload APIs",
  DISCONNECT: "Disconnect",
  API_RESPONSE: "API Response",
  NO_RESPONSE: "No response yet. Make an API call to see the result.",
  COPY: "Copy",
  LOADING: "Loading...",
  ERROR: "Error",
  SUCCESS: "Success",
  WARNING: "Warning",
  INFO: "Info",
};

// Form Validation
export const VALIDATION = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_NUMBER: "Please enter a valid number",
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min) => `Must be at least ${min}`,
  MAX_VALUE: (max) => `Must be no more than ${max}`,
};

// API Response Status
export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred. Please check your connection.",
  INVALID_RESPONSE: "Invalid response received from server.",
  UNAUTHORIZED: "Unauthorized. Please check your credentials.",
  FORBIDDEN:
    "Access forbidden. You do not have permission to perform this action.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  VALIDATION_ERROR: "Validation error. Please check your input.",
  TIMEOUT: "Request timed out. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  API_CALL_SUCCESS: "API call completed successfully",
  DATA_LOADED: "Data loaded successfully",
  OPERATION_COMPLETED: "Operation completed successfully",
};

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 10,
  CURRENCY: "USD",
  USAGE_TYPE: "API Call",
  LLM_MODEL: "gpt-4",
  LLM_PROVIDER: "OpenAI",
  DESCRIPTION: "Test usage report",
  SHORT_DESCRIPTION: "Test",
  IDEMPOTENCY_KEY_PREFIX: "test-",
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Local Storage Keys
export const STORAGE_KEYS = {
  OAUTH_STATE: "reload_oauth_state",
  CODE_VERIFIER: "reload_code_verifier",
  AUTH_DATA: "reload_auth_data",
  SELECTED_PERMISSIONS: "reload_selected_permissions",
};

// Environment Types
export const ENVIRONMENTS = {
  SANDBOX: "sandbox",
  PRODUCTION: "production",
};

// Token Status
export const TOKEN_STATUS = {
  ACTIVE: "active",
  REVOKED: "revoked",
  DISCONNECTED: "disconnected",
  NOT_FOUND: "not_found",
  EXPIRED: "expired",
};

// Usage Types
export const USAGE_TYPES = [
  "API Call",
  "Token Usage",
  "Processing Time",
  "Data Processing",
  "Model Inference",
  "Feature Usage",
  "Storage Usage",
  "Bandwidth Usage",
];

// LLM Models
export const LLM_MODELS = [
  "gpt-4",
  "gpt-3.5-turbo",
  "claude-3-opus",
  "claude-3-sonnet",
  "claude-3-haiku",
  "gemini-pro",
  "llama-2-70b",
  "llama-2-13b",
  "llama-2-7b",
];

// LLM Providers
export const LLM_PROVIDERS = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "Hugging Face",
  "Cohere",
  "AI21",
  "Replicate",
];
// Form Field Types
export const FIELD_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  NUMBER: "number",
  PASSWORD: "password",
  TEL: "tel",
  URL: "url",
  TEXTAREA: "textarea",
  SELECT: "select",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  DATE: "date",
  DATETIME: "datetime-local",
  TIME: "time",
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// Response Formats
export const RESPONSE_FORMATS = {
  JSON: "json",
  XML: "xml",
  TEXT: "text",
  HTML: "html",
};
