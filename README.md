# Open-Business

Isometric business management game built with React, TypeScript, Vite, and Three.js / React Three Fiber.

## Quick Start

### Development

```bash
npm install
npm run dev
```

Opens dev server at `http://localhost:5173/` with HMR.

### Linting & Formatting

```bash
npm run lint       # Check code with ESLint
npm run format     # Format code with Prettier
```

### Build

```bash
npm run build      # Build for production
npm run preview    # Preview production build locally
```

## Project Structure

```
src/
├── assets/          # Icons, images, static files
├── components/      # React UI components (menus, modals, HUD)
├── game/            # Pure game logic (rules, state, types)
│   ├── store/       # Zustand stores
│   └── types/       # TypeScript interfaces for game domain
├── r3f/             # React Three Fiber scene components
│   ├── camera/      # Camera configurations
│   ├── lights/      # Lighting setup
│   └── objects/     # 3D objects and meshes
├── electron/        # Electron main process code
│   ├── main.ts
│   └── preload.ts
└── App.tsx          # Root React component
```

## Technologies

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **3D Rendering**: Three.js + React Three Fiber
- **Styling**: Tailwind CSS
- **State Management**: Zustand (upcoming)
- **Desktop**: Electron + Electron Builder
- **Code Quality**: ESLint + Prettier

## Phase 1 Status

- [x] #001 — Git repository initialization
- [x] #002 — Vite + React + TypeScript setup
- [x] #003 — ESLint + Prettier configuration
- [x] #004 — Tailwind CSS configuration
- [x] #005 — Project folder structure
- [ ] #006 onwards — Electron integration (Phase 2)
