// Deno / Supabase Edge Function
// Path: supabase/functions/save_push_token/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

// --- CORS ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// Accepts Expo push tokens (ExponentPushToken[...]) OR raw FCM tokens (stringy, 100–200 chars).
// If you ONLY want Expo, keep the strict regex.
const EXPO_TOKEN_REGEX = /^ExponentPushToken\[[A-Za-z0-9\-\+\/=_]+\]$/;
const MIN_FCM_LEN = 80; // heuristic
const MAX_FCM_LEN = 4096; // safety upper bound

type Platform = "ios" | "android" | "web";
type SavePayload = {
  token: string;        // Expo push token or raw FCM token
  platform: Platform;   // "ios" | "android" | "web"
  deviceId: string;     // your stable device/install identifier
  appVersion?: string;  // optional metadata
  locale?: string;      // optional metadata
};

function isValidPlatform(p: string): p is Platform {
  return ["ios", "android", "web"].includes(p);
}

function looksLikeExpoToken(token: string): boolean {
  return EXPO_TOKEN_REGEX.test(token);
}

function looksLikeFcmToken(token: string): boolean {
  // Permissive check; FCM tokens vary. Keep it simple.
  return typeof token === "string" && token.length >= MIN_FCM_LEN && token.length <= MAX_FCM_LEN;
}

async function getOptionalUserIdFromAuthHeader(req: Request): Promise<string | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  // Use anon key to *read* auth info from the forwarded Authorization header
  const authAwareClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: { Authorization: req.headers.get("Authorization") ?? "" }
    }
  });

  try {
    const { data, error } = await authAwareClient.auth.getUser();
    if (error || !data?.user) return null;
    return data.user.id ?? null;
  } catch {
    return null;
  }
}

function adminClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  // Service-role bypasses RLS inside edge func (safe to use server-side only)
  return createClient(supabaseUrl, serviceKey);
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  try {
    const body = (await req.json()) as SavePayload;
    const { token, platform, deviceId, appVersion, locale } = body ?? {};

    if (!token || !platform || !deviceId) {
      return new Response(JSON.stringify({ error: "token, platform, and deviceId are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (!isValidPlatform(platform)) {
      return new Response(JSON.stringify({ error: "Invalid platform" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Token validation: allow Expo or FCM
    const isExpo = looksLikeExpoToken(token);
    const isFcm = looksLikeFcmToken(token);
    if (!isExpo && !isFcm) {
      return new Response(JSON.stringify({ error: "Invalid token format (expected Expo or FCM token)" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Try to resolve the user from Authorization header; null if guest
    const userId = await getOptionalUserIdFromAuthHeader(req);

    // Admin client for DB write
    const sbAdmin = adminClient();

    // Choose your conflict target:
    // - If you enforce unique(expo_push_token) then use "expo_push_token"
    // - If you enforce unique(device_id) then use "device_id"
    //
    // Recommended schema:
    //   create table user_devices (
    //     id uuid primary key default gen_random_uuid(),
    //     user_id uuid references auth.users(id),
    //     device_id text not null,                 -- stable install id
    //     expo_push_token text,                    -- for Expo push
    //     fcm_token text,                          -- if you store raw FCM too
    //     platform text not null,
    //     app_version text,
    //     locale text,
    //     last_seen_at timestamptz default now(),
    //     created_at timestamptz default now(),
    //     updated_at timestamptz default now()
    //   );
    //   create unique index uq_user_devices_device on user_devices(device_id);
    //   create unique index uq_user_devices_expo on user_devices(expo_push_token) where expo_push_token is not null;
    //   create unique index uq_user_devices_fcm  on user_devices(fcm_token)      where fcm_token is not null;

    // Map token field
    const upsertPatch: Record<string, unknown> = {
      user_id: userId, // may be null (guest)
      device_id: deviceId,
      platform,
      last_seen_at: new Date().toISOString()
    };

      upsertPatch["expo_push_token"] = token;
      // If you want to clear fcm_token when Expo present, uncomment:
      // upsertPatch["fcm_token"] = null;
    

    // Prefer upsert by device_id (stable per install). If you prefer token uniqueness,
    // switch onConflict target accordingly.
    const { data, error } = await sbAdmin
      .from("user_devices")
      .upsert(upsertPatch, { onConflict: "device_id" })
      .select("*")
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      id: data.id,
      user_id: data.user_id,           // null for guests
      device_id: data.device_id,
      expo_push_token: data.expo_push_token ?? null,
      platform: data.platform,
      last_seen_at: data.last_seen_at
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
