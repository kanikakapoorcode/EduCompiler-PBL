from fastapi import APIRouter

from app.compiler.lexical.analyzer import LexicalAnalyzer
from app.compiler.lexical.tokens import Token
from app.models.requests import SemanticRequest
from app.models.responses import SemanticErrorModel, SemanticResponse
from app.semantic.semantic_analyzer import SemanticAnalyzer

router = APIRouter()
_lexer = LexicalAnalyzer()
_analyzer = SemanticAnalyzer()


@router.post("/analyze", response_model=SemanticResponse)
def analyze_semantic(request: SemanticRequest) -> SemanticResponse:
    """
    **Semantic Analysis** — symbol table, undeclared variables, types, scope.

    Uses lexer token stream only; does not invoke parser rewrite.
    """
    logs = ["Phase 3: Semantic Analysis — building symbol table"]

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
        else:
            tokens = _lexer.scan_tokens(request.source)
            logs.append(f"Lexical pass: {len(tokens)} tokens")

        raw_errors = _analyzer.analyze(tokens, request.source)
        models = [SemanticErrorModel(**e) for e in raw_errors]

        has_error = any(m.severity == "error" for m in models)
        status = "error" if has_error else ("warning" if models else "success")
        logs.append(f"Semantic check finished: {len(models)} diagnostic(s)")

        return SemanticResponse(
            status=status,
            semantic_errors=models,
            logs=logs,
        )
    except ValueError as exc:
        return SemanticResponse(
            status="error",
            semantic_errors=[
                SemanticErrorModel(
                    line=1,
                    column=1,
                    message=str(exc),
                    code="LEXICAL_ERROR",
                )
            ],
            logs=logs + ["Semantic analysis aborted: lexical failure"],
        )
    except Exception:
        return SemanticResponse(
            status="warning",
            semantic_errors=[],
            logs=logs + ["Semantic analysis unavailable (graceful fallback)"],
        )
