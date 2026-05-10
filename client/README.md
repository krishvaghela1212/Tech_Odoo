# Traveloop Frontend (Client)

This is the React-based frontend for **Traveloop**, built with Vite and Tailwind CSS.

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Set up `.env`:
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## 🛠️ Commands

- `npm run dev`: Starts the development server at `http://localhost:3000`
- `npm run build`: Generates the production build in the `dist/` folder
- `npm run preview`: Previews the production build locally
- `npm run clean`: Cleans the build directory

## 🏗️ Architecture

- **State**: React Context API for Authentication.
- **Routing**: React Router DOM (v6).
- **Backend**: Direct integration with Supabase JS SDK.
- **Styling**: Tailwind CSS 4.0 with customized glassmorphism theme.
