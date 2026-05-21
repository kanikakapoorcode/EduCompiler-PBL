"""Backward compatibility — use app.compiler.syntax."""

from app.compiler.lexical.tokens import Token
from app.compiler.syntax.parser import SyntaxParser


def build_parse_tree(tokens: list[Token], has_errors: bool) -> dict:
    return SyntaxParser(tokens, has_errors).parse()


__all__ = ["build_parse_tree", "SyntaxParser"]
