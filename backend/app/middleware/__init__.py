"""HTTP middleware and global exception handlers (auth uses route-level Depends)."""

from app.middleware.error_handler import register_exception_handlers

__all__ = ["register_exception_handlers"]
