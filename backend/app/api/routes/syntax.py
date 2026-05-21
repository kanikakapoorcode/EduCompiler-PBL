from fastapi import APIRouter

from app.compiler.lexical.tokens import Token
from app.compiler.syntax.analyzer import SyntaxAnalyzer
from app.models.requests import SyntaxRequest
from app.models.responses import SyntaxResponse

router = APIRouter()
_analyzer = SyntaxAnalyzer()


@router.post("/analyze", response_model=SyntaxResponse)
def analyze_syntax(request: SyntaxRequest) -> SyntaxResponse:
    """
    **Syntax Analysis** — validate grammar and build parse tree.

    - Runs lexer if tokens not provided
    - Detects syntax errors with suggestions
    - Returns hierarchical parse tree for visualization
    """
    tokens: list[Token] | None = None
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

    return _analyzer.analyze(request.source, tokens=tokens)
