# Run the Data Quality Analysis app

Use these steps from the repository root on your own computer.

## Prerequisites

- Node.js 24
- pnpm (recommended; npm can be used with the checked-in `package-lock.json`)

## Install

Clone the repository if you have not already:

```bash
git clone https://github.com/Nlewi-glitch089/Data2-.git
cd Data2-
```

Install dependencies:

```bash
pnpm install
```

## Configure AI insights

Create a file named `.env.local` in the project root and add your server-side OpenAI key:

```dotenv
OPENAI_API_KEY=your_openai_api_key
```

Keep this file private and out of Git. Do not rename the variable to `NEXT_PUBLIC_OPENAI_API_KEY`; the key must remain server-side.

## Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The upload page accepts CSV, JSON, and Excel files. The selected dataset is processed in the browser and kept in session storage for the current session. Remove sensitive data before uploading.

For a production build, run:

```bash
pnpm build
pnpm start
```
