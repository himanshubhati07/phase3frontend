# Angular

Angular conversion of the "Xccelera AI — Enterprise Portal & Platform Studio" HTML page (login portal and platform studio), served at `/`.

## Tech stack
Angular (standalone components) + TypeScript. The page's own copied CSS styles it (no Tailwind).

## Getting started
```
npm install --legacy-peer-deps
npm start
```
Then open http://localhost:58087

## Environment variables
Angular does not read .env files directly — see .env.example, which
documents the value; copy it into src/environments/environment.ts's
apiUrl field. This app has no API calls; the page runs its own scripts.

## Project structure
- src/app/design — the converted page, its section components, styles and script loader (copied unchanged)
- src/app/pages — NotFound page

## Known differences
None known. The page's scripts are served from public/design-scripts; no assets folder was supplied.

## Measured against the uploaded HTML

<!-- design-check:begin -->
- **Content:** all 300 text items, stylesheets, images and scripts of the page are in the project exactly as the page had them (checked by code). <!-- check:fidelity -->
- **Look:** the page at / matches the uploaded HTML 100.0 % (1440 px: 100.0 %; 390 px: 100.0 %) (screenshots compared in a browser). <!-- check:visual -->
Behaviour is not compared automatically: clicks, hover and focus states, form submission, and anything that needs a real backend. A difference there is not ruled out by the lines above.
<!-- design-check:end -->
