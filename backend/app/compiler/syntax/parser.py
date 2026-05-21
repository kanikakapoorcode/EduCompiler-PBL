"""
Syntax parser — builds a parse tree from a token stream.
Phase: Syntax Analysis / Parse Tree Construction
"""

from app.compiler.lexical.tokens import Token


class SyntaxParser:
    """Recursive-descent style parser for the EduCompiler mini-language."""

    def __init__(self, tokens: list[Token], has_errors: bool = False) -> None:
        self.tokens = tokens
        self.has_errors = has_errors
        self._node_id = 0

    def _next_id(self) -> str:
        self._node_id += 1
        return f"n{self._node_id}"

    def parse(self) -> dict:
        program_children: list[dict] = []
        i = 0

        while i < len(self.tokens):
            t = self.tokens[i]

            if t.type == "KEYWORD" and t.value in ("int", "float", "void"):
                i, node = self._parse_declaration(i)
                program_children.append(node)
                continue

            if t.type == "KEYWORD" and t.value == "print":
                i, node = self._parse_print(i)
                program_children.append(node)
                continue

            i += 1

        return {
            "id": "program",
            "label": "Program" if not self.has_errors else "Program (partial)",
            "children": program_children,
        }

    def _parse_declaration(self, i: int) -> tuple[int, dict]:
        t = self.tokens[i]
        decl_id = self._next_id()
        children: list[dict] = [
            {"id": self._next_id(), "label": f"Type: {t.value}", "children": []},
        ]
        i += 1

        if i < len(self.tokens) and self.tokens[i].type == "IDENTIFIER":
            children.append(
                {
                    "id": self._next_id(),
                    "label": f"Identifier: {self.tokens[i].value}",
                    "children": [],
                }
            )
            i += 1

        if i < len(self.tokens) and self.tokens[i].value == "=":
            i += 1
            i, init_node = self._parse_expression_until_semi(i)
            if init_node:
                label = (
                    "Initializer"
                    if not self.has_errors
                    else "Initializer (partial)"
                )
                children.append(
                    {"id": self._next_id(), "label": label, "children": init_node}
                )

        if i < len(self.tokens) and self.tokens[i].value == ";":
            i += 1

        label = "Declaration" if not self.has_errors else "Declaration (incomplete)"
        return i, {"id": decl_id, "label": label, "children": children}

    def _parse_expression_until_semi(self, i: int) -> tuple[int, list[dict]]:
        nodes: list[dict] = []
        while i < len(self.tokens) and self.tokens[i].value != ";":
            tok = self.tokens[i]
            if tok.type in ("IDENTIFIER", "NUMBER"):
                nodes.append(
                    {
                        "id": self._next_id(),
                        "label": f"{tok.type.title()}: {tok.value}",
                        "children": [],
                    }
                )
            elif tok.value == "+":
                rhs = "?"
                if i + 1 < len(self.tokens):
                    rhs = self.tokens[i + 1].value
                nodes = [
                    {
                        "id": self._next_id(),
                        "label": "BinaryExpr: +",
                        "children": nodes
                        + [
                            {
                                "id": self._next_id(),
                                "label": f"Identifier: {rhs}",
                                "children": [],
                            }
                        ],
                    }
                ]
            i += 1
        return i, nodes

    def _parse_print(self, i: int) -> tuple[int, dict]:
        stmt_id = self._next_id()
        inner: list[dict] = [{"id": self._next_id(), "label": "PrintStmt", "children": []}]
        i += 1

        if i < len(self.tokens) and self.tokens[i].value == "(":
            i += 1
        if i < len(self.tokens) and self.tokens[i].type == "IDENTIFIER":
            inner[0]["children"] = [
                {
                    "id": self._next_id(),
                    "label": f"Identifier: {self.tokens[i].value}",
                    "children": [],
                }
            ]
            i += 1

        while i < len(self.tokens) and self.tokens[i].value != ";":
            i += 1
        if i < len(self.tokens):
            i += 1

        return i, {"id": stmt_id, "label": "Statement", "children": inner}
