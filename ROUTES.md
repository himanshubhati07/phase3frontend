# android new — Screens & Navigation

## How to run
cd /workspace/frontend_runs/23752017-1802-4837-942c-0e9a26978eeb/project
npm install --legacy-peer-deps && npx expo start
# Press 'a' for Android, 'i' for iOS simulator, 'w' for web,
# or scan the QR code with Expo Go.

## Screens
| Screen | File | Description |
|--------|------|-------------|
| Page (/) | src/screens/PageScreen.tsx | Full-screen WebView of the Xccelera AI sign-in page (src/design/page) |
| NotFound | src/screens/NotFoundScreen.tsx | Catch-all "Screen not found" with Go Back |

## Navigation map
- Page is the initial screen (headerShown: false). All interaction happens inside the web view.

## Shared components
None (src/components not used; the page is the HTML itself).

## Design tokens
primary, primaryDark, primaryLight, accent, background, surface, card, border, textPrimary, textSecondary, textDisabled, textInverse, success, warning, error, info, shadowColor
