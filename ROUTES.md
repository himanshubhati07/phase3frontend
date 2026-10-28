# html — Routes & Navigation

## How to run
cd /workspace/frontend_runs/d4a2df3d-a046-4e4a-ba19-c3695df63309/project
npm install --legacy-peer-deps && npm run dev
Then open http://localhost:39629

## Routes

| Route | Page file | Description |
|-------|-----------|-------------|
| / | src/design/DesignPage.svelte | XCore onboarding page (exact HTML conversion) |
| * | src/pages/NotFound.svelte | Not found, with Go Home link |

The design is a single-page app: the sign-in/create-org views, the authenticated
team dashboard, and the profile / new team / manage team modals are all views
inside `/`, switched by the page's own script (public/design-scripts/01.js).
Section markup lives in src/design/html/*.html (byte-identical to the design
source) and is mounted by the matching src/design/*Section.svelte component.

## Navigation map
- Any unknown URL -> NotFound
- NotFound -> / (Go Home)

## Shared components
None; section components live in src/design.

## Design tokens
None; styling comes entirely from src/design/styles/01.css.
