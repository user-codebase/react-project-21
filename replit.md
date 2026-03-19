# react-project-21 - Restaurant Table Manager (Waiter.app)

## Overview
A React web application for managing restaurant tables. Users can view and manage table statuses (Free, Reserved, Busy, Cleaning), number of people, and bill amounts.

## Tech Stack
- **Frontend**: React 19, React Router DOM v7, React-Bootstrap 5
- **State Management**: Redux 5, Redux-Thunk 3 (named import `{ thunk }`)
- **Mock Backend**: json-server 0.17 (served on port 3131 in development)
- **Build System**: Create React App (react-scripts 5)
- **Package Manager**: npm

## Project Structure
- `src/` - React source code
  - `components/pages/` - Page-level components (Home, Table, NotFound)
  - `components/views/` - Layout components (Header, Footer, NavBar)
  - `redux/` - Redux store, reducers, thunks
  - `config.js` - API URL configuration
- `server.mjs` - Production server at project root (serves built app + json-server together)
- `public/db/app.json` - Mock database file
- `public/db/routes.json` - json-server route rewriting (`/api/*` → `/$1`)

## API Configuration
- Development: `http://localhost:3131/api`
- Production: `/api` (served by server.mjs on same port)

## Development
The workflow runs `npm start` which uses `npm-run-all` to concurrently start:
1. React dev server on port 5000 (HOST=0.0.0.0, DANGEROUSLY_DISABLE_HOST_CHECK=true)
2. json-server on port 3131

## Production (Deployment)
- Build: `npm run build` (also copies db file to build/db/ via prebuild script)
- Run: `node server.mjs` (serves built React app + json-server on PORT env var, default 3131)

## Key Fix Applied
- `redux-thunk` v3 uses named export: changed `import thunk from 'redux-thunk'` to `import { thunk } from 'redux-thunk'` in `src/redux/store.js`
- Fixed `prebuild` script path: `public/db/app.json` (not `db/app.json`)
