# EduCompiler Backend

FastAPI service with separate **lexical** and **syntax** analysis phases.

## Structure

```
backend/
├── main.py                      # FastAPI app entry
├── requirements.txt
├── setup.ps1
├── app/
│   ├── config.py                # Settings (CORS, host, port)
│   ├── api/
│   │   ├── router.py            # Aggregates all routes
│   │   └── routes/
│   │       ├── health.py        # GET /, GET /health
│   │       ├── lexical.py       # POST /lexical/analyze
│   │       ├── syntax.py        # POST /syntax/analyze
│   │       ├── semantic.py      # POST /semantic/analyze
│   │       └── compile.py       # POST /compile
│   ├── models/
│   │   ├── requests.py
│   │   └── responses.py
│   ├── compiler/                # Lexer & parser (unchanged)
│   │   ├── pipeline.py
│   │   ├── lexical/
│   │   ├── syntax/
│   │   └── errors/
│   ├── semantic/                # Semantic error detection
│   │   ├── semantic_rules.py
│   │   └── semantic_analyzer.py
│   └── symbol_table/            # Symbol table generation (export)
│       ├── symbol_models.py
│       ├── scope_handler.py
│       └── symbol_manager.py
```

## Setup

```powershell
.\setup.ps1
.\venv\Scripts\python.exe main.py
```

Docs: http://localhost:8000/docs

## API Endpoints

### `POST /lexical/analyze` — Lexical Analysis

```json
{ "source": "int x = 10;" }
```

Response: token stream, token count, lexical errors.

### `POST /syntax/analyze` — Syntax Analysis

```json
{ "source": "int x = 10;" }
```

Optional pre-tokenized input:

```json
{
  "source": "int x = 10;",
  "tokens": [{ "type": "KEYWORD", "value": "int", "line": 1, "column": 1 }]
}
```

Response: parse tree, syntax errors, suggestions.

### `POST /semantic/analyze` — Semantic Analysis

```json
{ "source": "int x = 10;\nprint(y);" }
```

Response:

```json
{
  "phase": "semantic",
  "status": "error",
  "semanticErrors": [
    {
      "line": 2,
      "column": 7,
      "message": "Variable 'y' not declared.",
      "code": "UNDECLARED_VARIABLE"
    }
  ],
  "logs": []
}
```

Detects: undeclared variables, duplicate declarations, type mismatches, scope/use-before-decl, invalid keyword usage.

### `POST /compile` — Full Pipeline

Runs lexical → syntax → **semantic (optional)** → response.

```json
{ "source": "int x = 10;", "enable_semantic": true }
```

Response includes `semanticErrors` array (separate from syntax `errors`).

### `POST /symbol-table/build` — Symbol Table

```json
{ "source": "int x = 10;\nint y = 20;" }
```

Response:

```json
{
  "phase": "symbol_table",
  "status": "success",
  "symbolTable": [
    {
      "identifier": "x",
      "type": "int",
      "scope": "global",
      "line": 1,
      "declared": true,
      "initialized": true,
      "assignedValue": "10",
      "status": "initialized"
    }
  ],
  "symbolCount": 2
}
```

`POST /compile` also returns `symbolTable` when `enable_symbol_table: true` (default).

## Phase Flow

```
Source Code
    → Lexer.scan()           [lexical/lexer.py]
    → LexicalAnalyzer        [lexical/analyzer.py]
    → SyntaxErrorDetector    [errors/detector.py]
    → SyntaxParser.parse()   [syntax/parser.py]
    → SyntaxAnalyzer         [syntax/analyzer.py]
    → CompileResponse
```
