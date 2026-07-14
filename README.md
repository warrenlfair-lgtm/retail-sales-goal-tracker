# Retail Sales Goal Tracker

A React + Vite dashboard application for tracking retail store and associate sales performance.

## Features

- 📊 **Dashboard** — Overview with KPI stat cards, monthly goal progress bars, and top associates
- 💰 **Sales Entry** — (Coming Soon) Record daily sales transactions
- 👥 **Associates** — (Coming Soon) Manage sales team and individual performance
- 📅 **Monthly Setup** — (Coming Soon) Configure monthly goals and targets
- 📋 **History** — (Coming Soon) Browse historical sales data and trends

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- Mobile-responsive layout with sidebar navigation
- Local storage architecture for future data persistence (no backend required)
- Pure CSS custom properties — no external UI libraries

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Layout, Sidebar, Header, NavLink
├── pages/          # Dashboard, SalesEntry, Associates, MonthlySetup, History
├── hooks/          # useLocalStorage
└── utils/          # storage.js — local storage helpers
```
