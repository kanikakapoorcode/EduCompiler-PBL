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
│   │       └── compile.py       # POST /compile
│   ├── models/
│   │   ├── requests.py          # CompileRequest, LexicalRequest, SyntaxRequest
│   │   └── responses.py         # TokenModel, LexicalResponse, SyntaxResponse, ...
│   └── compiler/
│       ├── pipeline.py          # Full compile orchestration
│       ├── lexical/
│       │   ├── tokens.py        # Token, KEYWORDS, TokenType
│       │   ├── lexer.py         # Lexer.scan()
│       │   └── analyzer.py      # LexicalAnalyzer.analyze()
│       ├── syntax/
│       │   ├── ast.py           # ASTNode
│       │   ├── parser.py        # SyntaxParser.parse()
│       │   └── analyzer.py      # SyntaxAnalyzer.analyze()
│       └── errors/
│           └── detector.py      # SyntaxErrorDetector.detect()
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

### `POST /compile` — Full Pipeline

Runs lexical → syntax → error detection (same as frontend expects).

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
