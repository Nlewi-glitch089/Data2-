# Agentic Data Quality Analysis Platform

A Next.js application for inspecting uploaded datasets and surfacing data-quality issues. Users can upload CSV, JSON, or Excel files, preview the parsed data, review quality metrics, and request AI-generated recommendations.

## Current implementation

- Upload a CSV, JSON, or Excel file (up to 50 MB).
- Parse the file in the browser and store the current dataset in session storage for the preview/analysis flow.
- Calculate quality metrics such as missing values, duplicates, outliers, and formatting issues.
- Display data-quality results and visual summaries.
- Request AI-generated insights through a Next.js server route.

The upload flow is implemented in `app/page.jsx`; file parsing and analysis logic live in `app/lib/`. The AI insights endpoint is in `app/api/insights/route.js`.

## Technology

- Next.js 14 App Router
- React 18
- JavaScript / JSX
- Papa Parse and ExcelJS for file parsing
- Chart.js and react-chartjs-2 for charts
- OpenAI Node SDK for server-side insights
- CSS and Tailwind CSS

## Requirements

- Node.js 24 (the version specified in `package.json`)
- pnpm (recommended; the repository includes a pnpm lockfile)
- An OpenAI API key for AI-generated insights

## Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Nlewi-glitch089/Data2-.git
   cd Data2-
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

   npm is also available if you prefer the checked-in `package-lock.json`, but use one package manager consistently.

3. Create `.env.local` in the repository root and add your server-side OpenAI key:

   ```dotenv
   OPENAI_API_KEY=your_openai_api_key
   ```

   Do not prefix this key with `NEXT_PUBLIC_`; it must remain server-side. Do not commit `.env.local`.

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server after building |
| `pnpm install` | Install dependencies |

The repository does not currently define test, lint, or database migration scripts in `package.json`.

## Deploying to Vercel

The repository includes a `vercel.json` configured for Next.js and pnpm.

1. Import this repository into [Vercel](https://vercel.com/new).
2. Set the project root to the repository root.
3. Use Node.js 24 and the configured pnpm install/build commands.
4. Add `OPENAI_API_KEY` under Project Settings → Environment Variables. Keep it server-side; do not use a `NEXT_PUBLIC_` prefix.
5. Deploy and verify file upload, preview, analysis, and the AI insights endpoint.

No verified public production URL is recorded in this README. Add the current Vercel Production domain after confirming the deployment works.

## Data handling and limitations

- Uploaded data is parsed in the browser and held in session storage for the current browser session; it is not a user account or persistent cloud dataset library.
- Remove sensitive or personally identifiable information from files before uploading.
- AI insights require a valid server-side `OPENAI_API_KEY` and may incur API usage costs.
- This repository is an evolving application. Confirm current behavior before describing features as production-ready.

## Related planning material

The project brief, wireframes, setup notes, and milestone documents are kept in this repository alongside the application code.