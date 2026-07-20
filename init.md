# init-project — Production Setup Handbook

> **Purpose:** This is the permanent, repeatable engineering handbook for initializing `init-project` — a production-grade MERN-style monorepo (React + Express + PostgreSQL + Prisma + TypeScript). Follow it top to bottom on a clean machine to reach a fully working local dev environment.

**Stack:** Node.js 22 LTS · npm 10+ · Express 5 · TypeScript 5 · Prisma 6 · PostgreSQL 18 · React 19 · Vite 7 · ESLint 9 · Prettier 3

**Repo layout:** Monorepo — `/server` and `/client` in a single Git repository.

---

## Table of Contents

1. Introduction
2. Software Requirements
3. VS Code Setup
4. Create Project
5. server Initialization
6. TypeScript
7. server Folder Structure
8. Express Setup
9. Environment Variables
10. PostgreSQL
11. Prisma
12. Error Handling
13. Logging
14. ESLint
15. Prettier
16. React Setup
17. React Folder Structure
18. Axios
19. Scripts
20. Development Workflow
21. Git Workflow
22. First Run Checklist
23. Common Errors
24. Useful Commands
25. Final Folder Structure

---

## 1. Introduction

### Purpose

`init-project` is the reference blueprint used for every new project — college submissions, hackathons, freelance builds, and portfolio pieces. It removes decision fatigue: every setup decision (folder layout, error handling, linting, env management) is made once here and reused every time.

### Architecture

```
┌────────────┐      HTTPS/JSON      ┌────────────┐      SQL      ┌────────────┐
│   React    │ ───────────────────► │  Express   │ ─────────────►│ PostgreSQL │
│  (Vite)    │ ◄─────────────────── │ (TS + API) │ ◄─────────────│  (Prisma)  │
└────────────┘                      └────────────┘               └────────────┘
  client/                            server/                   Docker/local
```

- **client** — React 19 + Vite 7 + TypeScript. Talks to the server only through a typed Axios client.
- **server** — Express 5 + TypeScript, layered into routes → controllers → services → repositories.
- **Database** — PostgreSQL 18, accessed exclusively through Prisma 6 (no raw SQL scattered in code).

### Development Workflow (high level)

1. Start PostgreSQL.
2. Run server in watch mode (`npm run dev`).
3. Run client in watch mode (`npm run dev`).
4. server exposes REST API on `http://localhost:5000`.
5. client consumes it on `http://localhost:5173`.

### Folder Philosophy

> **Rule of thumb:** a file's folder should tell you its *responsibility*, not its *file type*. `controllers/` handles HTTP, `services/` handles business logic, `repositories/` handles data access. Nothing else is allowed to touch Prisma directly except repositories.

---

## 2. Software Requirements

| Tool | Minimum Version | Download |
|---|---|---|
| Node.js | 22 LTS | https://nodejs.org |
| npm | 10+ | bundled with Node |
| Git | 2.40+ | https://git-scm.com |
| VS Code | Latest | https://code.visualstudio.com |
| PostgreSQL | 18 | https://www.postgresql.org/download |

### System Requirements
- Windows 10/11, macOS 12+, or Linux
- 8 GB RAM minimum (16 GB recommended)
- 5 GB free disk space

### Verification Commands

```bash
node -v
npm -v
git --version
psql --version
```

**Expected output (example):**
```
v22.x.x
10.x.x
git version 2.4x.x
psql (PostgreSQL) 18.x
```

> **Warning:** If `node -v` shows anything below v22, reinstall Node using the official LTS installer — do not use an OS package manager version, it's frequently outdated.

### PATH Verification (Windows)

If any command above says "not recognized":
1. Reinstall the tool and ensure "Add to PATH" is checked.
2. Or manually add the install directory to **System Properties → Environment Variables → Path**.
3. Restart the terminal after any PATH change.

---

## 3. VS Code Setup

### Required Extensions

| Extension | Purpose |
|---|---|
| ESLint | Inline lint errors |
| Prettier - Code formatter | Auto formatting |
| Prisma | `.prisma` syntax highlighting |
| PostgreSQL (by Chris Kolkman) | DB browsing inside VS Code |
| GitLens | Git blame/history inline |
| Error Lens | Inline error/warning highlighting |

### Recommended `settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.autoSave": "onFocusChange",
  "typescript.tsdk": "node_modules/typescript/lib",
  "git.autofetch": true,
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

> **Tip:** `editor.codeActionsOnSave` auto-fixes lint issues on every save — combined with Prettier this keeps the codebase clean without manual effort.

---

## 4. Create Project

```bash
mkdir init-project
cd init-project
git init
```

Create top-level files:

```bash
touch README.md init.md .gitignore
mkdir server client
```

### Root `.gitignore`

```gitignore
# Dependencies
node_modules/

# Env
.env
.env.local
.env.*.local

# Build output
dist/
build/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/*
!.vscode/settings.json

# Prisma
server/prisma/dev.db
```

### Folder Purpose

| Folder/File | Responsibility |
|---|---|
| `/server` | Express + TypeScript + Prisma API |
| `/client` | React + Vite client |
| `README.md` | Human-facing quickstart |
| `init.md` | This handbook — permanent setup reference |
| `.gitignore` | Root-level ignore rules (both projects) |

---

## 5. server Initialization

```bash
cd server
npm init -y
```

### Runtime Dependencies

```bash
npm install express@5 cors helmet morgan dotenv http-errors
```

| Package | Why |
|---|---|
| `express` | HTTP server & routing |
| `cors` | Controlled cross-origin access for the client |
| `helmet` | Sets secure HTTP headers by default |
| `morgan` | Request logging |
| `dotenv` | Loads `.env` into `process.env` |
| `http-errors` | Standardized HTTP error objects |
| `@prisma/client` | Type-safe DB client generated from schema |

### Development Dependencies

```bash
npm install -D typescript@5.9.2 ts-node-dev @types/node @types/express @types/cors @types/morgan eslint prettier 
```

### Prisma Dependencies
```bash
npm install prisma@6.19.3 --save-dev 
npm install @prisma/client@6.19.3
```

| Package | Why |
|---|---|
| `typescript` | Compiler |
| `ts-node-dev` | Hot-reload TS execution in dev |
| `@types/*` | Type definitions for JS-only packages |
| `prisma` | CLI for migrations/generation |
| `eslint` / `prettier` | Lint + format |

> **Note:** Always pin exact versions in production (`npm install express@5.0.1` style) once the stack is finalized, to avoid silent breaking changes on fresh installs.

---

## 6. TypeScript

```bash
npx tsc --init
```

### `server/tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "declaration": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Key Compiler Options Explained

| Option | Meaning |
|---|---|
| `strict` | Enables all strict type-checking flags — non-negotiable for production code |
| `NodeNext` (module/moduleResolution) | Matches modern Node ESM/CJS interop behavior |
| `rootDir` / `outDir` | Keeps source and compiled output cleanly separated |
| `noImplicitAny` | Forces explicit typing, prevents silent `any` leaks |
| `sourceMap` | Enables debugging compiled JS back to original TS |
| `esModuleInterop` | Allows clean `import express from 'express'` syntax |
| `skipLibCheck` | Skips type-checking `.d.ts` files for faster builds |

---

## 7. server Folder Structure

```
server/
├── src/
│   ├── config/          # env loading, db client, constants config
│   ├── controllers/     # HTTP request/response handling only
│   ├── services/        # business logic
│   ├── repositories/    # Prisma queries live ONLY here
│   ├── middlewares/     # auth, error handler, validation
│   ├── routes/          # route definitions, wire controllers
│   ├── validators/      # request schema validation
│   ├── interfaces/      # shared TS interfaces
│   ├── types/           # global/custom type declarations
│   ├── utils/           # pure helper functions
│   ├── constants/       # enums, fixed values
│   ├── app.ts           # express app assembly
│   └── server.ts        # server bootstrap/listen
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
├── .env.example
├── tsconfig.json
└── package.json
```

### Responsibility Table

| Folder | Responsibility | Never Contains |
|---|---|---|
| `controllers/` | Parse req, call service, send res | Business logic, DB calls |
| `services/` | Orchestrate business rules | Express `req`/`res` objects |
| `repositories/` | All Prisma calls | Business logic |
| `middlewares/` | Cross-cutting concerns | Route-specific logic |
| `validators/` | Input shape/type validation | DB access |

---

## 8. Express Setup

### `src/app.ts`

```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const app = express();

// --- Middleware order matters ---
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// --- Routes go here ---
// app.use("/api/v1/users", userRoutes);

// --- 404 + Global error handler (always LAST) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
```

### `src/server.ts`

```ts
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### Why This Middleware Order

1. `helmet()` first — secure headers on every response, no exceptions.
2. `cors()` before parsers — rejects disallowed origins early.
3. `morgan()` — logs every request that gets this far.
4. Body parsers — only needed for routes, applied before routes.
5. Routes.
6. `notFoundHandler` — catches unmatched routes.
7. `errorHandler` — always the final middleware; catches everything thrown above it.

---

## 9. Environment Variables

### `.env` (never committed)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://init_user:init_pass@localhost:5432/init_project_db"
CLIENT_URL="http://localhost:5173"
```

### `.env.example` (committed — no real secrets)

```env
PORT=
NODE_ENV=
DATABASE_URL=
CLIENT_URL=
```

### Naming Conventions
- `UPPER_SNAKE_CASE` for all variables.
- Prefix nothing with `VITE_` on the server (that's client-only, see Section 16).

> **Warning:** `.env` must be in `.gitignore` (already added in Section 4). A leaked `DATABASE_URL` is a full database compromise.

### Environment Validation (recommended pattern)

```ts
// src/config/env.ts
const required = ["DATABASE_URL", "PORT", "CLIENT_URL"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  port: process.env.PORT!,
  databaseUrl: process.env.DATABASE_URL!,
  clientUrl: process.env.CLIENT_URL!,
};
```

---

## 10. PostgreSQL

### Installation
Install PostgreSQL 18 from the official installer, keep default port `5432`.

### Create Database & User

```sql
-- Run inside psql
CREATE DATABASE init_project_db;
CREATE USER init_user WITH ENCRYPTED PASSWORD 'init_pass';
GRANT ALL PRIVILEGES ON DATABASE init_project_db TO init_user;
```

### Verify Connection

```bash
psql -U init_user -d init_project_db -h localhost
```

**Expected:** drops you into a `init_project_db=>` prompt with no errors.

> **Note:** Never use these exact demo credentials in a real deployment — regenerate a strong password per environment.

---

## 11. Prisma

```bash
npx prisma init
```

This creates `prisma/schema.prisma` and a starter `.env`.

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
}
```

```bash
Next, choose how you want to set up your database:
CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.
CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.
```

### Validate & format schema
```bash
# Validate schema
npx prisma validate

# Format schema
npx prisma format
```


### Migration Workflow

```bash
npx prisma migrate dev --name init      # local development
npx prisma generate                     # regenerate Prisma Client
npx prisma studio                       # visual DB browser
npx prisma migrate reset                # wipe + reapply all migrations
```

### Test Connection
```bash
npx prisma db pull
```

### Production Migration

```bash
npx prisma migrate deploy
```

| Command | Local Dev | Production |
|---|---|---|
| `migrate dev` | ✅ creates + applies migrations | ❌ never use |
| `migrate deploy` | ❌ not needed | ✅ applies existing migrations only |

### Seeding

```ts
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({ data: { email: "admin@init-project.com", name: "Admin" } });
}

main().finally(() => prisma.$disconnect());
```

```json
// package.json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```

### Singleton PrismaClient

```ts
// src/config/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

> **Tip:** Never instantiate `new PrismaClient()` in more than one place — it exhausts the DB connection pool under hot-reload.

---

## 12. Error Handling

### `src/utils/HttpError.ts`

```ts
export class HttpError extends Error {
  constructor(public statusCode: number, message: string, public details?: unknown) {
    super(message);
    this.name = "HttpError";
  }
}
```

### Async Handler (avoids try/catch repetition)

```ts
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

### Global Error Middleware

```ts
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/HttpError.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Internal Server Error" });
}
```

### Standard Response Shape

```json
{ "success": true, "data": {} }
{ "success": false, "message": "Error text", "details": null }
```

### Error Category Table

| Category | Status Code | Source |
|---|---|---|
| Validation error | 400 | validators |
| Auth error | 401/403 | middlewares |
| Not found | 404 | notFoundHandler |
| DB constraint error | 409/500 | repositories, caught by errorHandler |
| Unknown/unhandled | 500 | errorHandler catch-all |

---

## 13. Logging

- **Development:** `morgan("dev")` — concise colored request logs.
- **Production:** switch to `morgan("combined")` piped into a file or log aggregator (never `console.log` for structured logs in prod).

```ts
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
```

> **Tip:** For real production systems, replace `console.error` in `errorHandler` with a structured logger (e.g. Pino/Winston) that outputs JSON logs — plain text doesn't scale with log aggregation tools.

---

## 14. ESLint

```bash
npm init @eslint/config@latest
```

### `eslint.config.js` (flat config)

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
    },
  },
];
```

### Scripts

```json
"scripts": {
  "lint": "eslint src --ext .ts",
  "lint:fix": "eslint src --ext .ts --fix"
}
```

| Rule | Why it matters |
|---|---|
| `no-unused-vars` | Catches dead code |
| `no-explicit-any` | Preserves type safety |
| `eqeqeq` (recommended) | Forces `===` over `==` |

---

## 15. Prettier

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

### `.prettierignore`

```
node_modules
dist
build
```

### Scripts

```json
"scripts": {
  "format": "prettier --write ."
}
```

Combined with `editor.formatOnSave` (Section 3), formatting is fully automatic.

---

## 16. React Setup

```bash
cd ../client
npm create vite@latest . -- --template react-ts
npm install
```

### Additional Packages

```bash
npm install axios react-router-dom
```

| Package | Why |
|---|---|
| `axios` | HTTP client with interceptor support |
| `react-router-dom` | Client-side routing |

---

## 17. React Folder Structure

```
client/
├── src/
│   ├── assets/         # images, fonts, static files
│   ├── components/     # reusable, dumb UI components
│   ├── hooks/          # custom React hooks
│   ├── layouts/        # page shells (Navbar+Outlet, etc.)
│   ├── pages/          # route-level components
│   ├── routes/         # router configuration
│   ├── services/       # feature-level business/data logic
│   ├── api/            # axios instance + endpoint functions
│   ├── context/         # React Context providers
│   ├── types/           # shared TS types/interfaces
│   └── utils/           # pure helper functions
├── .env
├── vite.config.ts
└── package.json
```

| Folder | Responsibility |
|---|---|
| `components/` | No data fetching, purely presentational where possible |
| `pages/` | Composed from components + hooks, tied to a route |
| `api/` | Only place `axios` is imported directly |
| `context/` | Global state (auth, theme) |

---

## 18. Axios

### `src/api/client.ts`

```ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // handle logout/redirect
    }
    return Promise.reject(error);
  },
);
```

### client `.env`

```env
VITE_API_URL="http://localhost:5000/api/v1"
```

> **Note:** Vite only exposes env vars prefixed with `VITE_` to client code — this is a security boundary, not a convention you can skip.

---

## 19. Scripts

### server `package.json`

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "lint": "eslint src --ext .ts",
  "format": "prettier --write .",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev"
}
```

### client `package.json`

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .ts,.tsx"
}
```

| Script | Purpose |
|---|---|
| `dev` | Hot-reload local development |
| `build` | Production compile/bundle |
| `start` | Run compiled production server |
| `preview` | Serve built client locally for a sanity check |

---

## 20. Development Workflow

```bash
# 1. Start PostgreSQL (service should already be running as a Windows service)

# 2. server
cd server
npm run prisma:generate
npm run dev

# 3. client (new terminal)
cd client
npm run dev

# 4. Run migrations after any schema.prisma change
npx prisma migrate dev --name <change_description>

# 5. Inspect data visually
npx prisma studio

# 6. Test API manually
curl http://localhost:5000/health
```

**Stopping servers:** `Ctrl + C` in each terminal.

---

## 21. Git Workflow

```bash
git add .
git commit -m "chore: initial project setup"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

### Branching

```bash
git checkout -b feature/user-auth
```

### Commit Naming (Conventional Commits)

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Tooling/config changes |
| `docs:` | Documentation only |
| `refactor:` | Code change, no behavior change |

### Pull Requests
- One feature per PR.
- Link the related issue/task.
- Require at least one review before merge on team projects.

---

## 22. First Run Checklist

- [ ] Node, npm, Git, PostgreSQL installed and verified
- [ ] VS Code extensions installed
- [ ] `server/.env` created from `.env.example`
- [ ] PostgreSQL database + user created
- [ ] `npx prisma migrate dev` run successfully
- [ ] `npx prisma generate` run successfully
- [ ] `npm run dev` (server) starts without errors
- [ ] `curl http://localhost:5000/health` returns `200 ok`
- [ ] `client/.env` created with `VITE_API_URL`
- [ ] `npm run dev` (client) starts without errors
- [ ] client loads in browser at `http://localhost:5173`
- [ ] ESLint and Prettier run clean on both projects

---

## 23. Common Errors

| # | Error | Cause | Fix |
|---|---|---|---|
| 1 | `ECONNREFUSED` on DB connect | PostgreSQL not running | Start the PostgreSQL service |
| 2 | `Port 5000 already in use` | Another process on that port | `npx kill-port 5000` or change `PORT` |
| 3 | `P1000: Authentication failed` | Wrong `DATABASE_URL` credentials | Recheck username/password in `.env` |
| 4 | `Cannot find module 'dotenv/config'` | Missing dotenv install | `npm install dotenv` |
| 5 | `Migration failed to apply` | Conflicting schema changes | `npx prisma migrate reset` (dev only) |
| 6 | `PrismaClient is not generated` | Forgot to run generate | `npx prisma generate` |
| 7 | Wrong Node version | Using Node <22 | Reinstall Node 22 LTS |
| 8 | ESLint not catching errors in VS Code | Extension not enabled/config missing | Reload window, verify `eslint.config.js` exists |
| 9 | React fails to reach server | Wrong `VITE_API_URL` or CORS blocked | Check `.env` and server `cors()` origin |
| 10 | CORS error in browser console | `CLIENT_URL` mismatch | Match exact origin including protocol/port |
| 11 | `tsc` compiles but `node dist/server.js` fails | Missing `"type": "module"` mismatch | Align `package.json` type with tsconfig module setting |
| 12 | `.env` values are `undefined` | `dotenv/config` imported after use | Import `dotenv/config` at the very top of `server.ts` |
| 13 | Prisma Studio shows empty tables | Migration not applied to the connected DB | Confirm `DATABASE_URL` points to the right DB |
| 14 | `npm install` fails with peer dep errors | Version mismatch | Use `npm install --legacy-peer-deps` cautiously, or align versions |
| 15 | Vite HMR not updating | Browser cache / stale dev server | Hard refresh, restart `npm run dev` |
| 16 | `EADDRINUSE` on client | Vite port taken | Vite auto-increments; or free the port |
| 17 | TypeScript `Cannot find name 'process'` | Missing `@types/node` | `npm install -D @types/node` |
| 18 | Prettier and ESLint fighting over formatting | No integration config | Add `eslint-config-prettier` to disable conflicting rules |
| 19 | `git push` rejected | Remote has commits you don't | `git pull --rebase` then push |
| 20 | `.env` committed by mistake | Missed `.gitignore` before first commit | `git rm --cached .env`, ensure `.gitignore` is correct |
| 21 | Axios request hangs forever | No `timeout` set, server down | Set `timeout` in axios instance, verify server is running |
| 22 | 401 loops infinitely on client | Interceptor redirect logic bug | Guard interceptor with a "already retried" flag |
| 23 | Prisma `Unique constraint failed` | Duplicate insert | Handle `P2002` error code explicitly in repository |
| 24 | `npm run build` fails on client, works in dev | Type errors only caught at build | Run `tsc -b` locally before pushing |
| 25 | Migration history diverges between teammates | Manual DB edits outside Prisma | Never edit DB schema manually — always via `migrate dev` |
| 26 | `helmet()` breaks some API responses | Overly strict default CSP for API-only server | Adjust `contentSecurityPolicy` config for pure JSON APIs |
| 27 | Server crashes on unhandled promise rejection | Missing `asyncHandler` wrapper | Wrap all async route handlers |
| 28 | `npx prisma migrate dev` prompts to reset | Schema drift detected | Review the diff carefully before confirming reset |
| 29 | Wrong `NODE_ENV` in production | `.env` not swapped per environment | Use environment-specific env injection, never a shared `.env` |
| 30 | VS Code shows red squiggles but code runs fine | TS server out of sync | `Ctrl+Shift+P` → "TypeScript: Restart TS Server" |

---

## 24. Useful Commands

```bash
# Node/npm
node -v
npm -v
npm install
npm run dev

# Git
git status
git add .
git commit -m "message"
git push
git pull --rebase
git checkout -b branch-name

# PostgreSQL
psql -U init_user -d init_project_db -h localhost
\dt                     # list tables (inside psql)
\q                      # quit psql

# Prisma
npx prisma init
npx prisma migrate dev --name <name>
npx prisma migrate deploy
npx prisma generate
npx prisma studio
npx prisma migrate reset

# Lint/Format
npm run lint
npm run lint:fix
npm run format

# Kill a stuck port (Windows/macOS/Linux via npx)
npx kill-port 5000
```

---

## 25. Final Folder Structure

```
init-project/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── env.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts
│   │   │   └── notFoundHandler.ts
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── interfaces/
│   │   ├── types/
│   │   ├── utils/
│   │   │   ├── HttpError.ts
│   │   │   └── asyncHandler.ts
│   │   ├── constants/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── .env
│   ├── .env.example
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── .prettierignore
│   ├── tsconfig.json
│   └── package.json
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── context/
│   │   ├── types/
│   │   └── utils/
│   ├── .env
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── README.md
├── init.md
└── .gitignore
```

---

**End of handbook.** Every project built from `init-project` should be able to reach a green "First Run Checklist" (Section 22) within 20 minutes on a clean machine.
