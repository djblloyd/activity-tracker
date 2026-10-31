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

ActivityTracker is a fully static site — just `index.html`, `styles.css`, and
the `src/` modules. There is no build step and no server-side code, so you can
host it on any static file host. The `test/` directory, `node_modules/`, and
project config are only needed for development and don't need to be deployed.

### Files to deploy

- `index.html`
- `styles.css`
- `src/` (all modules)

### Option 1 — GitHub Pages

1. Push the project to a GitHub repository (the `main` branch).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder, then **Save**.
5. GitHub publishes the site at `https://<username>.github.io/<repository>/`.

Because the app has no build step, the repository root is served as-is.

### Option 2 — Netlify, Vercel, or similar

1. Connect your Git repository to the host, or drag-and-drop the project folder.
2. Leave the build command empty (there is nothing to build).
3. Set the publish/output directory to the project root (`.`).
4. Deploy. The host serves the static files directly.

### Option 3 — Any static web server

Copy `index.html`, `styles.css`, and `src/` to the server's document root
(for example, an Nginx or Apache web root, or an S3 bucket configured for
static website hosting). No special server configuration is required beyond
serving the files with their correct MIME types, which every standard web
server does for `.html`, `.css`, and `.js`.

### Note on data

All activity data is stored in each visitor's browser (`localStorage`). Data is
per-browser and per-origin; it is not shared between users or devices, and the
deployment itself stores nothing.

## License

Private project.
