"""
Scope handler — manages nested scopes during token-stream symbol collection.
"""


class ScopeHandler:
    """
    Stack of scope names: global → block_1 → block_2 …
    Driven by `{` / `}` tokens only (no parser dependency).
    """

    def __init__(self) -> None:
        self._stack: list[str] = ["global"]
        self._block_counter = 0

    @property
    def current(self) -> str:
        return self._stack[-1]

    @property
    def depth(self) -> int:
        return len(self._stack) - 1

    def enter_block(self) -> str:
        self._block_counter += 1
        name = f"block_{self._block_counter}"
        self._stack.append(name)
        return name

    def exit_block(self) -> str | None:
        if len(self._stack) <= 1:
            return None
        return self._stack.pop()

    def is_global(self) -> bool:
        return len(self._stack) == 1

    def all_scope_names(self) -> list[str]:
        return list(self._stack)
