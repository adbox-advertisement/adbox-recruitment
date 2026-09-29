# Delivery notes

Created 29 September 2026 for the requested standalone Desktop project.

## Scope

React, TypeScript and Vite frontend with a typed API boundary, browser mock
endpoints, form/video validation, responsive page, review and receipt states.
Adbox mobile application code is unchanged.

## Checks

Completed: formatting and lint passed; 17 unit/component tests passed; TypeScript
and Vite production build passed; all 3 browser scenarios passed, including full
applications at 390px and 1280px. Automated axe scans reported zero violations
on all five steps and the receipt. Layout checks at 320, 390, 768 and 1440px
reported no horizontal overflow. Desktop and mobile screenshots were inspected.

The automated checks cover:

- Required questions, optional existing roles, Yes/No behavior and exact campus names.
- Video type, byte limit, duration and invalid metadata values.
- Multipart payloads, idempotency headers, malformed receipts and failure messages.
- Keyboard focus after validation errors.
- A full browser journey with a real locally generated WebM sample.
- Review edits, retained answers, one simulated failure and successful retry.
- Automated axe accessibility scans and 320/390/768/1440px overflow checks.

Browser coverage is desktop Google Chrome with responsive viewports. Physical
Android/iPhone camera capture, Safari codecs and live network uploads require
device/backend validation. Unsupported video decoding produces an explicit error.

## Deployment

npm run build writes static assets to dist. Deploy that directory with a static
host and a working API. Mock mode is suitable for reviewing the design; it must
not be presented as a live application collection service.

Serve from the domain root (worker and local assets currently use root paths).
Mock Service Worker requires localhost or HTTPS. Vite preview is for local review,
not a production server.

For live use, configure VITE_API_MODE=http and a real API base before building.
Publish the actual privacy notice, connect authoritative campus IDs, confirm
stipend details, and implement the server responsibilities in API.md.

The previously supplied hostname was not reachable during the recruitment
artwork task. This project does not configure DNS or deploy to that domain.
