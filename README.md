# 🎬 MovieXD – Streaming UI

MovieXD is a modern, responsive streaming platform UI built with React and Tailwind CSS.

![MovieXD Preview](screenshot.png)

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Dark Theme**: Premium dark mode with red and gold accents.
- **Movie Cards**: Hover effects, movie details popups, and quick actions.
- **Smooth Animations**: Micro-interactions and page transitions.
- **Context Management**: Per-user watchlist, favorites, and continue-watching (localStorage).
- **Authentication**: Firebase email/password and Google sign-in.
- **Routing**: Professional routing with React Router.

## Tech Stack

- React 18
- Tailwind CSS
- React Router DOM
- Firebase Auth
- Framer Motion

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd movieXD
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your keys.

## Authentication

MovieXD uses **Firebase Authentication** for email/password sign-up, Google OAuth, and session management.

### Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Email/Password** and **Google** under Authentication → Sign-in method.
3. Add authorized domains: `localhost`, your `*.vercel.app` domain, and any custom domain.
4. Copy the web app config into `.env` using the `VITE_FIREBASE_*` variables from `.env.example`.
5. On **Vercel** → Project → Settings → Environment Variables, set `TMDB_API_KEY` and all `VITE_FIREBASE_*` values, then redeploy.

### Deploy (Vercel)

1. Import the GitHub repo in [vercel.com](https://vercel.com) (framework: Vite, output: `dist`).
2. Set env vars: `TMDB_API_KEY`, `VITE_FIREBASE_*` (and optionally `VITE_TMDB_API_KEY` for local parity).
3. Deploy. TMDB calls go through `api/tmdb/[...path].js` so the key stays server-side.

### Google OAuth

In Google Cloud Console, add authorized JavaScript origins for your dev and production URLs. Firebase uses `https://<project-id>.firebaseapp.com/__/auth/handler` as the OAuth redirect.

## Usage

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Open [http://localhost:5173](http://localhost:5173) to view the app.
