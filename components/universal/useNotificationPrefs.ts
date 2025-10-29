import { useEffect, useState, useCallback } from 'react';
import { fetchPrefs, upsertPrefs, registerAndSavePushToken, toggleTopic } from '@/services/notifications.service';
import { useAuth } from '@/components/universal/useAuth';
import { NotificationPreferences } from '@/types/notifications';

export function useNotificationPrefs() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const p = await fetchPrefs(userId);
      setPrefs(p);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = useCallback(async (patch: Parameters<typeof upsertPrefs>[1]) => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      // Optimistic
      setPrefs((prev) => prev ? { ...prev, ...patch } as NotificationPreferences : prev);
      const updated = await upsertPrefs(userId, patch);
      setPrefs(updated);
      // If enabling push, register token
      if (patch.push_opt_in === true) {
        await registerAndSavePushToken(userId);
        // refetch for latest token
        const latest = await fetchPrefs(userId);
        setPrefs(latest);
      }
    } catch (e) {
      setError(e);
      // rollback on error by refetching
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [userId, refresh]);

  const setTopic = useCallback(async (topic: string, enabled: boolean) => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await toggleTopic(userId, topic, enabled);
      setPrefs(updated);
    } catch (e) {
      setError(e);
      await refresh();
    } finally {
      setSaving(false);
    }
  }, [userId, refresh]);

  return { prefs, loading, saving, error, refresh, save, setTopic };
}
