# Waqtify

Waqtify (derived from "Waqt", meaning time) is a productivity-focused habit tracker that empowers users to take control of their time, cultivate discipline, and achieve long-term personal growth through small daily actions.

## Features

- **Three habit types** — Binary (Yes/No), Quantitative (Count), and Temporal (Timer)
- **Streak tracking** — Timezone-aware streak calculation with grace periods
- **Analytics dashboard** — Perfect Day Rate, Habit Strength, and Category Breakdown
- **Optimistic UI** — Instant feedback with background persistence
- **Local-first** — All data stored in `localStorage`; no backend required in Phase 1
- **Mock authentication** — Full signup/login/logout flow with route guarding

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 18 (Web), React Native + Expo (Mobile), TypeScript, Vite |
| Styling | Tailwind CSS |
| State Management | Zustand + Immer |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Charts | Recharts, react-activity-calendar |
| Date Handling | date-fns, date-fns-tz |
| Monorepo | Turborepo, npm workspaces |

## Project Structure

```
waqtify/
├── apps/
│   ├── web/          # React web application
│   └── mobile/       # React Native Expo application
├── packages/
│   ├── ui/           # Shared component library
│   ├── types/        # Shared TypeScript interfaces
│   └── config/       # Shared ESLint & TS configs
├── turbo.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js `>=18`
- npm `>=10`

### Installation

```bash
git clone https://github.com/your-username/waqtify.git
cd waqtify
npm install
```

### Development

```bash
npm run dev
```

This starts all apps and packages in parallel via Turborepo. The web app will be available at `http://localhost:5173`.

### Mobile Development

```bash
npm run dev:mobile
```

This starts the Expo dev server for the mobile app.

### Build

```bash
npm run build
```

To run only the mobile build/export:

```bash
npm run build:mobile
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## Architecture

See [Technical Architecture.md](./Technical%20Architecture.md) for a deep dive into state management, streak algorithms, data visualization, and the future full-stack integration strategy.

## License

[MIT](./LICENSE)
