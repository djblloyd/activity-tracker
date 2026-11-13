# ActivityTracker

A single-page activity logger built with plain HTML, CSS, and JavaScript ES
modules. Record what you worked on — project, task, date, time, hours, and how
much you liked it — and the app keeps your history in the browser and surfaces
your best-rated activity.

## Features

- Log activities with project, task, date, time, hours, and a 1–5 "liked" rating.
- Per-field validation with inline, accessible error messages.
- Activities persist locally in the browser via `localStorage` — no account or
  backend required.
- Highlights your best-rated activity.
- Light/dark theme toggle that follows your system setting until you pick one.
- Graceful handling of storage failures and corrupt stored data.

## Tech stack

- **HTML / CSS / vanilla JavaScript (ES modules)** — no framework, no build step.
- **[Vitest](https://vitest.dev/)** with **[jsdom](https://github.com/jsdom/jsdom)**
  for unit tests, and **[fast-check](https://fast-check.dev/)** for
  property-based testing.

## Project structure

```
activity-tracker/
├── index.html            # App markup and entry point
├── styles.css            # Styles
├── src/
│   ├── app.js            # Entry point: wires state, storage, and UI
│   ├── activity.js       # Activity model / factory
│   ├── validation.js     # Form input validation
│   ├── serialization.js  # Serialize / deserialize the activity list
│   ├── storage.js        # localStorage read/write wrapper
│   ├── theme.js          # Light/dark theme toggle
│   └── ui.js             # Rendering and DOM updates
└── test/                 # Vitest test suite
```

The app is organized in layers: `app.js` holds the authoritative in-memory
state and orchestrates the flow, while `validation`, `activity`,
`serialization`, `storage`, and `ui` each own one concern. All data lives in
the browser's `localStorage` under a versioned key.

## Getting started

Requirements: [Node.js](https://nodejs.org/) (for running the tests) and any
modern web browser.

```bash
# Install dev dependencies (needed for tests only)
npm install
```

Because the app uses native ES modules, open it through a local web server
rather than via the `file://` protocol (browsers block module loading over
`file://`). Any static server works, for example:

```bash
# Python 3
python3 -m http.server 8000

# or, with Node installed
npx serve .
```

Then open <http://localhost:8000> in your browser.

## Running tests

```bash
npm test
```

This runs the Vitest suite once (`vitest --run`).

## Deployment

New to this project? Read this section top to bottom — it assumes no prior
knowledge of the app and walks you from a fresh checkout to a live site.

### What you need to know first

ActivityTracker is a **fully static site**: just `index.html`, `styles.css`, and
the `src/` JavaScript modules. There is **no build step** and **no server-side
code**, so "deploying" means nothing more than copying those files to a web host
that serves static files. If you've looked for a `build` script and not found
one, that's expected — there isn't one.

**No configuration is required.** The app has no environment variables, no
secrets, no API keys, and no backend to connect to. There is nothing to
configure before or after deploying.

### Prerequisites

- A copy of this repository (clone it, or download the files).
- One static host account for your chosen option below (for example, a GitHub
  account for GitHub Pages). Nothing needs to be installed locally just to
  deploy.
- Node.js is **only** needed if you want to run the tests first (see
  [Running tests](#running-tests)); it is not required to deploy.

### Which files get deployed

Deploy these, keeping the folder layout intact:

- `index.html`
- `styles.css`
- `src/` (all modules)

Everything else — `test/`, `node_modules/`, `package.json`, `vitest.config.js`,
and the `.kiro/` folder — is for development only and does **not** need to be
deployed.

### First-time deploy (recommended path: GitHub Pages)

If you've never deployed this app, use GitHub Pages. It's free, needs no tools
installed locally, and serves the repository as-is.

1. **Get the code onto GitHub.** If the project isn't already in a GitHub repo,
   create one and push it:
   ```bash
   git remote add origin https://github.com/<your-username>/activity-tracker.git
   git push -u origin main
   ```
   If it's already on GitHub, skip this step.
2. **Open the Pages settings.** In your repository on github.com, go to
   **Settings → Pages**.
3. **Choose the source.** Under **Build and deployment**, set **Source** to
   **Deploy from a branch**.
4. **Pick the branch and folder.** Select the `main` branch and the `/ (root)`
   folder, then click **Save**.
5. **Wait for publish.** GitHub builds and publishes within a minute or two,
   then shows the live URL: `https://<your-username>.github.io/activity-tracker/`.
6. **Verify it works** (see [Verifying the deployment](#verifying-the-deployment)).

That's the whole process — because there's no build step, GitHub serves the
repository root directly.

### Other hosting options

#### Netlify, Vercel, or similar

1. Connect your Git repository to the host, or drag-and-drop the project folder.
2. Leave the build command **empty** (there is nothing to build).
3. Set the publish/output directory to the project root (`.`).
4. Deploy. The host serves the static files directly.

#### Any static web server

Copy `index.html`, `styles.css`, and `src/` to the server's document root (for
example, an Nginx or Apache web root, or an S3 bucket configured for static
website hosting). No special server configuration is required beyond serving the
files with their correct MIME types, which every standard web server does for
`.html`, `.css`, and `.js`.

### Verifying the deployment

After deploying, confirm the app actually works end to end:

1. Open the deployed URL in a browser.
2. Check that the **ActivityTracker** heading and the "Log an activity" form
   appear, with no errors in the browser's developer console.
3. Add an activity: fill in the form and click **Add activity**. It should
   appear in the **Activities** list and a best-rated entry should show.
4. **Reload the page.** The activity should still be there — that confirms
   `localStorage` persistence is working over the deployed origin.

If the page loads but the form or list never appears and the console shows a
module-loading error, the files are likely being served over `file://` or with
the wrong MIME type. Serve them over HTTP(S) from a real web server (see the
[Getting started](#getting-started) note about local servers).

### Rolling back a deployment

- **GitHub Pages / Git-based hosts (Netlify, Vercel):** revert the bad change in
  Git and push. Pages and most Git-connected hosts redeploy automatically from
  the latest commit:
  ```bash
  git revert <bad-commit-sha>
  git push
  ```
  Netlify and Vercel also keep previous deploys in their dashboard, so you can
  instantly roll back to an earlier one without a Git change.
- **Manual static server:** redeploy the previous copy of `index.html`,
  `styles.css`, and `src/` (keep a backup of the last known-good version before
  overwriting).

### Note on data

All activity data is stored in each visitor's browser (`localStorage`). Data is
per-browser and per-origin; it is not shared between users or devices, and the
deployment itself stores nothing. Redeploying the app does not touch or reset
anyone's stored activities.

## License

Private project.
