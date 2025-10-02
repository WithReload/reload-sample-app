import { useState } from "react";

export function useAPICalls(walletToken) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const makeApiCall = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    setResponse("");

    try {
      // AI Agent endpoints that are available
      const availableEndpoints = ["/user", "/preview-charge", "/usage"];
      const isAIAgentEndpoint = availableEndpoints.includes(endpoint);

      let url, headers;

      if (isAIAgentEndpoint) {
        // AI Agent endpoints go through backend API with OAuth token only
        url = new URL(`/api/ai-agent${endpoint}`, window.location.origin);
        headers = {
          "Content-Type": "application/json",
          "X-Access-Token": walletToken, // Only send OAuth token, client credentials handled server-side
        };
      } else {
        // Show error for non-implemented endpoints
        setResponse(
          JSON.stringify(
            {
              error: "Endpoint not implemented",
              message: `The endpoint ${endpoint} is not yet available in the backend API.`,
              availableEndpoints: availableEndpoints,
            },
            null,
            2
          )
        );
        return;
      }

      const config = {
        method,
        headers,
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

  return {
    loading,
    response,
    makeApiCall,
  };
}
