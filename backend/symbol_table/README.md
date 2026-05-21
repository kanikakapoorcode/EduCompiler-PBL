# Symbol table module

Implementation package: **`backend/app/symbol_table/`**

| File | Role |
|------|------|
| `symbol_models.py` | `SymbolRecord`, API serialization |
| `scope_handler.py` | Nested scope stack (`global`, `block_N`) |
| `symbol_manager.py` | Token-stream builder |

API: `POST /symbol-table/build`  
Optional field on `POST /compile`: `symbolTable`
