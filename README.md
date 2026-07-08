# Hexagon Trivia

A web-based trivia quiz app built for running live game nights. Supports 8 distinct round/game modes with category filtering, tracks player scores with a scoreboard and winner announcement, and includes a password-gated admin console where the quizmaster can add, edit, and organize questions on the fly.

## Features

- 🎯 8 round/game modes, with round and category filtering
- 🏆 Live scoreboard and end-of-game winner announcement
- 🔒 Password-gated admin console for managing the question library
- ➕ Add, edit, and organize questions without touching the database directly
- ⚡ Fast client-side routing and data fetching

## Tech Stack

**Frontend**
- React
- React Router — client-side routing
- Redux — game/question state
- TanStack Query — data fetching/caching
- Tailwind CSS — styling
- Vite — dev server & build

**Backend**
- Node.js — serves the question library API

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

See `backend/README.md` for backend-specific configuration.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx                # Route definitions
│   ├── layouts/
│   │   └── RootLayout.tsx     # Root layout + error boundary
│   ├── pages/
│   │   ├── Home.tsx           # Play page
│   │   ├── Admin.tsx          # Admin console
│   │   └── NotFound.tsx       # 404 page
│   ├── hooks/
│   │   └── usePageTitle.ts    # Per-page document title helper
│   ├── store/                 # Redux slices (quiz, questions, players, admin)
│   └── components/            # Shared UI components
└── ...

backend/
└── ...                        # Question library API
```

## Admin Access

Navigate to `/admin` and enter the quizmaster password to add, edit, or organize questions by round and category.

## License

MIT
