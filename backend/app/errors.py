"""Backward compatibility — use app.compiler.errors."""

from app.compiler.errors.detector import SyntaxErrorDetector
from app.compiler.lexical.tokens import Token


def detect_syntax_errors(tokens: list[Token], source: str) -> list[dict]:
    return SyntaxErrorDetector().detect(tokens, source)


__all__ = ["detect_syntax_errors", "SyntaxErrorDetector"]
