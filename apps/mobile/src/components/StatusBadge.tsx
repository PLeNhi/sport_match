import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SessionStatus } from '@sport-match/shared';

interface StatusBadgeProps {
  status: SessionStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'open':
        return { background: '#34C759', label: 'Open' };
      case 'full':
        return { background: '#FF9500', label: 'Full' };
      case 'completed':
        return { background: '#5AC8FA', label: 'Completed' };
      case 'cancelled':
        return { background: '#FF3B30', label: 'Cancelled' };
      default:
        return { background: '#999', label: status };
    }
  };

  const { background, label } = getStatusStyle(status);

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
