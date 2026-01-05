# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevTool Station is a comprehensive web-based developer toolkit that provides multiple utility tools in a single interface. It's built as a React application using Vite as the build tool, featuring a sidebar navigation that allows users to switch between different developer tools.

## Architecture

- **Main Application**: Located in `App.tsx`, uses a tool-switching architecture with 19 different developer tools
- **Components**: UI components in the `components/` directory, including:
  - `Navbar.tsx`: Top navigation bar
  - `Sidebar.tsx`: Tool definitions and navigation (deprecated component but contains tool definitions)
  - `ui/`: Shared UI components
  - `CodeEditor.tsx`: Advanced text editor component using Monaco Editor
- **Tools**: Individual tool implementations in the `tools/` directory, each representing a specific developer utility
- **Types**: Centralized TypeScript definitions in `types.ts`

## Available Developer Tools

The application includes these tools categorized by functionality:

**Formatters:**
- JSON Formatter (`tools/JsonFormatter.tsx`)
- SQL Formatter (`tools/SqlFormatter.tsx`)
- Diff Viewer (`tools/DiffViewer.tsx`)

**Converters:**
- Base64 Converter (`tools/Base64Tool.tsx`)
- URL Encoder (`tools/UrlEncoder.tsx`)
- Timestamp Tool (`tools/TimestampTool.tsx`)
- Unicode Converter (`tools/UnicodeConverter.tsx`)
- JWT Decoder (`tools/JwtDecoder.tsx`)
- Number Base Converter (`tools/NumberBase.tsx`)

**Generators:**
- UUID Generator (`tools/UuidGenerator.tsx`)
- Hash Generator (`tools/HashGenerator.tsx`)
- Color Tools (`tools/ColorTool.tsx`, `tools/FullscreenColor.tsx`)
- Random String Generator (`tools/RandomStringGenerator.tsx`)
- QR Code Generator (`tools/QrCodeGenerator.tsx`)

**General:**
- Quick Preview (`tools/QuickPreview.tsx`) - default tool that auto-detects content
- Text Inspector (`tools/TextInspector.tsx`)
- Various other utilities

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on http://localhost:3000)
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally

## Key Dependencies

- React 19.2.0 - Frontend library
- Vite 6.2.0 - Build tool and development server
- Monaco Editor - Advanced code editing component
- Lucide React - Icon library
- i18next - Internationalization support
- Various utility libraries for different tool functionalities

## Project Structure

```
.
├── App.tsx                 # Main application component with tool switching logic
├── components/             # UI components and shared elements
│   ├── CodeEditor.tsx      # Monaco-based code editor component
│   ├── Navbar.tsx          # Navigation component
│   ├── Sidebar.tsx         # Tool definitions (deprecated component)
│   └── ui/                 # Reusable UI components
├── tools/                  # Individual developer tools (19 tools)
├── types.ts                # Central type definitions
├── i18n.ts                 # Internationalization setup
├── locales/                # Translation files
├── public/                 # Static assets
└── vite.config.ts          # Build configuration
```

## Internationalization

The application supports internationalization using i18next. Translation files are located in the `locales/` directory.

## Build Configuration

- Base path: `/devtool-station/`
- Development server runs on port 3000
- Hosted at `0.0.0.0` for network accessibility
- Path aliases configured: `@/*` maps to project root