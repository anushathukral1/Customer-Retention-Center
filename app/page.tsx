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
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    }
  };

  useEffect(() => {
    createConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Customer Retention Center</h1>

      {error && (
        <div style={{ marginTop: 12 }}>
          <p style={{ color: "red" }}>{error}</p>
          <button onClick={createConversation} style={{ padding: "8px 12px" }}>
            Retry
          </button>
        </div>
      )}

      {!conversationUrl && !error && <p>Creating conversation…</p>}

      {conversationUrl && (
        <div
          style={{
            marginTop: 12,
            width: "100%",
            maxWidth: 900,
            height: 600, // ✅ required
            border: "1px solid #eee",
            borderRadius: 12,
            overflow: "hidden"
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
    </main>
  );
}