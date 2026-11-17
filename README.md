# android new

Shows the "Xccelera AI — Enterprise Portal & Platform Studio" sign-in page (route `/`) inside a full-screen WebView, using the uploaded page's own HTML, CSS and scripts unchanged.

## Tech stack
React Native (Expo) + TypeScript, React Navigation, react-native-webview.

## Getting started
```
npm install --legacy-peer-deps
cp .env.example .env
npx expo start
```
Scan the QR code with Expo Go, or press w for the web preview.

## Environment variables
See .env.example. No variable is read by the app.

## Project structure
- src/design: the page's HTML string and WebView components (not to be reformatted)
- src/screens: PageScreen (renders the page) and NotFoundScreen
- src/navigation: root stack navigator
- src/theme: colors

## Known differences
- The page's own scripts are kept and run inside the web view (tab switching, theme toggle, etc.), as in the uploaded HTML.
- On web preview, DesignPage.web.tsx is used instead of react-native-webview.

## Measured against the uploaded HTML

<!-- design-check:begin -->
- **Content:** all 300 text items, stylesheets, images and scripts of the page are in the project exactly as the page had them (checked by code). <!-- check:fidelity -->
- **Look:** not measured (a android build is not served by the visual check yet). <!-- check:visual -->
Behaviour is not compared automatically: clicks, hover and focus states, form submission, and anything that needs a real backend. A difference there is not ruled out by the lines above.
<!-- design-check:end -->
