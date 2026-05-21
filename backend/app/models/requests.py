from pydantic import BaseModel, Field


class CompileRequest(BaseModel):
    source: str = Field(..., min_length=0, description="Full source code to compile")
    enable_semantic: bool = Field(
        True,
        description="Run optional semantic analysis after syntax phase",
    )
    enable_symbol_table: bool = Field(
        True,
        description="Build symbol table from token stream",
    )


class LexicalRequest(BaseModel):
    source: str = Field(..., min_length=0, description="Source code for lexical analysis")


class SyntaxRequest(BaseModel):
    source: str = Field(..., min_length=0, description="Source code for syntax analysis")
    tokens: list[dict] | None = Field(
        None,
        description="Optional pre-computed tokens; if omitted, lexer runs first",
    )


class SemanticRequest(BaseModel):
    source: str = Field(..., min_length=0, description="Source code for semantic analysis")
    tokens: list[dict] | None = Field(
        None,
        description="Optional token stream from lexical phase",
    )


class SymbolTableRequest(BaseModel):
    source: str = Field(..., min_length=0, description="Source code for symbol table generation")
    tokens: list[dict] | None = Field(
        None,
        description="Optional pre-computed tokens from lexical phase",
    )
