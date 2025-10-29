import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase'; // adjust import
import { NotificationPreferences } from '@/types/notifications';

const TABLE = 'notification_preferences';

async function getPrefs(userId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // no rows
  return (data ?? null) as NotificationPreferences | null;
}

async function ensurePrefsRow(userId: string) {
  const existing = await getPrefs(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      email_opt_in: false,
      push_opt_in: false,
      sms_opt_in: false,
      topics: [],
      push_token: null,
      quiet_start: null,
      quiet_end: null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as NotificationPreferences;
}

export async function upsertPrefs(
  userId: string,
  patch: Partial<Omit<NotificationPreferences, 'user_id' | 'updated_at'>>
) {
  // ensure row exists first
  await ensurePrefsRow(userId);

  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...patch })
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as NotificationPreferences;
}

export async function fetchPrefs(userId: string) {
  const prefs = await ensurePrefsRow(userId);
  return prefs;
}

/** Ask for permissions and register Expo push token, then save it in Supabase if push_opt_in is true. */
export async function registerAndSavePushToken(userId: string) {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device.');
    return null;
  }

  // Request permissions
  const settings = await Notifications.getPermissionsAsync();
  let finalStatus = settings.status;
  if (finalStatus !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    finalStatus = req.status;
  }
  if (finalStatus !== 'granted') {
    console.warn('Push notification permission not granted.');
    // Still store that user turned push_opt_in=false if needed
    return null;
  }

  // Get Expo push token
  const projectId =
    Notifications?.getExpoPushTokenAsync?.length
      ? undefined
      : undefined; // leave undefined unless you use EAS projectId explicitly

  const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
  const token = tokenResponse.data;

  // Save token
  await upsertPrefs(userId, { push_token: token });
  return token;
}

/** Helper to toggle a topic */
export async function toggleTopic(userId: string, topic: string, enabled: boolean) {
  const current = await fetchPrefs(userId);
  const topics = new Set<string>(current?.topics ?? []);
  if (enabled) topics.add(topic);
  else topics.delete(topic);
  return upsertPrefs(userId, { topics: Array.from(topics) });
}
