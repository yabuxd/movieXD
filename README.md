# 🎬 MovieXD – Streaming UI

MovieXD is a modern, responsive streaming platform UI built with React and Tailwind CSS.

![MovieXD Preview](screenshot.png)

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Dark Theme**: Premium dark mode with red and gold accents.
- **Movie Cards**: Hover effects, movie details popups, and quick actions.
- **Smooth Animations**: Micro-interactions and page transitions.
- **Context Management**: Global watchlist and favorites (per-user via localStorage).
- **Authentication**: Firebase email/password and Google sign-in.
- **Routing**: Professional routing with React Router.
- **Icons**: Powered by Lucide React.

## Tech Stack

- React 18
- Tailwind CSS
- React Router DOM
- Lucide React

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

3. Copy `.env.example` to `.env` and fill in your API keys (see [Authentication](#authentication) below).

## Authentication

MovieXD uses **Firebase Authentication** for sign-in, registration, and Google OAuth.

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Email/Password** (and optionally **Google**) under Authentication → Sign-in method.
3. Add authorized domains under Authentication → Settings: `localhost` and your production domain (e.g. `movyxd.netlify.app`).
4. Copy the web app config into `.env` using the `VITE_FIREBASE_*` variables from `.env.example`.
5. For Netlify deployment, set the same `VITE_FIREBASE_*` variables in Site configuration → Environment variables and redeploy.

In local development without Firebase credentials, mock auth is available with demo credentials `user@example.com` / `password123`.

## Usage

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.
