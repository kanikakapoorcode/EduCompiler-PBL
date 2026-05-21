"""
Symbol table for semantic analysis — tracks declarations, types, and scopes.
"""

from dataclasses import dataclass, field


TYPE_KEYWORDS = frozenset({"int", "float", "void"})


@dataclass
class Symbol:
    name: str
    type_name: str
    line: int
    column: int
    scope_id: int
    initialized: bool = False


@dataclass
class SymbolTable:
    """
    Stack-based symbol table.
    Scope 0 = global; nested scopes via enter_scope / exit_scope.
    """

    _scopes: list[dict[str, Symbol]] = field(default_factory=list)
    _current_scope: int = 0

    def __post_init__(self) -> None:
        if not self._scopes:
            self._scopes = [{}]

    @property
    def current_scope_id(self) -> int:
        return self._current_scope

    def enter_scope(self) -> int:
        self._scopes.append({})
        self._current_scope = len(self._scopes) - 1
        return self._current_scope

    def exit_scope(self) -> None:
        if len(self._scopes) > 1:
            self._scopes.pop()
            self._current_scope = len(self._scopes) - 1

    def declare(
        self,
        name: str,
        type_name: str,
        line: int,
        column: int,
        *,
        initialized: bool = False,
    ) -> Symbol | None:
        """
        Declare symbol in current scope.
        Returns None if duplicate in same scope.
        """
        scope = self._scopes[self._current_scope]
        if name in scope:
            return None
        sym = Symbol(
            name=name,
            type_name=type_name,
            line=line,
            column=column,
            scope_id=self._current_scope,
            initialized=initialized,
        )
        scope[name] = sym
        return sym

    def lookup(self, name: str) -> Symbol | None:
        """Search from innermost scope outward."""
        for scope in reversed(self._scopes):
            if name in scope:
                return scope[name]
        return None

    def lookup_current(self, name: str) -> Symbol | None:
        return self._scopes[self._current_scope].get(name)

    def all_symbols(self) -> list[Symbol]:
        seen: set[str] = set()
        result: list[Symbol] = []
        for scope in self._scopes:
            for name, sym in scope.items():
                if name not in seen:
                    seen.add(name)
                    result.append(sym)
        return result

    def is_declared(self, name: str) -> bool:
        return self.lookup(name) is not None

    def mark_initialized(self, name: str) -> None:
        sym = self.lookup(name)
        if sym is None:
            return
        scope = self._scopes[sym.scope_id]
        if name in scope:
            scope[name] = Symbol(
                name=sym.name,
                type_name=sym.type_name,
                line=sym.line,
                column=sym.column,
                scope_id=sym.scope_id,
                initialized=True,
            )
