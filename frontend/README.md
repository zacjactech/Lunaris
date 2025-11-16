# Lunaris Frontend

Frontend application for the Lunaris Emotion Journal built with Next.js.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env
```

For production, set:
```
NEXT_PUBLIC_API_URL="your backend deployed url"
```

## Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Production

Build and start the production server:
```bash
npm run build
npm run start
```

## Project Structure

```
app/                # Next.js App Router pages
components/         # React components
contexts/           # React contexts (Auth)
lib/               # Utilities and configurations
```

## Key Features

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API communication
- JWT authentication with refresh tokens

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (required)
