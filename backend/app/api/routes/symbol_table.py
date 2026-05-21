from fastapi import APIRouter

from app.compiler.lexical.analyzer import LexicalAnalyzer
from app.compiler.lexical.tokens import Token
from app.models.requests import SymbolTableRequest
from app.models.responses import SymbolTableEntryModel, SymbolTableResponse
from app.symbol_table.symbol_manager import SymbolManager

router = APIRouter()
_lexer = LexicalAnalyzer()
_manager = SymbolManager()


@router.post("/build", response_model=SymbolTableResponse)
def build_symbol_table(request: SymbolTableRequest) -> SymbolTableResponse:
    """
    **Symbol table generation** — identifiers, types, scope, initialization.

    Consumes token stream only; does not invoke the parser.
    """
    logs = ["Building symbol table from token stream"]

    try:
        if request.tokens:
            tokens = [
                Token(
                    type=t["type"],
                    value=t["value"],
                    line=t["line"],
                    column=t["column"],
                )
                for t in request.tokens
            ]
            logs.append(f"Using {len(tokens)} provided tokens")
        else:
            tokens = _lexer.scan_tokens(request.source)
            logs.append(f"Lexical scan: {len(tokens)} tokens")

        raw = _manager.build_from_tokens(tokens)

        if not raw:
            return SymbolTableResponse(
                status="empty",
                symbol_table=[],
                symbol_count=0,
                logs=logs + ["No symbols found (empty or unparseable input)"],
            )

        entries = [SymbolTableEntryModel(**row) for row in raw]
        logs.append(f"Symbol table built: {len(entries)} entries")

        return SymbolTableResponse(
            status="success",
            symbol_table=entries,
            symbol_count=len(entries),
            logs=logs,
        )
    except ValueError as exc:
        return SymbolTableResponse(
            status="error",
            symbol_table=[],
            symbol_count=0,
            logs=logs + [f"Lexical failure: {exc}"],
        )
    except Exception:
        return SymbolTableResponse(
            status="empty",
            symbol_table=[],
            symbol_count=0,
            logs=logs + ["Symbol table unavailable (graceful fallback)"],
        )
