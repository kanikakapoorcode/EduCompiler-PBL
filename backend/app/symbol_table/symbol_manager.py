"""
Symbol manager — builds symbol tables from token streams (no parser required).
"""

from __future__ import annotations

import logging

from app.compiler.lexical.tokens import Token
from app.symbol_table.scope_handler import ScopeHandler
from app.symbol_table.symbol_models import (
    DeclarationStatus,
    SymbolRecord,
    empty_symbol_table_response,
)

logger = logging.getLogger(__name__)

TYPE_KEYWORDS = frozenset({"int", "float", "void"})


class SymbolManager:
    """
    Walks tokens to populate symbol records: identifiers, types, scope,
    declaration status, and assigned values.
    """

    def build_from_tokens(self, tokens: list[Token]) -> list[dict]:
        try:
            return self._build(tokens)
        except Exception as exc:
            logger.warning("Symbol table generation fallback: %s", exc)
            return empty_symbol_table_response()

    def _build(self, tokens: list[Token]) -> list[dict]:
        if not tokens:
            return empty_symbol_table_response()

        scope = ScopeHandler()
        # Key: (identifier, scope_name) → SymbolRecord
        symbols: dict[tuple[str, str], SymbolRecord] = {}
        i = 0
        n = len(tokens)

        def peek(off: int = 0) -> Token | None:
            j = i + off
            return tokens[j] if j < n else None

        while i < n:
            tok = tokens[i]

            if tok.value == "{":
                scope.enter_block()
                i += 1
                continue
            if tok.value == "}":
                scope.exit_block()
                i += 1
                continue

            # Declaration: type IDENTIFIER [= rhs] ;
            if tok.type == "KEYWORD" and tok.value in TYPE_KEYWORDS:
                type_name = tok.value
                i += 1
                id_tok = peek(0)
                if not id_tok or id_tok.type != "IDENTIFIER":
                    i += 1
                    continue

                key = (id_tok.value, scope.current)
                assigned: str | None = None
                initialized = False

                if key in symbols:
                    # Duplicate in same scope — still export latest metadata
                    rec = symbols[key]
                    rec.type = type_name
                    rec.line = id_tok.line
                    rec.column = id_tok.column
                else:
                    rec = SymbolRecord(
                        identifier=id_tok.value,
                        type=type_name,
                        scope=scope.current,
                        line=id_tok.line,
                        column=id_tok.column,
                        declared=True,
                        initialized=False,
                        status=DeclarationStatus.DECLARED,
                    )
                    symbols[key] = rec

                i += 1

                if peek(0) and peek(0).value == "=":
                    i += 1
                    rhs_parts: list[str] = []
                    while i < n and tokens[i].value != ";":
                        t = tokens[i]
                        if t.type in ("IDENTIFIER", "NUMBER", "OPERATOR"):
                            rhs_parts.append(t.value)
                        i += 1
                    if rhs_parts:
                        assigned = " ".join(rhs_parts)
                        initialized = True

                    rec = symbols[key]
                    rec.initialized = initialized
                    rec.assigned_value = assigned
                    rec.status = (
                        DeclarationStatus.INITIALIZED
                        if initialized
                        else DeclarationStatus.DECLARED
                    )

                if i < n and tokens[i].value == ";":
                    i += 1
                continue

            # Usage: print(id) or bare identifier
            if tok.type == "IDENTIFIER":
                prev = tokens[i - 1] if i > 0 else None
                is_decl_name = (
                    prev
                    and prev.type == "KEYWORD"
                    and prev.value in TYPE_KEYWORDS
                )
                next_t = peek(1)
                is_assign_target = next_t and next_t.value == "="

                if not is_decl_name and not is_assign_target:
                    self._mark_usage(symbols, tok, scope.current)

            if tok.type == "KEYWORD" and tok.value == "print":
                i += 1
                if peek(0) and peek(0).value == "(":
                    i += 1
                arg = peek(0)
                if arg and arg.type == "IDENTIFIER":
                    self._mark_usage(symbols, arg, scope.current)
                    i += 1
                while i < n and tokens[i].value != ";":
                    i += 1
                if i < n:
                    i += 1
                continue

            i += 1

        return [rec.to_api_dict() for rec in symbols.values()]

    def _mark_usage(
        self,
        symbols: dict[tuple[str, str], SymbolRecord],
        tok: Token,
        scope_name: str,
    ) -> None:
        """Record reference to identifier (lookup scopes outward)."""
        name = tok.value
        for key, rec in symbols.items():
            if key[0] == name:
                if tok.line not in rec.references:
                    rec.references.append(tok.line)
                if rec.status == DeclarationStatus.DECLARED and rec.initialized:
                    rec.status = DeclarationStatus.USED
                elif not rec.initialized:
                    rec.status = DeclarationStatus.USED
                return

        # Extern reference — not declared in table (semantic layer reports error)
        ext_key = (name, scope_name)
        if ext_key not in symbols:
            symbols[ext_key] = SymbolRecord(
                identifier=name,
                type="unknown",
                scope=scope_name,
                line=tok.line,
                column=tok.column,
                declared=False,
                initialized=False,
                status=DeclarationStatus.USED,
                references=[tok.line],
            )
