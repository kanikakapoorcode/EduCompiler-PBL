"""Token definitions for the EduCompiler mini-language."""

from dataclasses import dataclass
from enum import Enum


class TokenType(str, Enum):
    KEYWORD = "KEYWORD"
    IDENTIFIER = "IDENTIFIER"
    OPERATOR = "OPERATOR"
    NUMBER = "NUMBER"
    DELIMITER = "DELIMITER"
    STRING = "STRING"
    COMMENT = "COMMENT"


KEYWORDS = frozenset({
    "int",
    "float",
    "if",
    "else",
    "while",
    "for",
    "return",
    "print",
    "void",
    "true",
    "false",
})


@dataclass(frozen=True, slots=True)
class Token:
    type: str
    value: str
    line: int
    column: int

    def to_dict(self) -> dict:
        return {
            "type": self.type,
            "value": self.value,
            "line": self.line,
            "column": self.column,
        }


def token_to_dict(token: Token) -> dict:
    return token.to_dict()
