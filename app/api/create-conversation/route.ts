import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.TAVUS_API_KEY;
    const replicaId = process.env.TAVUS_REPLICA_ID;
    const personaId = process.env.TAVUS_PERSONA_ID;

    if (!apiKey || !replicaId || !personaId) {
      return NextResponse.json(
        {
          error: "Missing env vars",
          missing: {
            TAVUS_API_KEY: !apiKey,
            TAVUS_REPLICA_ID: !replicaId,
            TAVUS_PERSONA_ID: !personaId
          }
        },
        { status: 500 }
      );
    }

    const res = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        replica_id: replicaId,
        persona_id: personaId,
        conversation_name: "Customer Retention Center - War Room"
      })
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Tavus API error", status: res.status, details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      conversation_url: data.conversation_url,
      conversation_id: data.conversation_id ?? data.id
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server exception", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}