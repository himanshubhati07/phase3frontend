import { Platform } from 'react-native';

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const forced = new URLSearchParams(window.location.search).get('forcePlatform');
  if (forced === 'ios' || forced === 'android') {
    const originalSelect = Platform.select ? Platform.select.bind(Platform) : null;
    Platform.select = (specifics) => {
      if (forced in specifics) return specifics[forced];
      if ('default' in specifics) return specifics.default;
      return originalSelect ? originalSelect(specifics) : undefined;
    };
  }
}
