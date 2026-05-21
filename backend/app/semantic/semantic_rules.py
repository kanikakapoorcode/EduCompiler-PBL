"""
Semantic validation rules — applied against symbol table + token stream.
"""

from app.compiler.lexical.tokens import Token
from app.semantic.symbol_table import TYPE_KEYWORDS, Symbol, SymbolTable

# Error codes for clients
UNDECLARED = "UNDECLARED_VARIABLE"
DUPLICATE = "DUPLICATE_DECLARATION"
TYPE_MISMATCH = "TYPE_MISMATCH"
INVALID_USAGE = "INVALID_USAGE"
SCOPE_ERROR = "SCOPE_ERROR"
USE_BEFORE_DECL = "USE_BEFORE_DECL"


def _err(
    line: int,
    message: str,
    *,
    column: int = 1,
    code: str = "SEMANTIC_ERROR",
    suggestion: str | None = None,
    severity: str = "error",
) -> dict:
    return {
        "line": line,
        "column": column,
        "message": message,
        "code": code,
        "suggestion": suggestion,
        "severity": severity,
    }


def check_duplicate_declaration(
    table: SymbolTable,
    name: str,
    line: int,
    column: int,
) -> dict | None:
    if table.lookup_current(name) is not None:
        return _err(
            line,
            f"Duplicate declaration of variable '{name}' in the same scope.",
            column=column,
            code=DUPLICATE,
            suggestion=f"Remove the duplicate declaration or rename the variable on line {line}.",
        )
    return None


def check_use_before_decl(
    sym: Symbol | None,
    name: str,
    use_line: int,
    use_column: int,
) -> dict | None:
    if sym is None:
        return None
    if use_line < sym.line:
        return _err(
            use_line,
            f"Variable '{name}' used before declaration (declared on line {sym.line}).",
            column=use_column,
            code=USE_BEFORE_DECL,
            suggestion=f"Move the declaration of '{name}' above line {use_line}.",
        )
    return None


def check_undeclared(
    table: SymbolTable,
    name: str,
    line: int,
    column: int,
) -> dict | None:
    if not table.is_declared(name):
        return _err(
            line,
            f"Variable '{name}' not declared.",
            column=column,
            code=UNDECLARED,
            suggestion=f"Declare '{name}' before use, e.g. int {name};",
        )
    return None


def infer_literal_type(value: str) -> str:
    if "." in value:
        return "float"
    return "int"


def check_type_mismatch(
    declared_type: str,
    rhs_tokens: list[Token],
    line: int,
    column: int,
) -> dict | None:
    """Simple type rules: int cannot be assigned float literal; void not assignable."""
    if declared_type == "void":
        return _err(
            line,
            "Cannot assign a value to a void declaration.",
            column=column,
            code=TYPE_MISMATCH,
            suggestion="Use int or float for variables that hold values.",
        )

    for tok in rhs_tokens:
        if tok.type == "NUMBER":
            lit_type = infer_literal_type(tok.value)
            if declared_type == "int" and lit_type == "float":
                return _err(
                    line,
                    f"Type mismatch: cannot assign float literal '{tok.value}' to int variable.",
                    column=tok.column,
                    code=TYPE_MISMATCH,
                    suggestion="Use an integer literal or change the variable type to float.",
                )
        if tok.type == "IDENTIFIER":
            # Cross-ref checked separately
            pass
    return None


def check_assignment_type_consistency(
    table: SymbolTable,
    target_name: str,
    rhs_ident: str,
    line: int,
    column: int,
) -> dict | None:
    target = table.lookup(target_name)
    source = table.lookup(rhs_ident)
    if not target or not source:
        return None
    if target.type_name != source.type_name:
        return _err(
            line,
            f"Type mismatch: '{target_name}' ({target.type_name}) and "
            f"'{rhs_ident}' ({source.type_name}) are incompatible.",
            column=column,
            code=TYPE_MISMATCH,
            suggestion=f"Cast or use matching types for assignment on line {line}.",
        )
    return None


def check_invalid_usage(
    name: str,
    line: int,
    column: int,
    *,
    is_type_keyword: bool = False,
    is_reserved: bool = False,
) -> dict | None:
    if is_type_keyword or name in TYPE_KEYWORDS:
        return _err(
            line,
            f"Invalid usage: '{name}' is a type keyword, not a variable.",
            column=column,
            code=INVALID_USAGE,
        )
    if is_reserved:
        return _err(
            line,
            f"Invalid usage: '{name}' is a reserved keyword.",
            column=column,
            code=INVALID_USAGE,
        )
    return None


def check_uninitialized_read(
    sym: Symbol | None,
    name: str,
    line: int,
    column: int,
) -> dict | None:
    if sym and not sym.initialized and sym.line != line:
        return _err(
            line,
            f"Variable '{name}' may be used before initialization.",
            column=column,
            code=SCOPE_ERROR,
            suggestion=f"Assign a value to '{name}' before reading it.",
            severity="warning",
        )
    return None
