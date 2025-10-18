import { clientConfig } from "@/lib/config";
import { STORAGE_KEYS } from "@/lib/constants";
import { oauth, storage } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export function useOAuth() {
  const [isConnected, setIsConnected] = useState(false);
  const [billingAccountToken, setBillingAccountToken] = useState("");
  const [authData, setAuthData] = useState(null);

  // Use utility functions for PKCE
  const generateCodeChallenge = oauth.generateCodeChallenge;
  const generateCodeVerifier = oauth.generateCodeVerifier;

  const exchangeCodeForToken = useCallback(async (code) => {
    try {
      const { codeVerifier, state } = oauth.getOAuthData();

      if (!codeVerifier) {
        console.error("Code verifier not found in session storage");
        return;
      }

      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          codeVerifier,
          state,
        }),
      });

      const data = await response.json();

      if (data.status === "success" && data.data?.access_token) {
        const tokenData = data.data;

        // Store token and user data in localStorage for persistence
        const authData = {
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          expires_in: tokenData.expires_in,
          scope: tokenData.scope,
          environment: tokenData.environment,
          organization: tokenData.organization,
          user: tokenData.user,
          permissions: tokenData.permissions,
          billingAccountId: tokenData.billingAccountId,
          connectedAt: new Date().toISOString(),
        };

        // Store in localStorage for persistence across sessions
        storage.set(STORAGE_KEYS.AUTH_DATA, authData);

        // Update state
        setBillingAccountToken(tokenData.access_token);
        setIsConnected(true);
        setAuthData(authData);

        // Clear PKCE parameters
        oauth.clearOAuthData();
      } else {
        console.error("Token exchange failed:", data.error || data.message);
        alert(
          `Token exchange failed: ${
            data.error || data.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      alert(`Error exchanging code for token: ${error.message}`);
    }
  }, []);

  const connectBillingAccount = async (selectedPermissions) => {
    const clientId = clientConfig.reloadClientId;
    const redirectUri = clientConfig.reloadRedirectUri;
    const oauthUrl = clientConfig.reloadOauthUrl || "http://localhost:3001";

    // Validate required environment variables
    if (!clientId) {
      console.error("Client ID not found in environment variables");
      alert(
        "Client ID not configured. Please set NEXT_PUBLIC_RELOAD_CLIENT_ID environment variable."
      );
      return;
    }

    if (!redirectUri) {
      console.error("Redirect URI not found in environment variables");
      alert(
        "Redirect URI not configured. Please set NEXT_PUBLIC_RELOAD_REDIRECT_URI environment variable."
      );
      return;
    }

    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = crypto.randomUUID();

    // Build scope from selected permissions
    const scope = Object.keys(selectedPermissions)
      .filter((permission) => selectedPermissions[permission])
      .join(" ");

    // Store PKCE parameters for token exchange
    oauth.saveOAuthData(state, codeVerifier);

    // Build OAuth URL
    const authUrl = new URL(oauthUrl);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");

    // Redirect to OAuth flow
    window.location.href = authUrl.toString();
  };

  const disconnect = () => {
    // Clear all auth data
    setIsConnected(false);
    setBillingAccountToken("");
    setAuthData(null);
    storage.remove(STORAGE_KEYS.AUTH_DATA);
  };

  // Check for existing auth data in localStorage on component mount
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const storedAuthData = storage.get(STORAGE_KEYS.AUTH_DATA);
        if (storedAuthData) {
          const authData = storedAuthData;

          // Check if token is still valid (if it has an expiration)
          if (authData.expires_in && authData.expires_in !== null) {
            const connectedAt = new Date(authData.connectedAt);
            const expiresAt = new Date(
              connectedAt.getTime() + authData.expires_in * 1000
            );

            if (new Date() > expiresAt) {
              // Token expired, clear localStorage
              storage.remove(STORAGE_KEYS.AUTH_DATA);
              return;
            }
          }

          // Restore auth state
          setBillingAccountToken(authData.access_token);
          setIsConnected(true);
          setAuthData(authData);
        }
      } catch (error) {
        console.error("Error restoring auth data:", error);
        storage.remove(STORAGE_KEYS.AUTH_DATA);
      }
    };

    checkExistingAuth();
  }, []);

  // Check for auth code when page loads
  useEffect(() => {
    const code = sessionStorage.getItem("reload_auth_code");
    if (code) {
      sessionStorage.removeItem("reload_auth_code");
      exchangeCodeForToken(code);
    }
  }, [exchangeCodeForToken]);

  return {
    isConnected,
    billingAccountToken,
    authData,
    connectBillingAccount,
    disconnect,
    exchangeCodeForToken,
  };
}
