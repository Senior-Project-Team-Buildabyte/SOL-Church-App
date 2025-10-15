// Deno / Supabase Edge Function
// Path: supabase/functions/pushNotification/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type ExpoMessage = {
  to: string | string[];             // Expo push token(s), e.g. "ExponentPushToken[xxxx]"
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  badge?: number;
  priority?: "default" | "normal" | "high";
  subtitle?: string;
  channelId?: string;                // Android channel (must exist in app)
  mutableContent?: boolean;          // iOS: allow rich content modification
  ttl?: number;                      // seconds
  expiration?: number;               // UNIX timestamp
};

type ExpoTicket = {
  status: "ok" | "error";
  id?: string;                       // receipt id if ok
  message?: string;
  details?: { error?: string };
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

// Simple CORS helpers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const payload = (await req.json()) as ExpoMessage;

    // Normalize tokens → string[]
    const tokens = Array.isArray(payload.to) ? payload.to : [payload.to];
    const validTokens = tokens.filter(Boolean);

    if (validTokens.length === 0) {
      return new Response(JSON.stringify({ error: "No Expo push tokens provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Build per-token messages
    const base = {
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      sound: payload.sound ?? "default",
      badge: payload.badge,
      priority: payload.priority ?? "high",
      subtitle: payload.subtitle,
      channelId: payload.channelId,
      mutableContent: payload.mutableContent,
      ttl: payload.ttl,
      expiration: payload.expiration,
    };

    const messages = validTokens.map((to) => ({ to, ...base }));

    // Expo accepts up to ~100 messages per request — chunk them
    const chunks: typeof messages[] = [];
    const CHUNK_SIZE = 100;
    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      chunks.push(messages.slice(i, i + CHUNK_SIZE));
    }

    const ticketBatches: ExpoTicket[][] = [];
    for (const batch of chunks) {
      const resp = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optional but recommended:
          // "Accept": "application/json",
        },
        body: JSON.stringify(batch),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        ticketBatches.push([{ status: "error", message: `Expo API ${resp.status}: ${text}` }]);
        continue;
      }

      const json = (await resp.json()) as { data?: ExpoTicket[]; errors?: unknown };
      ticketBatches.push(json.data ?? [{ status: "error", message: "Malformed Expo response" }]);
    }

    return new Response(JSON.stringify({ tickets: ticketBatches.flat() }, null, 2), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
