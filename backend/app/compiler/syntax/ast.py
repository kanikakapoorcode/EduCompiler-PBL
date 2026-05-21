"""AST / parse tree node representation."""

from dataclasses import dataclass, field


@dataclass
class ASTNode:
    id: str
    label: str
    children: list["ASTNode"] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "label": self.label,
            "children": [c.to_dict() for c in self.children],
        }
