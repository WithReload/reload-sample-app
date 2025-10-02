import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return handleAIAgentRequest(request, params, "GET");
}

export async function POST(request, { params }) {
  return handleAIAgentRequest(request, params, "POST");
}

export async function PUT(request, { params }) {
  return handleAIAgentRequest(request, params, "PUT");
}

export async function DELETE(request, { params }) {
  return handleAIAgentRequest(request, params, "DELETE");
}

async function handleAIAgentRequest(request, params, method) {
  try {
    const { path } = params;
    const endpoint = `/${path.join("/")}`;

    // Get OAuth token from headers
    const oauthToken = request.headers.get("X-Access-Token");
    if (!oauthToken) {
      return NextResponse.json(
        { error: "Missing OAuth token in X-Access-Token header" },
        { status: 401 }
      );
    }

    // Get client credentials from environment variables
    const clientId = process.env.RELOAD_CLIENT_ID;
    const clientSecret = process.env.RELOAD_CLIENT_SECRET;
    const apiBaseUrl = process.env.RELOAD_API_BASE_URL;

    if (!clientId || !clientSecret || !apiBaseUrl) {
      return NextResponse.json(
        {
          error:
            "Server configuration missing: RELOAD_CLIENT_ID, RELOAD_CLIENT_SECRET, or RELOAD_API_BASE_URL not configured",
        },
        { status: 500 }
      );
    }

    // Create Basic auth header for client credentials
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    // Prepare headers for the backend API call
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
      "X-Access-Token": oauthToken,
    };

    // Get request body if it's a POST/PUT request
    let body = null;
    if (method === "POST" || method === "PUT") {
      try {
        body = await request.json();
      } catch (error) {
        // If no body, that's fine
      }
    }

    // Make the request to the backend API
    const response = await fetch(`${apiBaseUrl}/v1/tp/ag${endpoint}`, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "AI Agent API request failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in AI Agent API proxy:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
