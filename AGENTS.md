# AGENTS Guidelines for This Repository

This repository contains a Vite-powered React application located in `frontend/`.
When working on the project interactively with an agent, please follow the guidelines below so the development experience stays smooth.

## 1. Use the Development Server, not `npm run build`

* **Always use `npm run dev` inside `frontend/`** while iterating on the application.
  This starts Vite in development mode with hot module replacement (HMR).
* **Do not run `npm run build` during the interactive agent session.**
  Building for production changes the output artifacts and can interfere with the running dev server.
* If you need to verify a production build, do it outside the agent session.

## 2. Keep Dependencies in Sync

If you add or update dependencies remember to:

1. Update the appropriate lockfile (`package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`).
2. Re-start the development server so Vite picks up the dependency changes.

## 3. Coding Conventions

* Prefer TypeScript (`.tsx` / `.ts`) for new components and utilities.
* Keep component-specific styles and related files together when practical.
* Use the existing `frontend/src/` structure for components, hooks, and utilities.

## 4. Useful Commands Recap

| Command                    | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `cd frontend && npm run dev` | Start the Vite dev server with HMR.               |
| `cd frontend && npm run lint` | Run ESLint checks.                                 |
| `cd frontend && npm run build` | Production build – do not run during agent sessions. |
| `cd frontend && npm run preview` | Preview the production build locally.            |

---

Following these practices ensures that agent-assisted development remains fast and dependable. When in doubt, restart the dev server rather than rebuilding the app.
