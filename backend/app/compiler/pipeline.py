"""
Full compiler pipeline — lexical → syntax → error detection → response.
"""

from app.compiler.errors.detector import SyntaxErrorDetector
from app.compiler.lexical.analyzer import LexicalAnalyzer
from app.compiler.syntax.parser import SyntaxParser
from app.models.responses import CompileResponse, ErrorModel, ParseTreeNodeModel, TokenModel


def _dict_to_tree(node: dict) -> ParseTreeNodeModel:
    return ParseTreeNodeModel(
        id=node["id"],
        label=node["label"],
        children=[_dict_to_tree(c) for c in node.get("children", [])],
    )


def compile_source(source: str) -> CompileResponse:
    logs: list[str] = ["Starting compilation pipeline..."]
    lexer = LexicalAnalyzer()
    detector = SyntaxErrorDetector()

    try:
        tokens = lexer.scan_tokens(source)
        logs.append(f"Lexical analysis completed: {len(tokens)} tokens generated")
    except ValueError as exc:
        return CompileResponse(
            tokens=[],
            errors=[
                ErrorModel(
                    line=1,
                    column=1,
                    message=str(exc),
                    suggestion="Remove invalid characters from source",
                    severity="error",
                )
            ],
            parseTree=ParseTreeNodeModel(
                id="program", label="Program (failed)", children=[]
            ),
            status="error",
            logs=logs + ["Lexical analysis failed"],
            phase="lexical",
        )

    token_models = [TokenModel(**t.to_dict()) for t in tokens]
    raw_errors = detector.detect(tokens, source)
    errors = [ErrorModel(**e) for e in raw_errors]
    has_errors = len(errors) > 0

    if has_errors:
        logs.append("Syntax errors detected during analysis")
    else:
        logs.append("Syntax analysis passed with no errors")

    tree_dict = SyntaxParser(tokens, has_errors).parse()
    logs.append("Parse tree constructed")

    if has_errors:
        logs.append("Compilation finished with errors")
        status, phase = "error", "errors"
    else:
        logs.append("Compilation finished — ready for code generation")
        status, phase = "success", "output"

    return CompileResponse(
        tokens=token_models,
        errors=errors,
        parseTree=_dict_to_tree(tree_dict),
        status=status,
        logs=logs,
        phase=phase,
    )
