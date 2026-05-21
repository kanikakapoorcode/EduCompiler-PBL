"""
Full compiler pipeline — lexical → syntax → semantic (optional) → response.
"""

from app.compiler.errors.detector import SyntaxErrorDetector
from app.compiler.lexical.analyzer import LexicalAnalyzer
from app.compiler.syntax.parser import SyntaxParser
from app.models.responses import (
    CompileResponse,
    ErrorModel,
    ParseTreeNodeModel,
    SemanticErrorModel,
    SymbolTableEntryModel,
    TokenModel,
)


def _dict_to_tree(node: dict) -> ParseTreeNodeModel:
    return ParseTreeNodeModel(
        id=node["id"],
        label=node["label"],
        children=[_dict_to_tree(c) for c in node.get("children", [])],
    )


def _run_semantic_analysis(tokens, source: str) -> tuple[list[SemanticErrorModel], list[str]]:
    """Optional semantic phase with graceful fallback."""
    logs: list[str] = []
    try:
        from app.semantic.semantic_analyzer import SemanticAnalyzer

        raw = SemanticAnalyzer().analyze(tokens, source)
        logs.append(f"Semantic analysis completed: {len(raw)} issue(s)")
        models = [SemanticErrorModel(**e) for e in raw]
        return models, logs
    except Exception:
        logs.append("Semantic analysis skipped (fallback)")
        return [], logs


def _run_symbol_table(tokens) -> tuple[list[SymbolTableEntryModel], list[str]]:
    logs: list[str] = []
    try:
        from app.symbol_table.symbol_manager import SymbolManager

        raw = SymbolManager().build_from_tokens(tokens)
        logs.append(f"Symbol table generated: {len(raw)} entries")
        return [SymbolTableEntryModel(**row) for row in raw], logs
    except Exception:
        logs.append("Symbol table skipped (fallback)")
        return [], logs


def compile_source(
    source: str,
    *,
    enable_semantic: bool = True,
    enable_symbol_table: bool = True,
) -> CompileResponse:
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
            semantic_errors=[],
            symbol_table=[],
        )

    token_models = [TokenModel(**t.to_dict()) for t in tokens]
    raw_errors = detector.detect(tokens, source)
    errors = [ErrorModel(**e) for e in raw_errors]
    has_syntax_errors = len(errors) > 0

    if has_syntax_errors:
        logs.append("Syntax errors detected during analysis")
    else:
        logs.append("Syntax analysis passed with no errors")

    tree_dict = SyntaxParser(tokens, has_syntax_errors).parse()
    logs.append("Parse tree constructed")

    semantic_models: list[SemanticErrorModel] = []
    if enable_semantic:
        semantic_models, sem_logs = _run_semantic_analysis(tokens, source)
        logs.extend(sem_logs)
    else:
        logs.append("Semantic analysis disabled")

    symbol_entries: list[SymbolTableEntryModel] = []
    if enable_symbol_table:
        symbol_entries, sym_logs = _run_symbol_table(tokens)
        logs.extend(sym_logs)
    else:
        logs.append("Symbol table generation disabled")

    has_semantic_errors = any(
        e.severity == "error" for e in semantic_models
    )
    has_errors = has_syntax_errors or has_semantic_errors

    if has_errors:
        logs.append("Compilation finished with errors")
        status = "error"
        phase = "errors" if has_syntax_errors else "semantic"
    else:
        logs.append("Compilation finished — ready for code generation")
        status = "success"
        phase = "output"

    return CompileResponse(
        tokens=token_models,
        errors=errors,
        parseTree=_dict_to_tree(tree_dict),
        status=status,
        logs=logs,
        phase=phase,
        semantic_errors=semantic_models,
        symbol_table=symbol_entries,
    )
