"""
Lexical analyzer — orchestrates scanning and reports lexical-phase results.
"""

from app.compiler.lexical.lexer import Lexer
from app.compiler.lexical.tokens import Token, token_to_dict
from app.models.responses import ErrorModel, LexicalResponse, TokenModel


class LexicalAnalyzer:
    """Runs lexical analysis on source code."""

    def analyze(self, source: str) -> LexicalResponse:
        logs = ["Phase 1: Lexical Analysis — initializing scanner"]
        errors: list[ErrorModel] = []

        try:
            lexer = Lexer(source)
            tokens = lexer.scan()
            logs.append(f"Scan complete: {len(tokens)} tokens produced")

            token_models = [TokenModel(**token_to_dict(t)) for t in tokens]

            return LexicalResponse(
                status="success",
                tokens=token_models,
                token_count=len(token_models),
                errors=errors,
                logs=logs,
            )
        except ValueError as exc:
            logs.append("Lexical analysis failed")
            errors.append(
                ErrorModel(
                    line=1,
                    column=1,
                    message=str(exc),
                    suggestion="Remove or fix invalid characters in source",
                    severity="error",
                )
            )
            return LexicalResponse(
                status="error",
                tokens=[],
                token_count=0,
                errors=errors,
                logs=logs,
            )

    @staticmethod
    def scan_tokens(source: str) -> list[Token]:
        """Convenience: return raw Token list (raises on lexical error)."""
        return Lexer(source).scan()
