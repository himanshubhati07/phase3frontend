// @ts-nocheck -- the Expo web preview draws the page in a DOM <iframe>; react-native-webview has no web version (see html_native.py).
// Copy this file unchanged.
import { PAGE_HTML } from './pageHtml';

export default function DesignPage() {
  return <iframe title="Design page" data-testid="design-page" srcDoc={PAGE_HTML} style={{ border: 0, display: 'block', width: '100%', height: '100vh' }} />;
}
