![Deploy Status](https://github.com/dyaroman/wla-aqa/actions/workflows/deploy.yml/badge.svg)

# WLA AQA

### 🔗 [View Dashboard](https://dyaroman.github.io/wla-aqa/)

**WLA AQA** is a test results dashboard that visualises end-to-end test runs from [wla-e2e](https://github.com/dyaroman/wla-e2e). Each run is automatically published to GitHub Pages — the dashboard fetches the latest results on load and lets you browse up to 10 historical builds.

## Related Projects

- **[wla-react](https://github.com/dyaroman/wla-react)** – React 19 frontend (the app under test)
- **[wla-e2e](https://github.com/dyaroman/wla-e2e)** – E2E test suite that generates the results consumed here
- **[wla-api-supabase](https://github.com/dyaroman/wla-api-supabase)** – Supabase Edge Function backend

---

## Features

- **Build selector** — browse the latest run or any of the 10 most recent builds
- **Pass / Fail / Skipped** counts with per-test detail
- **Failure details** — error messages and screenshots for each failed test
- **Build metadata** — run number, branch, environment, linked to the GitHub Actions run
- **Conclusion image** — because every test suite deserves a verdict
- **Dark / light theme** — persisted across sessions

---

## Tech Stack

**Vue 3** (Composition API) · **Pinia** · **Vite 8** · **SCSS** · **GitHub Actions** · **GitHub Pages**

---

## Local Setup

```sh
npm install
npm run dev
```

The dev server fetches live data from `https://dyaroman.github.io/wla-e2e/data/` — no local data setup required.

## Deploy

Deployment is fully automated via GitHub Actions. Every push to `main` builds and deploys to GitHub Pages.
