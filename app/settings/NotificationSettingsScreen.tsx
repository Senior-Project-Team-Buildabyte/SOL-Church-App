import React, { useMemo } from 'react';
import { View, Text, Switch, ActivityIndicator, Alert } from 'react-native';
import { useNotificationPrefs } from '@/components/universal/useNotificationPrefs';
import DynamicButton from '@/components/universal/dynamic-button';

const TOPIC_OPTIONS = ['events', 'announcements', 'prayer', 'volunteer'] as const;

export default function NotificationSettingsScreen() {
  const { prefs, loading, saving, error, save, setTopic } = useNotificationPrefs();

  const topicSet = useMemo(() => new Set(prefs?.topics ?? []), [prefs]);

  if (loading) return <View style={{ padding: 16 }}><ActivityIndicator /></View>;
  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Could not load notification preferences.</Text>
      </View>
    );
  }
  if (!prefs) return null;

  const toggle = (key: 'email_opt_in' | 'push_opt_in' | 'sms_opt_in') => async (val: boolean) => {
    try {
      await save({ [key]: val });
    } catch (e) {
      Alert.alert('Error', 'Failed to update preference.');
    }
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Notifications</Text>

      <Row label="Email notifications" value={prefs.email_opt_in} onChange={toggle('email_opt_in')} />
      <Row label="Push notifications" value={prefs.push_opt_in} onChange={toggle('push_opt_in')} />
      <Row label="SMS notifications" value={prefs.sms_opt_in} onChange={toggle('sms_opt_in')} />

      <Text style={{ marginTop: 8, fontSize: 16, fontWeight: '600' }}>Topics</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {TOPIC_OPTIONS.map((t) => {
          const enabled = topicSet.has(t);
          return (
            <Chip
              key={t}
              label={t}
              selected={enabled}
              onPress={() => setTopic(t, !enabled)}
            />
          );
        })}
      </View>

      <Text style={{ marginTop: 8, fontSize: 16, fontWeight: '600' }}>Quiet Hours (optional)</Text>
      <Text style={{ opacity: 0.7 }}>
        (Add your time pickers here and save via {{ quiet_start, quiet_end }}.)
      </Text>

      <DynamicButton
        label={saving ? 'Saving...' : 'Save'}
        onPress={() => {}}
        disabled
      />
      <Text style={{ opacity: 0.6, marginTop: 8 }}>
        Device push token: {prefs.push_token ?? '—'}
      </Text>
      <Text style={{ opacity: 0.6 }}>
        Last updated: {new Date(prefs.updated_at).toLocaleString()}
      </Text>
    </View>
  );
}

function Row({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: 16 }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Text
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? '#3b82f6' : '#aaa',
        backgroundColor: selected ? 'rgba(59,130,246,0.15)' : 'transparent',
        overflow: 'hidden',
      }}
    >
      {label}
    </Text>
  );
}
