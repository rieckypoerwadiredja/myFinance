# My Finanace — Financial Ledger (Next.js)

A small financial ledger dashboard built with Next.js App Router. It reads and writes transactions directly to a Google Sheet (as the single source of truth), then renders:

- Dashboard: total expenses, spending trends (monthly/weekly), category breakdown, and recent activity.
- Transactions: server-backed pagination (100 rows/page), filtering, inline edit, and delete.
- Upload: multi-row create (append) to the sheet.

## What You Get

### Features

- Google Sheets as a database (CRUD via Google Sheets API)
- API route: `/api/transaction` (GET with filters + pagination, POST create, PATCH update, DELETE remove)
- Date parsing for `dd/mm/yyyy` and `yyyy-mm-dd` (to avoid month shifting bugs)
- Indonesian Rupiah formatting
- Category palette:
  - Donasi (light blue)
  - Date (light pink)
  - Main (light green)
  - Kerja (gray)
  - Lainnya (dark)

### Architecture (High Level)

```
app/
  api/transaction/route.ts       # Google Sheets CRUD + filters + pagination + summary
  components/
    elements/                    # small reusable UI building blocks
    fragments/                   # page sections (tables, charts, headers)
    layouts/                     # page composition (Dashboard/Transactions/Upload)
  lib/                           # shared helpers (client API, rupiah, categories)
  transactions/page.tsx          # page entry
  upload/page.tsx                # page entry
  page.tsx                       # dashboard entry
```

## Getting Started (Local)

### 1) Install

```bash
npm install
```

### 2) Environment Variables

Create a `.env` file at the project root (do not commit it). Required variables:

| Variable               | Required | Description                                                                                                    |
| ---------------------- | -------: | -------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_EMAIL`  |      Yes | Service Account email (e.g. `...@...iam.gserviceaccount.com`)                                                  |
| `GOOGLE_PRIVATE_KEY`   |      Yes | Service Account private key (multi-line key, stored with `\n` in `.env`)                                       |
| `GOOGLE_SHEET_ID`      |      Yes | Spreadsheet ID from the Google Sheets URL                                                                      |
| `GOOGLE_SHEET_TITLE`   |      Yes | Sheet/tab name (example: `2026`)                                                                               |
| `GOOGLE_SHEET_RANGE`   |       No | Defaults to `${GOOGLE_SHEET_TITLE}!A:E` (Id, Tanggal, Kiteria, Pengeluaran, Note)                              |
| `AUTH_SECRET`          |      Yes | A random string used to sign and encrypt the session cookie. Generate with `openssl rand -base64 32`           |
| `AUTHORIZED_EMAILS`    |      Yes | Comma-separated list of emails allowed to access the application (e.g., `user1@example.com,user2@example.com`) |
| `GOOGLE_CLIENT_ID`     |       No | Client ID for Google OAuth (if enabled)                                                                        |
| `GOOGLE_CLIENT_SECRET` |       No | Client Secret for Google OAuth (if enabled)                                                                    |
| `GITHUB_CLIENT_ID`     |       No | Client ID for GitHub OAuth (if enabled)                                                                        |
| `GITHUB_CLIENT_SECRET` |       No | Client Secret for GitHub OAuth (if enabled)                                                                    |

Example `.env` (values are placeholders):

```env
GOOGLE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="your_sheet_id_here"
GOOGLE_SHEET_TITLE="2026"
GOOGLE_SHEET_RANGE="2026!A:E"
AUTH_SECRET="your_nextauth_secret_here"
AUTHORIZED_EMAILS="user1@example.com,user2@example.com"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

### 3) Run

```bash
npm run dev
```

Open http://localhost:3000

### Authentication

This application uses [NextAuth.js](https://next-auth.js.org/) for authentication. Access to both frontend pages and API routes is restricted to a predefined list of authorized email addresses.

- **Google OAuth:** Users sign in with their Google account. Their email must be in `AUTHORIZED_EMAILS`.
- **GitHub OAuth:** Users sign in with their GitHub account. Their email must be in `AUTHORIZED_EMAILS`.
- **Route Protection:**
  - **Frontend:** Middleware (`proxy.ts`) protects all routes except `/auth/signin` and static assets. Unauthenticated users are redirected to the sign-in page.
  - **API Routes:** Each API endpoint (`/api/transaction`) checks for an active and authorized session. Requests from unauthenticated or unauthorized users will receive a `401 Unauthorized` response.
- **Sign-in Page:** A custom sign-in page is located at `/auth/signin`.
- **Sign-out:** A sign-out button is available in the `TopBar` component.

### Google Cloud Console Setup (OAuth)

If you wish to enable Google OAuth, you need to configure a Google Cloud Project:

1.  **Create a Google Cloud Project:**
    - Go to Google Cloud Console: `https://console.cloud.google.com/`
    - Create a new project (or select an existing one).
2.  **Enable Google People API:**
    - In the Google Cloud Console, navigate to "APIs & Services" > "Library".
    - Search for and enable "Google People API".
3.  **Configure OAuth Consent Screen:**
    - In "APIs & Services" > "OAuth consent screen".
    - Choose "External" for User Type and fill in the required app information.
    - Add your authorized email addresses as "Test users".
4.  **Create OAuth Client ID:**
    - In "APIs & Services" > "Credentials".
    - Click "CREATE CREDENTIALS" > "OAuth client ID".
    - Application type: "Web application".
    - Add `http://localhost:3000` and your deployment URL (e.g., `https://your-app.vercel.app`) to "Authorized JavaScript origins".
    - Add `http://localhost:3000/api/auth/callback/google` and your deployment callback URL (e.g., `https://your-app.vercel.app/api/auth/callback/google`) to "Authorized redirect URIs".
    - Copy the `Client ID` and `Client Secret` and add them to your `.env` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### GitHub OAuth Setup

If you wish to enable GitHub OAuth, you need to configure a GitHub OAuth App:

1.  **Register a new OAuth App:**
    - Go to GitHub Developer Settings: `https://github.com/settings/developers`
    - Navigate to "OAuth Apps" > "New OAuth App".
2.  **Fill in Application Details:**
    - **Application name:** A descriptive name for your app.
    - **Homepage URL:** `http://localhost:3000` (and your deployment URL).
    - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github` (and your deployment callback URL).
3.  **Generate Client Secret:**
    - After registering, you will get a `Client ID`.
    - Click "Generate a new client secret" to get the `Client Secret`.
    - Copy the `Client ID` and `Client Secret` and add them to your `.env` file as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

## Google Cloud Console Setup (Service Account)

This project uses a Service Account (server-to-server) to access Google Sheets.

### A) Create a Google Cloud Project

- Google Cloud Console: https://console.cloud.google.com/
- Create a new project (or pick an existing one)

### B) Enable Google Sheets API

- APIs & Services → Library
- Enable: Google Sheets API

### C) Create a Service Account + Key

- IAM & Admin → Service Accounts
- Create service account
- Grant minimum permission: it can be left without IAM roles for Sheets access; the sheet itself is shared with this account.
- Create a key:
  - Key type: JSON
  - Download the JSON and extract:
    - `client_email` → `GOOGLE_CLIENT_EMAIL`
    - `private_key` → `GOOGLE_PRIVATE_KEY`

### D) Share the Sheet to the Service Account

Open your Google Sheet → Share → add `GOOGLE_CLIENT_EMAIL` as a viewer/editor:

- Viewer: read-only (GET filters)
- Editor: required for create/update/delete

## How to Use (App)

### Dashboard

- Select a year and view (Monthly/Weekly).
- Monthly view supports a flexible month range (Start/End).
- Weekly view supports selecting a month + year.
- Category breakdown and recent activity follow the same filter context.

### Transactions Page

- Filters:
  - Category (`Donasi`, `Date`, `Main`, `Kerja`, `Lainnya`)
  - Date range (`from`, `to`)
- Pagination:
  - 100 rows per page (server-backed)
- Inline edit:
  - Date uses a `date` input
  - Category uses a dropdown
  - Amount uses a numeric input

### Upload Page

- Add multiple rows at once
- Date uses `date` input
- Category offers suggestions but can be typed manually
- IDs are generated by the API

## API Reference

Base URL: `/api/transaction`

### GET /api/transaction

Query params:

| Param      | Type   | Example      | Notes          |
| ---------- | ------ | ------------ | -------------- |
| `page`     | number | `1`          | default: `1`   |
| `limit`    | number | `100`        | default: `100` |
| `category` | string | `Main`       | optional       |
| `from`     | string | `2026-01-01` | optional       |
| `to`       | string | `2026-01-31` | optional       |
| `search`   | string | `indomaret`  | optional       |

Response shape (simplified):

```json
{
  "message": "Berhasil mengambil data transaksi dari Google Sheets.",
  "totalCount": 256,
  "page": 1,
  "limit": 100,
  "count": 100,
  "categories": ["Donasi", "Date", "Main", "Kerja", "Lainnya"],
  "years": [2025, 2026],
  "summary": {
    "totalVolume": 6586400,
    "percentChange": -12.5,
    "trend": "down",
    "validatedEntries": 256
  },
  "data": [
    {
      "id": "TX-...",
      "tanggal": "12/04/2026",
      "kriteria": "Main",
      "pengeluaran": "Rp6.586.400",
      "note": "example",
      "pengeluaranNumber": 6586400
    }
  ]
}
```

### POST /api/transaction

Append rows to the bottom of the sheet. IDs are generated by the API.

```json
{
  "items": [
    {
      "tanggal": "2026-04-12",
      "kriteria": "Main",
      "pengeluaran": "25000",
      "note": "Lunch"
    }
  ]
}
```

### PATCH /api/transaction

Update a row by `id` (id is immutable).

```json
{
  "id": "TX-...",
  "tanggal": "2026-04-12",
  "kriteria": "Donasi",
  "pengeluaran": "50000",
  "note": "Updated note"
}
```

### DELETE /api/transaction?id=TX-...

Deletes the matching row (never deletes the header row).

## Dev Notes

### Date Formats

Supported input formats:

- `yyyy-mm-dd` (recommended for forms)
- `dd/mm/yyyy` and `dd-mm-yyyy` (often used in spreadsheets)

### Security

Never commit secrets:

- `.env`
- service account keys

If you accidentally committed credentials, rotate the key immediately in Google Cloud Console.
