# Sovereign Empire Digital Library — Build & Continue Guide

## Run the project

Requirements: Node.js 20+ and npm.

```bash
cd "C:\Users\PC\Desktop\workshop\digi market store"
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Before committing or deploying, run `npm run build`.

## What is built

- React + Vite app with route-based pages.
- Responsive sidebar: scrolling navigation, compact-height behavior, mobile drawer, scrim, and close behavior.
- Landing, categories, books, courses, resource details, reader, video course, search, dashboard, admin dashboard, and auth dialog.
- Demo persistence for sign-in state, library items, bookmarks, downloads, reader position, and video progress.
- Shared components and a replaceable data repository.

## Project map

```text
src/
  App.jsx                    Routes, app shell, top bar, mobile drawer state
  components/
    Pages.jsx                Current page-level components (split into src/pages as it grows)
    Sidebar.jsx              Reusable primary/account navigation
    LibraryCard.jsx          Resource cards
    SearchInput.jsx          Shared search input
    Section.jsx              Section heading/action wrapper
    ui/                      Dialog, EmptyState, ProgressBar
  context/LibraryContext.jsx Shared app state/actions
  data/library.js            Seed resources, categories, navigation
  lib/storage.js             Browser-local demo repository
  app.css                    Feature/page styles
  responsive.css             Mobile and sidebar styles
```

## Add a new page or feature

1. Create a focused page component in `src/pages/`, e.g. `src/pages/CommunityPage.jsx`.
2. Add a route in `src/App.jsx`.
3. Add its navigation label/path to the `navigation` route map in `App.jsx`.
4. Reuse `Sidebar`, `Section`, `LibraryCard`, `Dialog`, `EmptyState`, and `ProgressBar` before creating a generic component.
5. Add seed data to `src/data/library.js`.
6. Put shared state/actions in `LibraryContext.jsx`, and keep storage/API calls inside a repository file.
7. Check desktop, narrow mobile, keyboard focus, empty/error states, then run `npm run build`.

Example route:

```jsx
<Route path="/community" element={<CommunityPage />} />
```

## Current demo storage

The demo uses browser `localStorage` under the key below. You can clear it in DevTools while testing.

```text
sovereign-library-v1
```

This is prototype persistence only: it is not secure auth and does not sync between devices.

## Backend plan: Supabase

Use Supabase for authentication, Postgres data, file storage, and row-level security.

### 1. Install and configure

```bash
npm install @supabase/supabase-js
```

Create `.env.local` and do not commit it:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Add `.env.local` to `.gitignore`. Never expose a service-role key in Vite client code.

### 2. Recommended tables

```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  resource_type text not null,
  category_id uuid,
  access_level text default 'Free',
  rating numeric default 0,
  cover_url text,
  content_url text,
  created_at timestamptz default now()
);

create table user_resources (
  user_id uuid references auth.users on delete cascade,
  resource_id uuid references resources on delete cascade,
  saved boolean default false,
  downloaded boolean default false,
  bookmarked boolean default false,
  progress integer default 0,
  updated_at timestamptz default now(),
  primary key (user_id, resource_id)
);
```

### 3. Security and integration

- Enable row-level security on all user-data tables.
- Allow users to read/write only rows where `auth.uid() = user_id`.
- Restrict admin writes through roles or server-side functions.
- Use `supabase.auth.signUp`, `signInWithPassword`, and `onAuthStateChange`.
- Keep `LibraryContext` action names stable; replace the internals of `lib/storage.js` with a Supabase repository. The UI should not need a rewrite.

## Recommended next improvements

- Split `components/Pages.jsx` into separate files inside `src/pages/`.
- Add real covers in `public/covers/` or Supabase Storage.
- Add server-side pagination, filters, sort, loading, and error states.
- Add route protection and role-protected admin tools.
- Add form validation, accessible toast feedback, and tests for navigation, mobile drawer, search, saved resources, auth, reader, and video progress.
- Add ESLint, Prettier, and CI after the UI is stable.

## Git workflow

```bash
git status
git add src BUILT.md package.json package-lock.json
git commit -m "Describe your change"
```

Never commit `node_modules`, `dist`, `.env.local`, credentials, or service-role keys.
