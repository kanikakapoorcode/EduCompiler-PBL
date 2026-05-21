"""
Lexer — finite-state style scanner using regex token patterns.
Phase: Lexical Analysis
"""

import re

from app.compiler.lexical.tokens import KEYWORDS, Token


TOKEN_SPEC: list[tuple[str, str]] = [
    ("COMMENT", r"//[^\n]*"),
    ("WHITESPACE", r"[ \t]+"),
    ("NEWLINE", r"\n"),
    ("NUMBER", r"\d+(\.\d+)?"),
    ("IDENTIFIER", r"[a-zA-Z_][a-zA-Z0-9_]*"),
    ("OPERATOR", r"==|!=|<=|>=|[+\-*/=<>!]"),
    ("DELIMITER", r"[();,{}]"),
]


class Lexer:
    """Scans source text and produces a token stream."""

    def __init__(self, source: str) -> None:
        self.source = source
        self._pattern = re.compile(
            "|".join(f"(?P<{name}>{pat})" for name, pat in TOKEN_SPEC)
        )

    def scan(self) -> list[Token]:
        tokens: list[Token] = []
        line, column, pos = 1, 1, 0
        src = self.source

        while pos < len(src):
            match = self._pattern.match(src, pos)
            if not match:
                raise ValueError(
                    f"Unexpected character '{src[pos]}' at line {line}, column {column}"
                )

            kind = match.lastgroup or ""
            value = match.group()
            pos = match.end()

            if kind == "NEWLINE":
                line += 1
                column = 1
                continue
            if kind in ("WHITESPACE", "COMMENT"):
                column += len(value)
                continue

            token_type = kind
            if kind == "IDENTIFIER":
                token_type = "KEYWORD" if value in KEYWORDS else "IDENTIFIER"

            tokens.append(Token(token_type, value, line, column))
            column += len(value)

        return tokens
