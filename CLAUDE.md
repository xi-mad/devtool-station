# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevTool Station is a single-page React developer toolkit with 17 utility tools. Built with Vite + React 19 + TypeScript, styled with Tailwind CSS v4 (via @tailwindcss/vite), Monaco Editor for code editing, and i18next for i18n (en/zh).

## Development Commands

- `npm run dev` — Start dev server at `http://127.0.0.1:3000`
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview the production build locally
- `npm run typecheck` — Run `tsc --noEmit` for type checking

There is no test runner or linter currently configured.

## Entry Point & Bootstrap

The entry point is `index.tsx` (not the Vite default `main.tsx`). It mounts `<App />` into `#root` with `React.StrictMode`.

`index.html` loads Inter + JetBrains Mono fonts from Google Fonts and has a CDN importmap mapping several packages (`react`, `react-dom`, `lucide-react`, `diff`, `@google/genai`) to `aistudiocdn.com`.

`index.css` is the Tailwind CSS v4 entry point, imported by `index.tsx`. Custom theme tokens (brand colors, fonts) and `@custom-variant dark` for class-based dark mode are defined here.

## Architecture

### App Shell & Tool Switching

`App.tsx` is the central router. It maintains `activeToolId` state and renders tools dynamically by looking up the component from the `TOOLS` registry. Navbar receives `onSelectTool` to change tools.

**Key players:**
- `types.ts` — `ToolId` enum (17 values) and `ToolDefinition` interface (id, name, description, icon, component, category)
- `toolDefinitions.ts` — The `TOOLS` array: single source of truth for tool metadata and component registration
- `components/Navbar.tsx` — Renders category dropdowns from `TOOLS`, language switcher (en/zh), and theme toggle
- `components/ui/Layout.tsx` — Page wrapper; renders optional title/description then `children`

### Adding a New Tool

Must touch exactly 3 files:
1. Create `tools/NewTool.tsx`
2. Add entry to `ToolId` enum in `types.ts`
3. Add `ToolDefinition` with component import to `TOOLS` array in `toolDefinitions.ts`

### Shared Components

- **`CodeEditor`** (`components/CodeEditor.tsx`) — Monaco Editor wrapper used by most tools. Exposes `CodeEditorRef` via `forwardRef` + `useImperativeHandle` for programmatic scroll/selection. Maps logical language names to Monaco IDs (json, sql, javascript, plaintext, etc.). Theme-aware (vs-dark / vs).
- **`useTheme`** (`hooks/useTheme.ts`) — Dark mode toggle. Reads initial value from localStorage → system preference. Toggles `dark` class on `<html>`. Persists to localStorage.
- **`useCopy`** (`hooks/useCopy.ts`) — Clipboard copy with feedback state. Accepts a `key` parameter to track multiple copy buttons independently.

### The Quick Preview Tool

`QuickPreview` is the default landing tool. It's a content auto-detection engine: paste anything and it runs detectors for JSON, SQL, timestamps, colors, JWTs, URL-encoded strings, Unicode escapes, Base64, number bases, text stats, hashes, and QR codes. Results are sorted by priority and displayed in cards. It also shows a grid of quick-link buttons to jump to other tools.

### i18n

Uses i18next with `LanguageDetector` for automatic language detection. Two locales: English (`en`) and Chinese (`zh`), loaded from `locales/`. Translation keys follow the pattern `tools.<toolId>.name` and `tools.<toolId>.description`. The navbar renders tool names via `t()`.

### Styling

Tailwind CSS v4 with `@tailwindcss/vite` plugin. Dark mode uses the `class` strategy via `@custom-variant dark`. Custom `brand` color palette (50–900), Inter sans font, JetBrains Mono for code. Custom scrollbar styles in `index.css`.

### Build Configuration

- Base path: `/devtool-station/` (for GitHub Pages deployment)
- Path alias: `@/*` → project root (configured in both `vite.config.ts` and `tsconfig.json`)
- Dev server configured on port 3000, host overridden to `127.0.0.1` by the npm script
