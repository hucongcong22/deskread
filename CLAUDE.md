# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Electron application built with Vue 3 and TypeScript. It uses electron-vite as the build tool, which provides hot reloading and fast builds for Electron applications.

## Project Structure

- `src/main/` - Main process code (Electron's main process)
- `src/preload/` - Preload scripts (bridge between main and renderer processes)
- `src/renderer/` - Renderer process code (Vue application)
- `resources/` - Application resources like icons

## Common Commands

### Development

```bash
# Install dependencies
npm install

# Start development server with hot reloading
npm run dev
```

### Building

```bash
# Build for current platform
npm run build

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

### Testing & Quality

```bash
# Run type checking for both Node and Web environments
npm run typecheck

# Run type checking for Node environment
npm run typecheck:node

# Run type checking for Web environment
npm run typecheck:web

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Architecture

This is a standard Electron application with three main processes:

1. **Main Process** (`src/main/index.ts`): Controls the application lifecycle, creates browser windows, and handles system events.
2. **Preload Process** (`src/preload/index.ts`): Runs in a separate context between the main and renderer processes, exposing Electron APIs to the renderer securely.
3. **Renderer Process** (`src/renderer/`): The Vue 3 application that runs in the browser window.

Communication between processes is handled through Electron's IPC (Inter-Process Communication) mechanisms.

## Key Dependencies

- Electron for cross-platform desktop application framework
- Vue 3 for the frontend framework
- TypeScript for type safety
- Vite for fast development and building
- electron-vite for Electron-specific Vite configuration
- element-plus
- element-plus/icon-vue

## Communication Rules

- Always respond in Chinese when communicating with users
- Use clear and concise language
- Provide technical details when relevant but avoid unnecessary complexity
