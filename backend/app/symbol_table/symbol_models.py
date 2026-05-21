"""
Data models for symbol table generation (API export format).
Independent from semantic analysis internals.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class DeclarationStatus(str, Enum):
    DECLARED = "declared"
    INITIALIZED = "initialized"
    USED = "used"


@dataclass
class SymbolRecord:
    """Internal symbol record accumulated during token walk."""

    identifier: str
    type: str
    scope: str
    line: int
    column: int
    declared: bool = True
    initialized: bool = False
    assigned_value: str | None = None
    status: DeclarationStatus = DeclarationStatus.DECLARED
    references: list[int] = field(default_factory=list)

    def to_api_dict(self) -> dict[str, Any]:
        """Serialize to public JSON shape."""
        out: dict[str, Any] = {
            "identifier": self.identifier,
            "type": self.type,
            "scope": self.scope,
            "line": self.line,
            "column": self.column,
            "declared": self.declared,
            "initialized": self.initialized,
            "status": self.status.value,
        }
        if self.assigned_value is not None:
            out["assignedValue"] = self.assigned_value
        if self.references:
            out["referenceLines"] = self.references
        return out


def empty_symbol_table_response() -> list[dict]:
    """Fallback when generation fails or source is empty."""
    return []
