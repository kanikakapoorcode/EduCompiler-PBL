# Semantic module

Python package lives at **`backend/app/semantic/`** (import path: `app.semantic`).

| File | Role |
|------|------|
| `symbol_table.py` | Scope stack, declarations, lookups |
| `semantic_rules.py` | Undeclared, duplicate, type, scope rules |
| `semantic_analyzer.py` | Token-stream walker orchestration |

API: `POST /semantic/analyze`  
Included optionally in `POST /compile` via `enable_semantic: true`.
