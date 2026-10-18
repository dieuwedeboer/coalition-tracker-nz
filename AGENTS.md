# Agent Instructions for Coalition Tracker NZ

## Essential Commands
- `npm start` - Development server
- `npm run build` - Production build to `/docs`
- `npx tsc --noEmit` - Type check
- `node .agents/skills/update-coalition-tracker/scripts/validate.mjs` - Validate `src/data/data.csv` (Status values, references, date formats)

## Before Commit
- Build must succeed
- If `src/data/data.csv` changed, the data validator must report no errors
- Use chrome-devtools: verify no console errors, take snapshot to confirm rendering

## Code Style
- Follow patterns in existing source files (`src/components/`, `src/services/`)
- Use Material-UI `sx` prop for component styles
- Use hooks (`useState`, `useEffect`) for state
- Functional components with arrow functions
- TypeScript: prefer `Type[]` over `Array<Type>`, use `boolean` not `bool`

## Accessibility
- Test keyboard navigation on interactive elements
- Use semantic HTML, add ARIA attributes (labels, roles)

## Agent skills

### Issue tracker

GitHub Issues for `dieuwedeboer/coalition-tracker-nz` (via `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary — each role maps to a label of the same name (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Roadmap
For planned features, see README.md
