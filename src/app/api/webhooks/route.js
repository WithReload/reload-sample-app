import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("=== WEBHOOK RECEIVED ===");

    // Get headers
    const headers = {
      "content-type": request.headers.get("content-type"),
      "x-webhook-signature": request.headers.get("x-webhook-signature"),
      "x-webhook-event": request.headers.get("x-webhook-event"),
      "user-agent": request.headers.get("user-agent"),
    };

    console.log("Headers:", headers);

    // Get raw body
    const body = await request.text();
    console.log("Raw Body:", body);

    // Parse JSON body
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    console.log("Parsed Webhook Data:", JSON.stringify(webhookData, null, 2));

    // Log event details
    console.log("Event Type:", webhookData.event);
    console.log("Timestamp:", webhookData.timestamp);
    console.log("Data:", webhookData.data);

    // Verify signature if provided (optional for testing)
    if (headers["x-webhook-signature"]) {
      console.log("Webhook Signature:", headers["x-webhook-signature"]);
      // Note: In a real implementation, you would verify the signature using your webhook secret
      // const expectedSignature = crypto
      //   .createHmac('sha256', WEBHOOK_SECRET)
      //   .update(body)
      //   .digest('hex');
      // if (headers['x-webhook-signature'] !== expectedSignature) {
      //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      // }
    }

    // Log specific event data
    if (webhookData.event === "user.connected") {
      console.log("=== USER CONNECTED EVENT ===");
      console.log("User:", webhookData.data.user);
      console.log("Organization:", webhookData.data.organization);
      console.log("Environment:", webhookData.data.environment);
    } else if (webhookData.event === "user.disconnected") {
      console.log("=== USER DISCONNECTED EVENT ===");
      console.log("User:", webhookData.data.user);
      console.log("Organization:", webhookData.data.organization);
      console.log("Environment:", webhookData.data.environment);
    } else if (webhookData.event === "payment.success") {
      console.log("=== PAYMENT SUCCESS EVENT ===");
      console.log("Transaction:", webhookData.data.transaction);
      console.log("User:", webhookData.data.user);
      console.log("Organization:", webhookData.data.organization);
      console.log("Environment:", webhookData.data.environment);
    } else if (webhookData.event === "payment.failed") {
      console.log("=== PAYMENT FAILED EVENT ===");
      console.log("Transaction:", webhookData.data.transaction);
      console.log("User:", webhookData.data.user);
      console.log("Organization:", webhookData.data.organization);
      console.log("Failure Reason:", webhookData.data.failureReason);
      console.log("Environment:", webhookData.data.environment);
    }

    console.log("=== WEBHOOK PROCESSING COMPLETE ===");

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Webhook received and processed",
        event: webhookData.event,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    {
      message: "Webhook endpoint is active",
      methods: ["POST"],
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
