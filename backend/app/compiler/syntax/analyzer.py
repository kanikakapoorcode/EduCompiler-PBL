"""
Syntax analyzer — validates grammar rules and builds parse tree.
"""

from app.compiler.errors.detector import SyntaxErrorDetector
from app.compiler.lexical.analyzer import LexicalAnalyzer
from app.compiler.lexical.tokens import Token, token_to_dict
from app.compiler.syntax.parser import SyntaxParser
from app.models.responses import ErrorModel, ParseTreeNodeModel, SyntaxResponse


def _dict_to_tree(node: dict) -> ParseTreeNodeModel:
    return ParseTreeNodeModel(
        id=node["id"],
        label=node["label"],
        children=[_dict_to_tree(c) for c in node.get("children", [])],
    )


class SyntaxAnalyzer:
    """Runs syntax analysis: optional lex pass, error detect, parse tree build."""

    def __init__(self) -> None:
        self._lexer = LexicalAnalyzer()
        self._detector = SyntaxErrorDetector()

    def analyze(
        self,
        source: str,
        tokens: list[Token] | None = None,
    ) -> SyntaxResponse:
        logs = ["Phase 2: Syntax Analysis — validating grammar"]

        if tokens is None:
            try:
                tokens = self._lexer.scan_tokens(source)
                logs.append(f"Using {len(tokens)} tokens from lexical pass")
            except ValueError as exc:
                return SyntaxResponse(
                    status="error",
                    parse_tree=ParseTreeNodeModel(
                        id="program", label="Program (failed)", children=[]
                    ),
                    errors=[
                        ErrorModel(
                            line=1,
                            column=1,
                            message=str(exc),
                            severity="error",
                        )
                    ],
                    logs=logs + ["Cannot parse: lexical analysis failed"],
                )

        raw_errors = self._detector.detect(tokens, source)
        errors = [ErrorModel(**e) for e in raw_errors]
        has_errors = len(errors) > 0

        if has_errors:
            logs.append(f"Found {len(errors)} syntax diagnostic(s)")
        else:
            logs.append("Grammar validation passed")

        tree_dict = SyntaxParser(tokens, has_errors).parse()
        logs.append("Parse tree constructed")

        status = "error" if has_errors else "success"
        if has_errors and any(e.severity == "warning" for e in errors):
            status = "warning"

        return SyntaxResponse(
            status=status,
            parse_tree=_dict_to_tree(tree_dict),
            errors=errors,
            logs=logs,
        )
