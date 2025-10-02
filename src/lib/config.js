// Server-side configuration (not exposed to client)
export const serverConfig = {
  reloadApiBaseUrl: process.env.RELOAD_API_BASE_URL,
  reloadOauthUrl: process.env.RELOAD_OAUTH_URL,
  reloadClientId: process.env.RELOAD_CLIENT_ID,
  reloadClientSecret: process.env.RELOAD_CLIENT_SECRET,
  reloadRedirectUri:
    process.env.RELOAD_REDIRECT_URI || "http://localhost:3002/callback",
};

// Client-side configuration (exposed to browser)
export const clientConfig = {
  reloadApiBaseUrl: process.env.NEXT_PUBLIC_RELOAD_API_BASE_URL,
  reloadOauthUrl: process.env.NEXT_PUBLIC_RELOAD_OAUTH_URL,
  reloadClientId: process.env.NEXT_PUBLIC_RELOAD_CLIENT_ID,
  reloadClientSecret: process.env.NEXT_PUBLIC_RELOAD_CLIENT_SECRET,
  reloadRedirectUri: process.env.NEXT_PUBLIC_RELOAD_REDIRECT_URI,
};

// Validation function for server config
export const validateServerConfig = () => {
  const required = ["reloadClientId", "reloadClientSecret"];
  const missing = required.filter((key) => !serverConfig[key]);

  if (missing.length > 0) {
    console.warn(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    return false;
  }

  return true;
};

// Get configuration for different environments
export const getConfig = (environment = "production") => {
  const baseConfig = {
    ...serverConfig,
    ...clientConfig,
  };

  if (environment === "sandbox") {
    return {
      ...baseConfig,
      reloadApiBaseUrl: "https://sandbox-api.withreload.com/v1",
      reloadOauthUrl: "https://sandbox-oauth.withreload.com",
    };
  }

  return baseConfig;
};
