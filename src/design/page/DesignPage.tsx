import { useState } from 'react';
import { Linking, SafeAreaView, StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { PAGE_HTML } from './pageHtml';

// The uploaded page, shown as it is by the platform's own web view (see html_native.py). Copy this file unchanged.
const BASE_URL = 'https://page.invalid/';
const OUTSIDE = /^(https?:|mailto:|tel:|sms:)/i;
// Reports the page's own background colour, so the strip behind the status bar matches the page.
const REPORT_BACKGROUND = `(function () {
  var color = getComputedStyle(document.body).backgroundColor;
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') color = getComputedStyle(document.documentElement).backgroundColor;
  window.ReactNativeWebView.postMessage(JSON.stringify({ background: color }));
})();
true;`;

export default function DesignPage() {
  const [background, setBackground] = useState('#ffffff');

  function onMessage(event: WebViewMessageEvent) {
    try {
      const { background: color } = JSON.parse(event.nativeEvent.data);
      if (typeof color === 'string' && color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') setBackground(color);
    } catch {
      // not a message of ours
    }
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: background }]} testID="design-page">
      <WebView
        style={[styles.web, { backgroundColor: background }]}
        originWhitelist={['*']}
        source={{ html: PAGE_HTML, baseUrl: BASE_URL }}
        injectedJavaScript={REPORT_BACKGROUND}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="compatibility"
        setSupportMultipleWindows={false}
        allowsInlineMediaPlayback
        onShouldStartLoadWithRequest={(request) => {
          // A link to another site opens outside the app; the page itself, its frames and its own #anchors stay here.
          if (request.isTopFrame === false || request.url === 'about:blank' || request.url.startsWith(BASE_URL)) return true;
          if (OUTSIDE.test(request.url)) {
            Linking.openURL(request.url).catch(() => undefined);
            return false;
          }
          return true;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  web: { flex: 1 },
});
