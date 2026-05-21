"""Backward compatibility — use app.compiler.lexical."""

from app.compiler.lexical import Lexer, LexicalAnalyzer, Token, token_to_dict

# Legacy API
from app.compiler.lexical.lexer import Lexer as _Lexer
from app.compiler.lexical.tokens import Token as _Token


def tokenize(source: str) -> list[_Token]:
    return _Lexer(source).scan()


def tokens_to_dicts(tokens: list[_Token]) -> list[dict]:
    return [t.to_dict() for t in tokens]


__all__ = ["Lexer", "LexicalAnalyzer", "Token", "tokenize", "tokens_to_dicts", "token_to_dict"]
