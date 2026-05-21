# EduCompiler

[![Repository](https://img.shields.io/badge/GitHub-EduCompiler--PBL-blue)](https://github.com/kanikakapoorcode/EduCompiler-PBL)

**Intelligent Syntax Error Detection & Compiler Phase Visualization System**

## Repository

**https://github.com/kanikakapoorcode/EduCompiler-PBL**

```bash
git clone https://github.com/kanikakapoorcode/EduCompiler-PBL.git
cd EduCompiler-PBL
```

An interactive educational platform where users write code in a mini programming language and visually observe compiler phases: lexical analysis, token generation, syntax analysis, parse tree construction, and intelligent error suggestions.

## Tech Stack

| Layer    | Technologies                                              |
| -------- | --------------------------------------------------------- |
| Frontend | Next.js (App Router), React, Tailwind CSS, Framer Motion  |
| Editor   | Monaco Editor                                             |
| Viz      | React Flow, Lucide Icons                                  |
| Backend  | Python FastAPI                                            |

## Project Structure

```
educompiler/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── workspace/        # IDE workspace
│   │   └── globals.css
│   ├── components/
│   │   ├── landing/          # Hero, features, pipeline viz
│   │   ├── workspace/        # Monaco editor
│   │   ├── compiler/         # Pipeline, tokens, tree, errors
│   │   └── ui/               # GlassCard, Button
│   └── lib/
│       ├── api.ts            # API client + mock fallback
│       ├── mock-data.ts      # Dummy compiler outputs
│       └── types.ts
├── backend/
│   ├── main.py               # FastAPI entry
│   ├── README.md             # Backend API docs
│   └── app/
│       ├── api/routes/       # /lexical, /syntax, /compile
│       ├── models/           # Pydantic schemas
│       └── compiler/
│           ├── lexical/      # Lexer + LexicalAnalyzer
│           ├── syntax/       # Parser + SyntaxAnalyzer
│           ├── errors/       # SyntaxErrorDetector
│           └── pipeline.py   # Full compile
└── README.md
```

## Quick Start

### One command (Windows)

```powershell
.\start-dev.ps1
```

Starts backend on port 8000 and frontend on port 3000.

### Frontend only

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

**First time (Windows):**

```powershell
cd backend
.\setup.ps1
```

**Run server** (always use the venv Python):

```powershell
cd backend
.\venv\Scripts\python.exe main.py
```

If you see `ModuleNotFoundError: No module named 'fastapi'`, you ran `python main.py` without the venv — use the command above.

API: [http://localhost:8000](http://localhost:8000)

### Environment (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK=true   # set false to require live API
```

**Workspace shortcuts:** `Ctrl+Enter` to compile · console shows live phase logs and suggestions

## Features

- **Landing page** — Hero, animated compiler pipeline, feature cards
- **Workspace** — Split Monaco editor + visualization panels
- **Pipeline animation** — Glowing active phases with data-flow transitions
- **Token stream** — Animated token cards by type
- **Parse tree** — React Flow interactive diagram
- **Error panel** — Line/column errors with intelligent suggestions
- **Console** — Compilation logs and status

## Sample Language

```c
int x = 10;
int y = 20;
int sum = x + y;
print(sum);
```

Remove semicolons to trigger syntax errors and see suggestions.

## API

| Endpoint | Phase |
|----------|--------|
| `POST /lexical/analyze` | Lexical analysis only (tokens) |
| `POST /syntax/analyze` | Syntax analysis + parse tree |
| `POST /compile` | Full pipeline |

```json
{ "source": "int x = 10;" }
```

Interactive docs: http://localhost:8000/docs

## License

Educational / academic use.
