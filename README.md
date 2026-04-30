# Yodeck – ClickUp Tagesverantwortung Display

A lightweight React app that displays the daily responsibility ("Tagesverantwortung") assigned in ClickUp. Designed for digital signage screens (e.g. [Yodeck](https://www.yodeck.com/)), it fetches the current assignee from a ClickUp task list and shows their name and avatar in a clean, full-screen layout.

## Features

- Fetches the assigned person from a ClickUp task list via the ClickUp API
- Displays the assignee's profile picture (or initials as a fallback)
- Responsive design with breakpoints from small screens to large displays
- Dark mode support
- Loading skeleton animations
- Error handling with user-friendly messages
- Dedicated auth page for entering API keys

## Tech Stack

| Category   | Technology                     |
| ---------- | ------------------------------ |
| Framework  | React 19                       |
| Language   | TypeScript 5.9                 |
| Build Tool | Vite 7                         |
| Styling    | Tailwind CSS 4                 |
| Icons      | Lucide React                   |
| Routing    | React Router DOM 7             |
| Linting    | ESLint 9 + TypeScript ESLint   |
| Formatting | Prettier + Tailwind CSS plugin |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [ClickUp API key](https://clickup.com/api/)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the app in your browser at the URL provided by Vite (typically `http://localhost:5173`).

If no API key is present in the URL, the app redirects to `/auth`, where you can enter your key. On submit, the app redirects to `/?key=YOUR_CLICKUP_API_KEY`.

You can still open the main page directly with a key in the query parameter:

```
http://localhost:5173/?key=YOUR_CLICKUP_API_KEY
```

### Production Build

```bash
npm run build
```

The optimized output is written to the `dist/` directory. You can preview it locally with:

```bash
npm run preview
```

## Usage

The app reads the ClickUp API key from the URL query string:

```
https://your-domain.com/?key=YOUR_CLICKUP_API_KEY
```

| Parameter | Required | Description                     |
| --------- | -------- | ------------------------------- |
| `key`     | Yes      | Your personal ClickUp API token |

On load, the app fetches the first task from the configured ClickUp list and displays the assignee's name and avatar. If no API key is provided, the app redirects to `/auth`. If the key is invalid, an error message is shown.

## Configuration

The ClickUp list ID is currently configured in `src/App.tsx`. To point the app at a different list, update the ID passed to `APIResource`:

```typescript
const resources = useMemo(
    () => ({
        assigneeTaskList: new APIResource('YOUR_LIST_ID', 'task-list'),
    }),
    [],
)
```

## Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across the project        |

## Project Structure

```
yodeck/
├── public/
│   └── clickup-logo.svg       # ClickUp logo asset
├── src/
│   ├── App.tsx                 # Main display page component
│   ├── AuthPage.tsx            # API key form page
│   ├── APIResource.ts          # ClickUp API URL builder
│   ├── main.tsx                # React entry point & route setup
│   └── index.css               # Global styles & Tailwind imports
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── package.json                # Dependencies & scripts
```

## License

This is a private project. All rights reserved.
