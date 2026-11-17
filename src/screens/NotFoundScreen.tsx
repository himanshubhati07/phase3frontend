import React from 'react';
import { Text, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function NotFoundScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.text}>Screen not found</Text>
      <Pressable
        onPress={() => navigation.goBack()}
        android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
        style={({ pressed }) => [styles.btn, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
      >
        <Text style={styles.btnText}>Go Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const fontFamily = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily,
  },
  btn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  btnText: {
    color: colors.textInverse,
    fontWeight: '600',
    fontFamily,
  },
});
