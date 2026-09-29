# Adbox Recruitment

A standalone React + TypeScript + Vite application for Adbox campus representatives.
It includes the 14 requested questions, in order, and a required introduction video
of up to 30 seconds. The default mode is a fully interactive local preview.

## Run locally

Requires Node 22.12+ (tested with Node 24).

    npm ci
    npm run dev

Open the URL printed by Vite. Dependencies are already installed in the delivered
Desktop folder. To use the development preview port:

    npm run dev -- --port 5186

## Commands

| Command              | Purpose                                                              |
| -------------------- | -------------------------------------------------------------------- |
| npm run dev          | Local Vite development server                                        |
| npm run build        | Type checking and optimized production build                         |
| npm run preview      | Serve the built dist directory locally                               |
| npm run format       | Format project sources with Prettier                                 |
| npm run format:check | Verify formatting                                                    |
| npm run lint         | ESLint, including React Hooks rules                                  |
| npm run test         | Validation, video constraints, API and form unit tests               |
| npm run test:e2e     | Chrome/Chromium application flow, failure recovery and accessibility |
| npm run check        | Lint, unit tests and production build                                |

Playwright uses installed Google Chrome on macOS. On another machine, run
"npx playwright install chromium". CI installs Chromium automatically.

## Student experience

- Adbox logo, Manrope typography, campaign photograph and responsive layout.
- Five steps: Your details (1–5), Campus life (6–8), The role (9–14), Your video, Review.
- An institution dropdown with 22 canonical names grouped by region.
- Existing roles (question 10) is optional. Every other question is required.
- Both Yes and No are valid for question 13. Honest reporting agreement is required.
- MP4, MOV or WebM, up to 30 seconds and 50 MiB (labelled 50 MB in the interface).
- Choose a file, drag and drop, or open the native camera on supported phones.
- Metadata validation, loading state, playback, removal and replacement.
- Review and edit answers and preview the video before submitting.
- Field errors, keyboard focus, loading state, duplicate-click protection and retries.
- Answers remain in memory between steps; there is a refresh/close warning after
  editing. There is no browser-storage draft or automatic PII logging. Closing or
  reloading the tab loses unsent answers. Video object URLs are revoked.
- Clear preview receipt, distinct from an actual application receipt.

## Project structure

    src/
      app/                    Page composition
      config/                 Environment validation
      data/                   Canonical institution catalogue
      features/application/
        components/           Fields, wizard, video, review
        lib/                  Media validation
        questions.ts          Ordered question copy and step definitions
        schema.ts             Typed application validation
      services/               HTTP client and isolated mock handlers
      shared/components/      Application error boundary
      styles/                 Responsive design and shared tokens
      test/                   Test setup and sample fixtures
    e2e/                      End-to-end browser tests
    public/brand/             Local logo, font and campaign image
    docs/                     API contract and integration notes
    .github/workflows/        CI checks

## Mock endpoints and real integration

Default VITE_API_MODE=mock starts Mock Service Worker before rendering the app.
It intercepts the following requests in the browser:

- GET /api/v1/institutions
- POST /api/v1/applications

Requests use the same fetch client as a future real backend. The mock does not
retain or transmit application answers or video files. It only returns a clearly
labelled preview receipt. The worker is a demo facility, not a server or database.

Copy .env.example to .env.local to change configuration. Set VITE_MOCK_FAILURE=once
to fail the first submission for a retry demonstration, or always to keep failing.
The shipped defaults use none.

To connect an implemented backend:

    VITE_API_MODE=http
    VITE_API_BASE_URL=https://your-api.example.com/api/v1

Restart Vite or rebuild after environment changes. HTTP mode does not start the
mock worker. Never put secrets in VITE variables: those values are public in the
browser bundle. The HTTP client requires a validated mode=live receipt from the
server before showing “Application received”.

Read [the API contract](docs/API.md) for payloads, responses and server work.
Read [the delivery notes](docs/DELIVERY.md) for checks and known limits.

## Campaign content

Applications close **20 December 2026**. Two representatives per campus; a stipend
is included. The amount, working hours and term are left for agreement with
selected reps. The listed contacts and Accra address come from the brief.

The 22 labels come from the existing Adbox recruitment pack, dated 29 September 2026. IDs are provisional frontend slugs: map them to real backend IDs during
integration. GIS and GHMEDIA from earlier artwork are not in that 22-entry list
and have not been silently added.

The logo and Manrope font were copied from the Adbox mobile workspace. Manrope's
SIL Open Font License is included at public/brand/OFL.txt. The existing campaign
photograph was AI-generated for Adbox recruitment materials; it does not depict
actual representatives or imply campus endorsement.

Reference: [Vite's official guide](https://vite.dev/guide/) describes the development,
build and preview workflow used by this project.

Design previews: [desktop](docs/previews/desktop.png) and [mobile](docs/previews/mobile.png).
# adbox-recruitment
