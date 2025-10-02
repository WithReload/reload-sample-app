import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { code, codeVerifier, state } = await request.json();

    if (!code || !codeVerifier) {
      return NextResponse.json(
        {
          error: "Missing required parameters: code, codeVerifier",
        },
        { status: 400 }
      );
    }

    // Read directly from environment variables
    const clientId = process.env.RELOAD_CLIENT_ID;
    const clientSecret = process.env.RELOAD_CLIENT_SECRET;
    const redirectUri =
      process.env.RELOAD_REDIRECT_URI || "http://localhost:3000/callback";
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

    // Build request body for PKCE
    const bodyParams = {
      grant_type: "authorization_code",
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier, // Required by validation
    };

    const response = await fetch(`${apiBaseUrl}/v1/tp/ai-agent/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyParams),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Token exchange failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
