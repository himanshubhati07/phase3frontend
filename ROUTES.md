# Angular — Routes & Navigation

## How to run
cd /workspace/frontend_runs/31107e99-11dc-415c-9bfb-fcb4d6dcabcb/project
npm install --legacy-peer-deps && npx ng serve --port 58087
Then open http://localhost:58087

## Routes

| Route | Component file | Description |
|-------|----------------|-------------|
| / | src/app/design/design-page.component.ts | Xccelera AI login portal / Platform Studio page |
| ** | src/app/pages/not-found/not-found.component.ts | Not found, with Go Home link |

## Navigation map
- Any unknown URL -> NotFound
- NotFound -> / (Go Home)
- Navigation inside the page is handled by the page's own scripts.

## Shared components
None in src/app/components; section components live in src/app/design.

## Design tokens
No Tailwind tokens; styling comes from src/app/design/styles/*.css.
