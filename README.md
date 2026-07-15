# CALL99 Backoffice Dashboard

A React and TypeScript backoffice dashboard for administering CALL99 users, providers, advertisements, coupons, subscription plans, and related platform operations.

## Table of Contents

- [Project Overview](#project-overview)
- [Current Features](#current-features)
- [Features Not Currently Connected](#features-not-currently-connected)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Backend Endpoints](#backend-endpoints)
- [Pagination, Search, and Filters](#pagination-search-and-filters)
- [File Uploads](#file-uploads)
- [Error Handling](#error-handling)
- [Roles and Authorization](#roles-and-authorization)
- [Development Guidelines](#development-guidelines)
- [Code Quality Checklist](#code-quality-checklist)
- [Production Build](#production-build)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [Known Limitations](#known-limitations)
- [Security Notes](#security-notes)
- [Verification Status](#verification-status)
- [Contributing](#contributing)
- [Internationalization](#internationalization)
- [License](#license)

## Project Overview

CALL99 Backoffice Dashboard is an Arabic, right-to-left administrative single-page application. It is intended for authorized backoffice roles that manage accounts, provider information, advertisements, coupons, and subscription plans.

The application connects to a backend API through a central Axios client. Modules with implemented service functions use live API data through TanStack Query. Other screens currently provide the intended interface and local interactions but depend on backend endpoints and compatible DTOs before they can persist real data.

## Current Features

The features below have API calls implemented and are used by the current pages.

### Authentication

- Phone-and-password login.
- Saudi phone-number formatting and client-side validation.
- Backoffice role validation after login.
- Session restoration from `localStorage`.
- Bearer access-token attachment through an Axios request interceptor.
- Single-flight access-token refresh for eligible `401` responses.
- Local session cleanup when refresh fails.
- Server logout with the current session ID.
- Forgot-password OTP request, resend, and password reset flow.
- Protected dashboard routes.
- Authenticated change-password request from the admin account screen. Backend availability for this recently added endpoint must be verified against the deployed API.

### Users Management

- Server-backed users list and counters.
- Search, role, status, and creation-date filters.
- Server-side pagination.
- Admin user detail retrieval.
- Backoffice user creation for admin, ground-team, and customer-service roles.
- Block and unblock actions.
- Delete action through the admin users API.
- Redirect from a user detail response to the provider profile when the response identifies a provider profile.

The order, financial, and activity sections displayed inside a user profile are not backed by the current user-detail response and therefore remain empty placeholders.

### Provider Profiles

- Provider profile retrieval by provider ID.
- Provider identity and business information.
- Provider documents returned by the API.
- Provider services returned by the API.
- Subscription-plan information when present in the response.
- Wallet balance when present in the response.

The provider requests list and provider actions are not connected; see [Features Not Currently Connected](#features-not-currently-connected).

### Advertisements

- Advertisements list with server-side pagination and search/status filters.
- Advertisement statistics.
- Advertisement detail retrieval.
- Advertisement creation.
- Advertisement updates and active-status changes.
- Active coupon lookup for advertisement forms.
- Multipart banner-image upload.

### Coupons

- Coupons list with server-side pagination.
- Search, status, and discount-type filters.
- Coupon statistics.
- Coupon detail retrieval.
- Coupon updates.

Coupon creation and deletion are intentionally not connected by the current UI.

### Subscription Plans

- Subscription-plan list and detail retrieval.
- Plan creation and updates.
- Plan status toggle.
- Set-default-plan action.
- Cache invalidation after mutations.

The current backend contract limits a plan to one service and requires a duration expressed in months; the page maps its form values to that contract.

## Features Not Currently Connected

The following screens or controls use local data, temporary component state, empty placeholders, or explicit unsupported-action messages. They should not be treated as persistent backend features yet.

| Area | Current state |
|---|---|
| Dashboard | Statistics, charts, latest orders, and recent activity come from local data files. |
| Provider requests | The list, filters, review, approval, and rejection interactions use local data. |
| Provider actions | Blocking and deleting a provider are disabled because the provider profile response does not expose the required user account ID. |
| Provider operational data | Orders, order statistics, reviews, gallery data, service prices, and most financial totals are empty or placeholder values. |
| User operational data | Orders, charts, expenses, and commissions on the user profile are empty placeholders. |
| Orders | Listing, filters, detail data, and cancellation are local UI interactions. |
| Wallet and withdrawals | Transactions, refunds, receipts, withdrawal lists, transfer completion, and rejection use local data/state. |
| Complaints | Create, edit, filters, and list changes are local only. |
| Tickets | Create, edit, filters, and list changes are local only. |
| App notifications | The sidebar Notifications page manages local records; it is intended for notifications sent to app users. |
| Admin notifications | Header notifications are separate admin-account UI data and are not fetched from the backend. |
| Activity | Timeline data and filtering are local. |
| Platform settings | Commission and withdrawal settings are local because backend setting keys are not documented in the project. |
| Coupon creation | The form does not currently supply the backend-required total usage limit in a connected create flow. |
| Coupon deletion | No coupon delete endpoint is implemented in the current service layer. |
| Admin account details | Name, phone, and profile image changes are stored locally; profile images are not uploaded to the backend. |
| Admin password | The client calls `/auth/change-password`, but compatibility with the deployed backend contract has not been confirmed. |

Backend integration for these areas requires documented endpoints, request DTOs, response DTOs, permissions, and error contracts.

## Tech Stack

Versions are taken from `package.json`.

| Technology | Version | Purpose |
|---|---:|---|
| React | 19.2.7 | User interface and component model |
| React DOM | 19.2.7 | Browser rendering |
| TypeScript | ^7.0.2 | Strict static typing |
| Vite | 8.1.4 | Development server and production build |
| React Router | 7.18.1 | Client-side routing and protected route composition |
| Zustand | 5.0.14 | Authentication and local session state |
| TanStack Query | 5.101.2 | Server-state fetching, caching, mutations, and invalidation |
| Axios | 1.18.1 | HTTP client and authentication interceptors |
| Tailwind CSS | 4.3.2 | Utility-first styling |
| Recharts | 3.9.2 | Dashboard and reporting charts |
| Lucide React | 1.24.0 | Icons |
| React Hot Toast | 2.6.0 | User-facing success and error notifications |
| PostCSS | 8.5.16 | CSS processing |

No component framework or date library is installed; the project uses custom components and browser/ECMAScript date APIs.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`. These ranges come from the installed Vite 8 and React plugin package metadata.
- npm and the committed `package-lock.json` (`lockfileVersion: 3`).
- Access to a compatible CALL99 backend API.
- Valid credentials for a permitted backoffice role for authenticated runtime testing.

The repository does not declare an npm version through an `engines` or `packageManager` field.

## Installation

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

For a clean, lockfile-based installation in CI or a fresh checkout, use:

```bash
npm ci
```

## Environment Variables

Copy the provided example before starting Vite:

```bash
cp .env.example .env
```

PowerShell equivalent:

```powershell
Copy-Item .env.example .env
```

Configure only the variables present in `.env.example`:

```env
VITE_API_BASE_URL=https://backend.example.com/api
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Backend API base URL. The application stops during startup if it is missing. Do not include a trailing slash. |

The TypeScript environment declaration also contains `VITE_API_URL`, but the application does not read that variable. Use `VITE_API_BASE_URL`.

Do not commit `.env` files. Vite exposes `VITE_` variables to browser code, so they must never contain passwords, private keys, tokens, or other secrets.

## Running the Project

Start the development server:

```bash
npm run dev
```

Validate TypeScript:

```bash
npm run typecheck
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

Linting and automated tests are not currently configured.

## Available Scripts

| Command | Underlying command | Description |
|---|---|---|
| `npm run dev` | `vite` | Starts the Vite development server. |
| `npm run typecheck` | `tsc --noEmit` | Runs strict TypeScript validation without emitting files. |
| `npm run build` | `vite build` | Creates the production bundle in `dist/`. |
| `npm run preview` | `vite preview` | Serves the generated production bundle locally for inspection. |

## Project Structure

```text
public/
├── documents/          Static document placeholders
└── images/             Branding and authentication images
src/
├── components/         Reusable UI and business-module components
├── constants/          Shared visual and status constants
├── data/               Local UI data used by unconnected screens
├── hooks/              Shared React hooks, including search debounce
├── layouts/            Authentication layout
├── pages/              Route-level screens
├── routes/             Route definitions and access protection
├── services/           Axios client and backend service modules
├── store/              Zustand authentication/session store
├── styles/             Global Tailwind and application styles
├── types/              API, domain, and UI TypeScript contracts
├── utils/              Error, date, download, and table helpers
├── App.tsx             Application route entry
└── main.tsx            React, QueryClient, and toast bootstrap
```

Business-specific dialogs and tables are grouped under `src/components/`. Route components coordinate UI state, Query hooks, DTO mapping, and mutations; backend calls remain in `src/services/`.

## Architecture

### Client State

Zustand stores the current authentication token and user. The store restores the access token and serialized user from `localStorage`, persists new sessions, supports local admin profile changes, and clears all session-related storage during logout.

Local-only screens use component state and records from `src/data/`. That data is not a fallback for connected API pages.

### Server State

TanStack Query is used by connected users, provider profile, advertisements, coupons, and subscription-plan screens for:

- Data fetching and request lifecycle state.
- Cached query data.
- Loading and error rendering.
- Keeping previous paginated data visible during page changes where configured.
- Mutation state.
- Query invalidation after successful writes.
- Passing `AbortSignal` to service calls for cancellation.

Global query defaults are:

- One retry for network errors or responses with status `500` and above.
- A 30-second stale time.
- No automatic refetch when the browser window regains focus.
- No automatic mutation retry.

### API Layer

`src/services/axios.ts` owns the shared Axios instance:

- Reads and normalizes `VITE_API_BASE_URL`.
- Uses a 20-second timeout.
- Adds `Authorization: Bearer <accessToken>` when a token exists.
- Refreshes the session after eligible `401` responses.
- Uses one shared refresh promise when several requests fail at the same time.
- Retries the original request once with the refreshed access token.
- Excludes authentication requests from interceptor-driven refresh retries.
- Clears the local session if refresh fails.

Service modules define query parameters and typed response envelopes. Error messages are normalized by `src/utils/error.ts`. Multipart requests pass `FormData` directly so the browser/Axios can set the correct boundary.

## Authentication Flow

1. The user submits a Saudi phone number and password on `/login`.
2. The backend returns access, refresh, and session tokens plus the user record.
3. The page rejects users who do not have a backoffice role and attempts to terminate their server session.
4. Accepted session values and the user object are stored in `localStorage` and Zustand.
5. `ProtectedRoute` permits dashboard access only when a token and permitted backoffice user exist.
6. The Axios request interceptor adds the current access token to API requests.
7. An eligible expired-token `401` starts a single refresh request to `/auth/refresh`; concurrent failures reuse that request.
8. A successful refresh replaces the stored session and retries the original request once.
9. A failed refresh clears local authentication state. A `403` response is returned to the caller and does not automatically log the user out.
10. Logout sends the session ID to the backend and clears local/session storage even if the request fails.

The forgot-password flow stores temporary phone, OTP-flow, timer, and optional development OTP values in `sessionStorage`, then submits the OTP and new password to the reset endpoint.

Access and refresh tokens are currently stored in `localStorage`. Review this choice against the production threat model and backend cookie/token strategy before deployment.

## API Integration

The base URL comes from `VITE_API_BASE_URL`. Endpoint paths in service modules are relative to that value.

Implemented service modules:

```text
src/services/
├── adminUsers.service.ts
├── advertisements.service.ts
├── auth.service.ts
├── axios.ts
├── coupons.service.ts
├── providers.service.ts
└── subscriptionPlans.service.ts
```

Connected pages map backend DTOs into existing view-model shapes rather than exposing API records directly to presentation components. Lists pass `page`, `limit`, and supported filters as query parameters. Search values are debounced before they enter query keys. Mutations invalidate the related list, detail, and statistics keys.

API errors are rendered through empty/error states or toast notifications using backend messages when readable and safe fallback messages otherwise.

## Backend Endpoints

The paths below are relative to `VITE_API_BASE_URL` and are called by the current source code.

| Module | Method | Endpoint | Usage |
|---|---|---|---|
| Authentication | POST | `/auth/login` | Create a session. |
| Authentication | POST | `/auth/phone-verification/request-otp` | Request/resend a phone verification OTP. |
| Authentication | POST | `/auth/forgot-password` | Request a password-reset OTP. |
| Authentication | POST | `/auth/reset-password` | Reset a password with phone and OTP. |
| Authentication | POST | `/auth/change-password` | Change the authenticated admin password; deployed backend support requires confirmation. |
| Authentication | POST | `/auth/refresh` | Refresh the access token and session. |
| Authentication | POST | `/auth/logout` | End the current session. |
| Users | GET | `/admin/users` | Paginated and filtered user list. |
| Users | GET | `/admin/users/counters` | User and role counters. |
| Users | GET | `/admin/users/:id` | User detail. |
| Users | POST | `/admin/users` | Create a backoffice user. |
| Users | PATCH | `/admin/users/:id/block` | Block a user. |
| Users | PATCH | `/admin/users/:id/unblock` | Unblock a user. |
| Users | DELETE | `/admin/users/:id` | Delete a user. |
| Providers | GET | `/admin/providers/:id/profile` | Retrieve provider profile, documents, subscription, and wallet data. |
| Advertisements | GET | `/admin/advertisements` | Paginated and filtered list. |
| Advertisements | GET | `/admin/advertisements/stats` | Advertisement statistics. |
| Advertisements | GET | `/admin/advertisements/:id` | Advertisement detail. |
| Advertisements | POST | `/admin/advertisements` | Create with multipart form data. |
| Advertisements | PATCH | `/admin/advertisements/:id` | Update content, image, or active status. |
| Coupons | GET | `/admin/coupons` | Paginated and filtered list. |
| Coupons | GET | `/admin/coupons/stats` | Coupon statistics. |
| Coupons | GET | `/admin/coupons/:id` | Coupon detail. |
| Coupons | PATCH | `/admin/coupons/:id` | Update a coupon. |
| Subscription plans | GET | `/admin/subscription-plans` | Paginated plan list. |
| Subscription plans | GET | `/admin/subscription-plans/:id` | Plan detail. |
| Subscription plans | POST | `/admin/subscription-plans` | Create a plan. |
| Subscription plans | PATCH | `/admin/subscription-plans/:id` | Update a plan. |
| Subscription plans | PATCH | `/admin/subscription-plans/:id/toggle-status` | Toggle active status. |
| Subscription plans | PATCH | `/admin/subscription-plans/:id/set-default` | Make a plan the default. |

The repository does not contain a generated API specification. Confirm endpoint availability and DTO compatibility against the deployed backend before expanding integrations.

## Pagination, Search, and Filters

- Connected list pages use one-based page state; the initial page is `1`.
- The backend receives `page` and `limit` and returns `page`, `limit`, `total`, `hasNext`, and `hasPrevious` metadata.
- Users, advertisements, and coupons use a page size of 10.
- User search, advertisement search, and coupon search use the shared 400 ms debounce hook.
- Filter or debounced-search changes reset the relevant list to page 1.
- Query keys include the active page and filters so cached results do not overlap.
- Connected list requests pass TanStack Query's `AbortSignal` to Axios.
- Mutations invalidate related list, detail, counter, or statistics queries.
- Subscription plans use server pagination but do not currently send search or filter parameters.

Local-only pages may display pagination or filters for interface demonstration; those controls do not represent server pagination.

## File Uploads

Advertisement create and update requests use `FormData`:

- The create dialog requires a selected image file.
- An update may keep the existing banner without converting its public URL back into a `File`.
- A newly selected file is appended as `bannerFile`.
- Target categories are appended as repeated `targetCategories` fields.
- Text, date, status, and optional coupon fields are appended only when present in the payload.
- No manual `Content-Type` header is set; the browser/Axios supplies the multipart boundary.

The admin profile image selector currently validates PNG, JPEG, or WebP files up to 1 MB and stores a data URL in the local user record. It is not a backend file upload and should be replaced when a documented profile-image endpoint is available.

## Error Handling

`src/utils/error.ts` extracts a readable backend message before falling back to status-specific Arabic messages. It explicitly handles:

| Condition | Current handling |
|---|---|
| `400` | Invalid request data message. |
| `401` | Expired session or invalid credentials message; eligible non-auth requests may refresh first. |
| `403` | Insufficient permission message without automatic logout. |
| `404` | Requested item not found message. |
| `409` | Data conflict message. |
| `422` | Input validation failure message. |
| `429` | Rate-limit message. |
| `500+` | Server error fallback and one query retry under the global QueryClient policy. |
| Network failure | Backend connectivity message. |
| Timeout | Connection timeout message. |
| Canceled request | Request canceled message. |

Messages containing `chrome-extension://`, `web_accessible_resources`, or similar extension URLs are normally produced by browser extensions rather than this application. Reproduce the issue in Incognito/InPrivate mode before changing application code.

## Roles and Authorization

The user model recognizes these roles:
- `ADMIN`
- `GROUND_TEAM`
- `CUSTOMER_SERVICE`
- `USER`
- `PROVIDER`

Dashboard access is permitted to `SUPER_ADMIN`, `ADMIN`, `GROUND_TEAM`, `CUSTOMER_SERVICE`, and `MANAGER`, whether present as the primary role or in the user's roles array. Other authenticated roles are logged out after login and shown an access error.

Routes below the dashboard layout are protected by the token and backoffice-role check. Unauthorized visitors are redirected to `/login`, with the requested pathname recorded in route state. Frontend checks only protect the interface; every backend endpoint must enforce authentication, authorization, and object-level permissions independently.

## Development Guidelines

- Keep TypeScript strict and avoid `any`.
- Do not hardcode API URLs, tokens, passwords, or credentials.
- Add backend calls to the service module for the relevant business area.
- Add and reuse typed API contracts from `src/types/`.
- Keep authentication state in the existing Zustand store.
- Keep remote server state in TanStack Query.
- Use query keys that include all request parameters.
- Invalidate affected queries after successful mutations.
- Pass `AbortSignal` to cancellable read requests.
- Reuse the existing UI components and preserve the Arabic RTL design system.
- Do not add mock fallback data to an API-connected page.
- Handle loading, empty, success, and error states.
- Confirm backend DTO requirements before enabling an unsupported form action.
- Run TypeScript validation and a production build before submitting changes.

## Code Quality Checklist

- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] No hardcoded API URLs outside environment configuration.
- [ ] No hardcoded tokens, passwords, or private credentials.
- [ ] No application-caused console errors on affected screens.
- [ ] API loading, empty, and error states are handled.
- [ ] Connected pages do not silently fall back to mock data.
- [ ] Query caches are invalidated after mutations.
- [ ] Existing RTL and responsive behavior is preserved.
- [ ] New environment variables are documented and use the `VITE_` prefix only when safe for browser exposure.

Linting and automated tests are not part of this checklist because neither is configured in the repository.

## Production Build

Create the optimized production bundle with:

```bash
npm run build
```

Vite writes the output to:

```text
dist/
```

Inspect the generated build locally with:

```bash
npm run preview
```

This is a browser-history SPA. The production web server must serve `index.html` as the fallback for unknown non-file paths; otherwise direct navigation to routes such as `/users` or `/admin-profile` will return a server-level 404.

## Deployment Notes

- Set `VITE_API_BASE_URL` at build time for the target backend.
- Serve the generated `dist/` directory as static content.
- Configure SPA history fallback to `index.html`.
- Configure backend CORS to allow the production dashboard origin.
- Ensure the backend accepts the production origin and required authorization headers.
- Use HTTPS for both frontend and backend.
- Do not put secrets in Vite environment variables; they are embedded in browser assets.
- Confirm that public file URLs under `/files/public/:id` are reachable from the deployed frontend.

## Troubleshooting

| Problem | Checks and resolution |
|---|---|
| API requests return `401` | Verify credentials, `VITE_API_BASE_URL`, stored access/refresh tokens, and `/auth/refresh` availability. Clear stale local storage and log in again if necessary. |
| API requests return `403` | Confirm that the account has a permitted backoffice role and the backend grants the endpoint permission. A `403` does not trigger automatic logout. |
| CORS errors | Add the frontend origin to the backend's allowed origins and verify allowed methods/headers. |
| `chrome-extension://invalid` or `web_accessible_resources` errors | Disable browser extensions or test in Incognito/InPrivate mode. Do not modify application code solely to address extension errors. |
| Environment variable is not applied | Confirm the `.env` file is at the project root, the name starts with `VITE_`, and restart Vite after changes. Use `VITE_API_BASE_URL`, not the unused `VITE_API_URL` declaration. |
| Application fails immediately with a missing API URL | Create `.env` and set a non-empty `VITE_API_BASE_URL`. |
| Direct route returns 404 after deployment | Configure the web server to fall back to `index.html` for SPA routes. |
| Build fails | Run `npm install` or `npm ci`, use a compatible Node version, run `npm run typecheck`, and inspect the first TypeScript/Vite error. |
| Data changes disappear after refresh | Check whether the screen is listed as local-only in this README. It requires a backend integration before changes can persist. |
| Change password returns 404 or validation errors | Confirm that the backend implements `/auth/change-password` and accepts `{ currentPassword, newPassword }`. |

## Known Limitations

- Several screens remain UI-only because matching backend endpoints and DTOs are not represented in the repository.
- The provider request list is local even though provider profile detail is connected.
- User and provider operational metrics, orders, reviews, and most financial data are unavailable from the current connected responses.
- Coupon creation and deletion are not connected.
- Platform commission and withdrawal settings are not connected because supported backend keys are not documented.
- Admin notification data is local and intentionally separate from the app-user notification management screen.
- Admin name, phone, and profile image updates are local only.
- The authenticated change-password endpoint is referenced by the client but has not been verified against a backend specification in this repository.
- The normal non-password OTP completion branch expects a pending session in `sessionStorage`; the current direct login path does not create that pending session.
- No lint script or ESLint configuration is present.
- No automated test script or test framework is configured.
- Full authenticated runtime verification requires a reachable backend and valid admin credentials.

## Security Notes

- Never commit `.env` files, credentials, access tokens, refresh tokens, or session IDs.
- Never log passwords, OTPs, authorization headers, or sensitive request/response payloads.
- Treat all frontend role checks as user-interface protection only.
- Enforce authentication, role checks, permissions, and record ownership on the backend.
- Use HTTPS in production.
- Keep the development authentication bypass disabled outside local development.
- Review `localStorage` token storage against the production security requirements; JavaScript-accessible tokens increase the impact of cross-site scripting.
- Apply a strict Content Security Policy and review third-party scripts at deployment time.
- Ensure password and OTP rate limits are enforced by the backend.
- Do not expose secrets through any `VITE_` variable.

## Verification Status

The following reflects verification performed against the current working tree while preparing this document.

| Check | Status |
|---|---|
| TypeScript (`npm run typecheck`) | Passed |
| Production build (`npm run build`) | Passed |
| Lint | Not configured |
| Automated tests | Not configured |
| Development/preview runtime | Not verified as part of README preparation |
| Full authenticated browser flow | Requires a reachable backend and valid backoffice credentials |
| Backend endpoint contract | Inferred from current service code; no API specification is stored in the repository |

## Contributing

1. Create a focused branch.
2. Make a small, scoped change that follows the existing module structure.
3. Run `npm run typecheck`.
4. Run `npm run build`.
5. Verify the affected screens at relevant desktop and responsive sizes.
6. Exercise affected API success, loading, empty, and failure states when credentials are available.
7. Submit a pull request with a clear summary, backend assumptions, and verification notes.

## Internationalization

The dashboard uses `i18next` and `react-i18next` for frontend localization.

- Supported languages: Arabic (`ar`) and English (`en`).
- Default language: Arabic.
- Persistence key: `app-language` in `localStorage`.
- Translation resources: `src/i18n/locales/ar/translation.json` and `src/i18n/locales/en/translation.json`.
- Central initialization: `src/i18n/index.ts`.
- Locale-aware date, number, and SAR currency helpers: `src/i18n/useLocale.ts`.
- Known status and role display mappings: `src/i18n/translateEnum.ts`.

Use `useTranslation` inside React components:

```tsx
const { t } = useTranslation();

return <button>{t("common.save")}</button>;
```

When adding a key, add the same descriptive key to both translation JSON files. Do not use visible text as a key. The language switcher changes the language without reloading the page. The i18n setup updates `html.lang`, `html.dir`, and `body.dir` immediately; Arabic uses RTL and English uses LTR.

Use `useLocale` for user-facing dates, numbers, percentages, and SAR currency. Keep API date formats and numeric payloads unchanged. Backend enum values, object keys, routes, query parameters, and request fields must never be translated; map enum values to translation keys only when rendering them.

## License

No license has been specified for this project.
