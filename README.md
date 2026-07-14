# retail-sales-goal-tracker
Retail sales goal tracking dashboard for store and associate performance

## Features

- **Store Management** — Add, edit, and delete multiple store locations
- **Associate Management** — Track sales associates per store with role information
- **Goal Tracking** — Set daily, weekly, or monthly sales targets per associate
- **Sales Entry** — Record sales transactions with date and optional notes
- **Progress Dashboard** — Visual progress bars and percentage tracking for every goal
- **Summary Dashboard** — Aggregate view across all stores with top-performer rankings
- **Local Persistence** — All data saved automatically to browser localStorage

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Add a Store** — Navigate to the _Stores_ tab and click **+ Add Store**
2. **Add Associates** — Open a store and click **+ Add Associate**
3. **Set Goals** — Click **+ Goal** next to an associate and choose a period and target amount
4. **Record Sales** — Click **+ Sales** next to an associate to log a sales entry
5. **View Progress** — Expand an associate row to see goal progress bars; switch to _Dashboard_ for the high-level overview

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run lint` | Run linter |
| `npm run preview` | Preview production build locally |

## Tech Stack

- [React 19](https://react.dev/) with TypeScript
- [Vite 8](https://vite.dev/) — build tool and dev server
- [Tailwind CSS 4](https://tailwindcss.com/) — utility-first styling
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — unit tests
