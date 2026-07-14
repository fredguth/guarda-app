import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const version = process.env.EXPO_PUBLIC_APP_VERSION ?? '1.3.3';
const env = process.env.EXPO_PUBLIC_ENV ?? 'dev';

export default function VersionBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{version} - {env}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    backgroundColor: '#EDE9FE',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 12,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4C1D95',
  },
});
