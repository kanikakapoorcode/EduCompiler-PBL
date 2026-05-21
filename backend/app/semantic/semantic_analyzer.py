"""
Semantic analyzer — token-stream analysis with symbol table (optional pipeline phase).
Does not modify lexer or parser; consumes tokens only.
"""

from __future__ import annotations

import logging

from app.compiler.lexical.tokens import Token
from app.semantic import semantic_rules as rules
from app.semantic.symbol_table import TYPE_KEYWORDS, SymbolTable

logger = logging.getLogger(__name__)

RESERVED_STMT = frozenset({"if", "else", "while", "for", "return", "print"})


class SemanticAnalyzer:
    """
    Performs semantic analysis on a token stream produced by the lexer.
    Safe to call independently; returns [] on internal failure (graceful fallback).
    """

    def analyze(self, tokens: list[Token], source: str = "") -> list[dict]:
        try:
            return self._analyze(tokens)
        except Exception as exc:
            logger.warning("Semantic analysis fallback: %s", exc)
            return []

    def _analyze(self, tokens: list[Token]) -> list[dict]:
        if not tokens:
            return []

        errors: list[dict] = []
        table = SymbolTable()
        i = 0
        n = len(tokens)

        def peek(offset: int = 0) -> Token | None:
            j = i + offset
            return tokens[j] if j < n else None

        while i < n:
            tok = tokens[i]

            if tok.value == "{":
                table.enter_scope()
                i += 1
                continue
            if tok.value == "}":
                table.exit_scope()
                i += 1
                continue

            if tok.type == "KEYWORD" and tok.value in TYPE_KEYWORDS:
                type_name = tok.value
                i += 1
                id_tok = peek(0)
                if not id_tok or id_tok.type != "IDENTIFIER":
                    i += 1
                    continue

                name = id_tok.value
                dup = rules.check_duplicate_declaration(
                    table, name, id_tok.line, id_tok.column
                )
                if dup:
                    errors.append(dup)
                else:
                    declared = table.declare(
                        name,
                        type_name,
                        id_tok.line,
                        id_tok.column,
                        initialized=False,
                    )
                    if declared is None:
                        errors.append(
                            rules._err(
                                id_tok.line,
                                f"Duplicate declaration of '{name}'.",
                                column=id_tok.column,
                                code=rules.DUPLICATE,
                            )
                        )

                i += 1

                if peek(0) and peek(0).value == "=":
                    i += 1
                    rhs_tokens: list[Token] = []
                    while i < n and tokens[i].value != ";":
                        rhs_tokens.append(tokens[i])
                        i += 1

                    sym = table.lookup(name)
                    if sym:
                        tm = rules.check_type_mismatch(
                            sym.type_name, rhs_tokens, id_tok.line, id_tok.column
                        )
                        if tm:
                            errors.append(tm)

                        for rt in rhs_tokens:
                            if rt.type == "IDENTIFIER":
                                self._check_identifier_use(table, rt, errors)
                                ac = rules.check_assignment_type_consistency(
                                    table, name, rt.value, rt.line, rt.column
                                )
                                if ac:
                                    errors.append(ac)

                        table.mark_initialized(name)

                if i < n and tokens[i].value == ";":
                    i += 1
                continue

            if tok.type == "KEYWORD" and tok.value == "print":
                i += 1
                if peek(0) and peek(0).value == "(":
                    i += 1
                arg = peek(0)
                if arg and arg.type == "IDENTIFIER":
                    self._check_identifier_use(table, arg, errors)
                    i += 1
                while i < n and tokens[i].value != ";":
                    i += 1
                if i < n:
                    i += 1
                continue

            if tok.type == "IDENTIFIER":
                prev = tokens[i - 1] if i > 0 else None
                if not (prev and prev.type == "KEYWORD" and prev.value in TYPE_KEYWORDS):
                    next_t = peek(1)
                    if not (next_t and next_t.value == "="):
                        self._check_identifier_use(table, tok, errors)

            i += 1

        return _dedupe_errors(errors)

    def _check_identifier_use(
        self,
        table: SymbolTable,
        tok: Token,
        errors: list[dict],
    ) -> None:
        name = tok.value

        inv = rules.check_invalid_usage(
            name,
            tok.line,
            tok.column,
            is_type_keyword=name in TYPE_KEYWORDS,
            is_reserved=name in RESERVED_STMT,
        )
        if inv:
            errors.append(inv)
            return

        und = rules.check_undeclared(table, name, tok.line, tok.column)
        if und:
            errors.append(und)
            return

        sym = table.lookup(name)
        ubd = rules.check_use_before_decl(sym, name, tok.line, tok.column)
        if ubd:
            errors.append(ubd)

        warn = rules.check_uninitialized_read(sym, name, tok.line, tok.column)
        if warn:
            errors.append(warn)


def _dedupe_errors(errors: list[dict]) -> list[dict]:
    seen: set[tuple[int, str, str]] = set()
    out: list[dict] = []
    for e in errors:
        key = (e["line"], e.get("code", ""), e["message"])
        if key not in seen:
            seen.add(key)
            out.append(e)
    return out
