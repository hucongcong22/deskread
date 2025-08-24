# deskread

An Electron application with Vue and TypeScript for reading novels.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Project Structure

This project follows a standard Electron application structure with three main processes:

- `src/main`: Main process code
- `src/preload`: Preload scripts for secure IPC
- `src/renderer`: Renderer process code (Vue application)

For detailed information about the project structure and development guidelines, please refer to [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Core Features

- Novel bookshelf management
- Add, edit, and remove novels from your collection
- Data persistence using localStorage
- Responsive UI design

## Technology Stack

- Electron
- Vue 3 + TypeScript
- Vite
- ESLint + Prettier for code quality
