"use client";

import { useEffect, useState } from "react";
import { Conversation } from "./components/cvi/components/conversation";

export default function Home() {
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createConversation = async () => {
    try {
      setError(null);
      setConversationUrl(null);

      const res = await fetch("/api/create-conversation");
      if (!res.ok) throw new Error(`create-conversation failed: ${res.status}`);
      const data = await res.json();

      if (!data?.conversation_url) throw new Error("No conversation_url returned");
      setConversationUrl(data.conversation_url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    }
  };

  useEffect(() => {
    createConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,.18), transparent 60%), radial-gradient(1000px 600px at 90% 20%, rgba(16,185,129,.14), transparent 55%), #0b1020",
        color: "#e5e7eb",
        padding: 24
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 18
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #6366f1, #22c55e)",
                  boxShadow: "0 10px 30px rgba(0,0,0,.35)"
                }}
              />
              <h1 style={{ margin: 0, fontSize: 26, letterSpacing: -0.3 }}>
                Customer Retention Center
              </h1>
            </div>
            <p style={{ margin: "10px 0 0", color: "#aab4c0", maxWidth: 760 }}>
              Customer Rentention Center powered by Tavus CVI — assess renewal risk and generate a retention playbook in a live video conversation.
            </p>
          </div>

          <button
            onClick={createConversation}
            style={{
              border: "1px solid rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.06)",
              color: "#e5e7eb",
              padding: "10px 12px",
              borderRadius: 12,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            New Session
          </button>
        </div>

        {/* Single main card */}
        <section
          style={{
            border: "1px solid rgba(255,255,255,.10)",
            background: "rgba(255,255,255,.04)",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,.35)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Live Session</div>
              <div style={{ color: "#aab4c0", fontSize: 13 }}>
                Grant camera + mic permissions when prompted.
              </div>
            </div>

            {conversationUrl && (
              <div style={{ color: "#aab4c0", fontSize: 12 }}>
                Status: <span style={{ color: "#86efac" }}>Ready</span>
              </div>
            )}
          </div>

          {error && (
            <div
              style={{
                border: "1px solid rgba(239,68,68,.4)",
                background: "rgba(239,68,68,.08)",
                padding: 12,
                borderRadius: 12,
                marginBottom: 12
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Couldn’t start session</div>
              <div style={{ color: "#fecaca", fontSize: 13 }}>{error}</div>
              <button
                onClick={createConversation}
                style={{
                  marginTop: 10,
                  border: "1px solid rgba(255,255,255,.12)",
                  background: "rgba(255,255,255,.06)",
                  color: "#e5e7eb",
                  padding: "8px 10px",
                  borderRadius: 12,
                  cursor: "pointer"
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!conversationUrl && !error && (
            <div
              style={{
                height: 560,
                display: "grid",
                placeItems: "center",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.10)",
                background: "rgba(0,0,0,.18)"
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Creating conversation…</div>
                <div style={{ color: "#aab4c0", fontSize: 13 }}>
                  This usually takes a few seconds.
                </div>
              </div>
            </div>
          )}

          {conversationUrl && (
            <div
              style={{
                width: "100%",
                height: 560, // ✅ explicit height required
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,.10)",
                background: "rgba(0,0,0,.18)"
              }}
            >
              <Conversation
                conversationUrl={conversationUrl}
                onLeave={() => {
                  setConversationUrl(null);
                  setError(null);
                }}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}