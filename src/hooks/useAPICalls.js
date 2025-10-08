import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/utils";
import { useState } from "react";

export function useAPICalls(walletToken) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const makeApiCall = async (requestData) => {
    setLoading(true);
    setResponse("");

    try {
      // Handle both old format (endpoint, method, body) and new format (requestData object)
      let endpoint, method, body;
      if (typeof requestData === "string") {
        // Old format - backward compatibility
        endpoint = requestData;
        method = "GET";
        body = null;
      } else {
        // New format
        endpoint = requestData.endpoint;
        method = requestData.method || "GET";
        body = requestData.body || null;
      }

      // AI Agent endpoints that are available
      const availableEndpoints = Object.values(API_ENDPOINTS);
      const isAIAgentEndpoint =
        availableEndpoints.includes(endpoint) ||
        endpoint.startsWith("/usage-reports");

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

      // Format response using utility function
      const formattedResponse = api.formatResponse(response, data);
      setResponse(JSON.stringify(formattedResponse, null, 2));
    } catch (error) {
      const errorResponse = api.formatError(error);
      setResponse(JSON.stringify(errorResponse, null, 2));
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
