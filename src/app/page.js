"use client";

import { clientConfig } from "@/lib/config";
import clsx from "clsx";
import { Check, Copy, Eye, RefreshCw, Send, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletToken, setWalletToken] = useState("");
  const [activeTab, setActiveTab] = useState("wallet");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [authData, setAuthData] = useState(null);

  // OAuth permissions state
  const [selectedPermissions, setSelectedPermissions] = useState({
    identity: true,
    usage_reporting: true,
    payment: true,
  });

  // Form states for different API calls
  const [formData, setFormData] = useState({
    // Wallet connection - read from env
    clientId: clientConfig.reloadClientId || "",
    clientSecret: clientConfig.reloadClientSecret || "",
    redirectUri:
      clientConfig.reloadRedirectUri || "http://localhost:3000/callback",

    // Transaction params
    transactionId: "",
    limit: "10",
    offset: "0",

    // Charge params
    amount: "",
    description: "",
    metadata: "{}",

    // Preview charge
    previewAmount: "",
    previewDescription: "",

    // Refund
    refundTransactionId: "",
    refundAmount: "",
    refundReason: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate PKCE code challenge
  const generateCodeChallenge = async (codeVerifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  };

  // Generate random code verifier
  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  };

  const connectWallet = async () => {
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
    sessionStorage.setItem("reload_code_verifier", codeVerifier);
    sessionStorage.setItem("reload_state", state);

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

  const exchangeCodeForToken = useCallback(async (code) => {
    try {
      const codeVerifier = sessionStorage.getItem("reload_code_verifier");
      const state = sessionStorage.getItem("reload_state");

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
          walletId: tokenData.walletId,
          connectedAt: new Date().toISOString(),
        };

        // Store in localStorage for persistence across sessions
        localStorage.setItem("reload_auth_data", JSON.stringify(authData));

        // Update state
        setWalletToken(tokenData.access_token);
        setIsConnected(true);
        setAuthData(authData);

        // Clear PKCE parameters
        sessionStorage.removeItem("reload_code_verifier");
        sessionStorage.removeItem("reload_state");

        console.log("Successfully connected to Reload:", {
          user: tokenData.user.email,
          organization: tokenData.organization.name,
          permissions: tokenData.permissions,
          environment: tokenData.environment,
        });
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

  // Check for existing auth data in localStorage on component mount
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const storedAuthData = localStorage.getItem("reload_auth_data");
        if (storedAuthData) {
          const authData = JSON.parse(storedAuthData);

          // Check if token is still valid (if it has an expiration)
          if (authData.expires_in && authData.expires_in !== null) {
            const connectedAt = new Date(authData.connectedAt);
            const expiresAt = new Date(
              connectedAt.getTime() + authData.expires_in * 1000
            );

            if (new Date() > expiresAt) {
              // Token expired, clear localStorage
              localStorage.removeItem("reload_auth_data");
              return;
            }
          }

          // Restore auth state
          setWalletToken(authData.access_token);
          setIsConnected(true);
          setAuthData(authData);

          console.log("Restored existing Reload connection:", {
            user: authData.user.email,
            organization: authData.organization.name,
            environment: authData.environment,
          });
        }
      } catch (error) {
        console.error("Error restoring auth data:", error);
        localStorage.removeItem("reload_auth_data");
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

  const makeApiCall = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    setResponse("");

    try {
      const url = new URL("/api/reload", window.location.origin);
      url.searchParams.set("endpoint", endpoint);

      const config = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${walletToken}`,
        },
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(url, config);
      const data = await response.json();

      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const apiEndpoints = {
    wallet: {
      title: "Wallet Details",
      description: "Get wallet information",
      endpoint: "/wallet",
      method: "GET",
      params: [],
      action: () => makeApiCall("/wallet"),
    },
    transactions: {
      title: "Wallet Transactions",
      description: "List wallet transactions",
      endpoint: "/wallet/transactions",
      method: "GET",
      params: [
        { key: "limit", label: "Limit", type: "number", value: formData.limit },
        {
          key: "offset",
          label: "Offset",
          type: "number",
          value: formData.offset,
        },
      ],
      action: () =>
        makeApiCall(
          `/wallet/transactions?limit=${formData.limit}&offset=${formData.offset}`
        ),
    },
    transaction: {
      title: "Get Transaction",
      description: "Get specific transaction details",
      endpoint: "/transactions/{id}",
      method: "GET",
      params: [
        {
          key: "transactionId",
          label: "Transaction ID",
          type: "text",
          value: formData.transactionId,
        },
      ],
      action: () => makeApiCall(`/transactions/${formData.transactionId}`),
    },
    previewCharge: {
      title: "Preview Charge",
      description: "Preview a wallet charge",
      endpoint: "/wallet/charges/preview",
      method: "POST",
      params: [
        {
          key: "previewAmount",
          label: "Amount (credits)",
          type: "number",
          value: formData.previewAmount,
        },
        {
          key: "previewDescription",
          label: "Description",
          type: "text",
          value: formData.previewDescription,
        },
      ],
      action: () =>
        makeApiCall("/wallet/charges/preview", "POST", {
          amount: parseInt(formData.previewAmount),
          description: formData.previewDescription,
        }),
    },
    charge: {
      title: "Charge Wallet",
      description: "Charge credits from wallet",
      endpoint: "/wallet/charges",
      method: "POST",
      params: [
        {
          key: "amount",
          label: "Amount (credits)",
          type: "number",
          value: formData.amount,
        },
        {
          key: "description",
          label: "Description",
          type: "text",
          value: formData.description,
        },
        {
          key: "metadata",
          label: "Metadata (JSON)",
          type: "textarea",
          value: formData.metadata,
        },
      ],
      action: () =>
        makeApiCall("/wallet/charges", "POST", {
          amount: parseInt(formData.amount),
          description: formData.description,
          metadata: JSON.parse(formData.metadata || "{}"),
        }),
    },
    refund: {
      title: "Refund Transaction",
      description: "Refund a transaction",
      endpoint: "/transactions/{id}/refunds",
      method: "POST",
      params: [
        {
          key: "refundTransactionId",
          label: "Transaction ID",
          type: "text",
          value: formData.refundTransactionId,
        },
        {
          key: "refundAmount",
          label: "Refund Amount",
          type: "number",
          value: formData.refundAmount,
        },
        {
          key: "refundReason",
          label: "Reason",
          type: "text",
          value: formData.refundReason,
        },
      ],
      action: () =>
        makeApiCall(
          `/transactions/${formData.refundTransactionId}/refunds`,
          "POST",
          {
            amount: parseInt(formData.refundAmount),
            reason: formData.refundReason,
          }
        ),
    },
    introspect: {
      title: "Introspect Token",
      description: "Validate wallet token",
      endpoint: "/oauth/token/introspect",
      method: "POST",
      params: [],
      action: () =>
        makeApiCall("/oauth/token/introspect", "POST", {
          token: walletToken,
        }),
    },
  };

  const tabs = Object.keys(apiEndpoints);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation Header */}
      <nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-14'>
            <div className='flex items-center space-x-2'>
              <div className='w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center'>
                <Wallet className='w-4 h-4 text-white' />
              </div>
              <span className='text-lg font-medium text-gray-900'>Reload</span>
            </div>
            <div className='flex items-center space-x-4'>
              {isConnected && (
                <div className='flex items-center space-x-2 px-2 py-1 bg-green-50 border border-green-200 rounded-md'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span className='text-xs font-medium text-green-700'>
                    Connected
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4'>
            <Wallet className='w-6 h-6 text-white' />
          </div>
          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
            Reload API Testing
          </h1>
          <p className='text-sm text-gray-600 max-w-2xl mx-auto'>
            Test and integrate with Reload&apos;s wallet and payment APIs
          </p>
        </div>

        {/* Wallet Connection Section */}
        {!isConnected ? (
          <div className='max-w-3xl mx-auto'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
              {/* Header */}
              <div className='bg-blue-600 px-6 py-4 rounded-t-lg'>
                <div className='text-center'>
                  <h2 className='text-lg font-semibold text-white mb-1'>
                    Connect Your Reload Account
                  </h2>
                  <p className='text-blue-100 text-sm'>
                    Authorize access to your Reload account
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className='p-6'>
                <div className='space-y-6'>
                  {/* Permission Selector */}
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='text-center mb-4'>
                      <h3 className='text-base font-semibold text-gray-900 mb-1'>
                        Select Permissions
                      </h3>
                      <p className='text-sm text-gray-600'>
                        Choose what your application can access
                      </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                      {Object.entries(selectedPermissions).map(
                        ([permission, isSelected]) => (
                          <label
                            key={permission}
                            className={`group relative flex flex-col p-4 rounded-md border-2 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "bg-blue-50 border-blue-500 text-blue-900"
                                : "bg-white border-gray-200 hover:border-blue-300 text-gray-700"
                            }`}
                          >
                            <input
                              type='checkbox'
                              checked={isSelected}
                              onChange={() =>
                                handlePermissionChange(permission)
                              }
                              className='sr-only'
                            />
                            <div className='flex items-center justify-between mb-2'>
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center ${
                                  isSelected ? "bg-blue-500" : "bg-gray-200"
                                }`}
                              >
                                {isSelected && (
                                  <Check className='w-3 h-3 text-white' />
                                )}
                              </div>
                              {isSelected && (
                                <span className='text-xs font-medium text-blue-600'>
                                  Selected
                                </span>
                              )}
                            </div>
                            <h4 className='text-sm font-semibold mb-1 capitalize'>
                              {permission.replace("_", " ")}
                            </h4>
                            <p className='text-xs text-gray-600'>
                              {permission === "identity" &&
                                "View your basic profile information"}
                              {permission === "usage_reporting" &&
                                "Report usage data and analytics"}
                              {permission === "payment" &&
                                "Deduct credits from your wallet"}
                            </p>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Connect Button */}
                  <div className='text-center'>
                    <button
                      onClick={connectWallet}
                      disabled={
                        !clientConfig.reloadClientId ||
                        !clientConfig.reloadRedirectUri ||
                        !Object.values(selectedPermissions).some(
                          (permission) => permission
                        )
                      }
                      className='inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                      <Wallet className='w-4 h-4 mr-2' />
                      Connect Reload Account
                    </button>
                    {!Object.values(selectedPermissions).some(
                      (permission) => permission
                    ) && (
                      <p className='text-red-500 text-xs mt-2'>
                        Please select at least one permission to continue
                      </p>
                    )}
                  </div>

                  {(!clientConfig.reloadClientId ||
                    !clientConfig.reloadRedirectUri) && (
                    <div className='mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md'>
                      <div className='flex items-start space-x-3'>
                        <div className='flex-shrink-0'>
                          <span className='text-amber-600 text-lg'>⚠️</span>
                        </div>
                        <div className='flex-1'>
                          <h4 className='text-sm font-semibold text-amber-800 mb-1'>
                            Configuration Required
                          </h4>
                          <p className='text-xs text-amber-700 mb-2'>
                            Please set the following environment variables in
                            your{" "}
                            <code className='bg-amber-100 px-1 py-0.5 rounded text-xs font-mono'>
                              .env.local
                            </code>{" "}
                            file:
                          </p>
                          <div className='space-y-1'>
                            <div className='flex items-center space-x-2'>
                              <div className='w-1.5 h-1.5 bg-amber-500 rounded-full'></div>
                              <code className='text-xs bg-amber-100 px-2 py-1 rounded font-mono'>
                                NEXT_PUBLIC_RELOAD_CLIENT_ID
                              </code>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <div className='w-1.5 h-1.5 bg-amber-500 rounded-full'></div>
                              <code className='text-xs bg-amber-100 px-2 py-1 rounded font-mono'>
                                NEXT_PUBLIC_RELOAD_REDIRECT_URI
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='max-w-6xl mx-auto'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
              {/* Connected Header */}
              <div className='bg-green-600 px-6 py-4 rounded-t-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-white/20 rounded-md flex items-center justify-center'>
                      <Wallet className='w-4 h-4 text-white' />
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold text-white'>
                        Wallet Connected
                      </h2>
                      <p className='text-green-100 text-sm'>
                        Ready to test Reload APIs
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Clear all auth data
                      setIsConnected(false);
                      setWalletToken("");
                      setResponse("");
                      setAuthData(null);
                      localStorage.removeItem("reload_auth_data");

                      console.log("Disconnected from Reload");
                    }}
                    className='px-3 py-2 bg-white/20 text-white text-sm font-medium rounded-md hover:bg-white/30 transition-colors'
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {/* User Info Section */}
              {authData && (
                <div className='bg-blue-50 border-b border-blue-200 px-6 py-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-shrink-0'>
                        <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                          <span className='text-white font-semibold text-sm'>
                            {authData.user.firstName?.charAt(0)}
                            {authData.user.lastName?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className='text-sm font-semibold text-gray-900'>
                          {authData.user.firstName} {authData.user.lastName}
                        </h3>
                        <p className='text-xs text-gray-600'>
                          {authData.user.email}
                        </p>
                        <div className='flex items-center space-x-2 mt-1'>
                          <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                            {authData.organization.name}
                          </span>
                          <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800'>
                            {authData.environment}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xs text-gray-500 mb-1'>
                        Permissions
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {authData.permissions.map((permission) => (
                          <span
                            key={permission}
                            className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800'
                          >
                            {permission.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className='bg-gray-50 px-6 py-3 border-b border-gray-200'>
                <div className='flex space-x-1 overflow-x-auto'>
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={clsx(
                        "px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                        activeTab === tab
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {apiEndpoints[tab].title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className='p-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Parameters Form */}
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                        {apiEndpoints[activeTab].title}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {apiEndpoints[activeTab].description}
                      </p>
                    </div>

                    <div className='bg-gray-50 rounded-md p-4 space-y-4'>
                      {apiEndpoints[activeTab].params.map((param) => (
                        <div key={param.key}>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {param.label}
                          </label>
                          {param.type === "textarea" ? (
                            <textarea
                              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none'
                              rows={3}
                              value={param.value}
                              onChange={(e) =>
                                handleInputChange(param.key, e.target.value)
                              }
                            />
                          ) : (
                            <input
                              type={param.type}
                              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                              value={param.value}
                              onChange={(e) =>
                                handleInputChange(param.key, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}

                      <button
                        onClick={apiEndpoints[activeTab].action}
                        disabled={loading}
                        className='w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        {loading ? (
                          <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                        ) : (
                          <Send className='w-4 h-4 mr-2' />
                        )}
                        {loading ? "Loading..." : "Make API Call"}
                      </button>
                    </div>
                  </div>

                  {/* Response */}
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        API Response
                      </h3>
                      {response && (
                        <button
                          onClick={() => copyToClipboard(response)}
                          className='flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors'
                        >
                          {copied ? (
                            <Check className='w-4 h-4 text-green-600' />
                          ) : (
                            <Copy className='w-4 h-4' />
                          )}
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      )}
                    </div>

                    <div className='bg-gray-900 rounded-md p-4 min-h-[400px] overflow-hidden'>
                      {response ? (
                        <pre className='text-green-400 text-xs leading-relaxed overflow-auto max-h-[400px] font-mono'>
                          {response}
                        </pre>
                      ) : (
                        <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                          <div className='w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center mb-3'>
                            <Eye className='w-6 h-6' />
                          </div>
                          <h4 className='text-sm font-semibold mb-1'>
                            No Response Yet
                          </h4>
                          <p className='text-xs text-center'>
                            Make an API call to see the response here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
