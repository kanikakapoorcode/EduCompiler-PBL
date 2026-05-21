from fastapi import APIRouter

from app.compiler.lexical.analyzer import LexicalAnalyzer
from app.models.requests import LexicalRequest
from app.models.responses import LexicalResponse

router = APIRouter()
_analyzer = LexicalAnalyzer()


@router.post("/analyze", response_model=LexicalResponse)
def analyze_lexical(request: LexicalRequest) -> LexicalResponse:
    """
    **Lexical Analysis** — scan source and return token stream.

    - Tokenizes keywords, identifiers, operators, numbers, delimiters
    - Reports lexical errors (invalid characters)
    """
    return _analyzer.analyze(request.source)
