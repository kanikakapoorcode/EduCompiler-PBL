from pydantic import BaseModel, Field


class CompileRequest(BaseModel):
    source: str = Field(..., min_length=0, description="Full source code to compile")


class LexicalRequest(BaseModel):
    source: str = Field(..., min_length=0, description="Source code for lexical analysis")


class SyntaxRequest(BaseModel):
    source: str = Field(..., min_length=0, description="Source code for syntax analysis")
    tokens: list[dict] | None = Field(
        None,
        description="Optional pre-computed tokens; if omitted, lexer runs first",
    )
