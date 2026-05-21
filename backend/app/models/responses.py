from typing import Literal, Optional

from pydantic import BaseModel, Field


class TokenModel(BaseModel):
    type: str
    value: str
    line: int
    column: int


class ErrorModel(BaseModel):
    line: int
    column: int
    message: str
    suggestion: Optional[str] = None
    severity: Literal["error", "warning"] = "error"


class SemanticErrorModel(BaseModel):
    """Semantic-phase diagnostic (separate from syntax errors)."""

    line: int
    column: int = 1
    message: str
    code: Optional[str] = None
    suggestion: Optional[str] = None
    severity: Literal["error", "warning"] = "error"


class ParseTreeNodeModel(BaseModel):
    id: str
    label: str
    children: list["ParseTreeNodeModel"] = Field(default_factory=list)


ParseTreeNodeModel.model_rebuild()


class LexicalResponse(BaseModel):
    phase: Literal["lexical"] = "lexical"
    status: Literal["success", "error"]
    tokens: list[TokenModel]
    token_count: int
    errors: list[ErrorModel] = Field(default_factory=list)
    logs: list[str]


class SyntaxResponse(BaseModel):
    phase: Literal["syntax"] = "syntax"
    status: Literal["success", "error", "warning"]
    parse_tree: ParseTreeNodeModel
    errors: list[ErrorModel]
    logs: list[str]


class SymbolTableEntryModel(BaseModel):
    identifier: str
    type: str
    scope: str
    line: int = 1
    column: int = 1
    declared: bool = True
    initialized: bool = False
    assigned_value: Optional[str] = Field(None, alias="assignedValue")
    status: str = "declared"
    reference_lines: list[int] = Field(default_factory=list, alias="referenceLines")

    model_config = {"populate_by_name": True}


class SymbolTableResponse(BaseModel):
    phase: Literal["symbol_table"] = "symbol_table"
    status: Literal["success", "empty", "error"] = "success"
    symbol_table: list[SymbolTableEntryModel] = Field(
        default_factory=list,
        alias="symbolTable",
    )
    symbol_count: int = Field(0, alias="symbolCount")
    logs: list[str] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class SemanticResponse(BaseModel):
    phase: Literal["semantic"] = "semantic"
    status: Literal["success", "error", "warning"]
    semantic_errors: list[SemanticErrorModel] = Field(
        default_factory=list,
        alias="semanticErrors",
    )
    logs: list[str] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class CompileResponse(BaseModel):
    tokens: list[TokenModel]
    errors: list[ErrorModel]
    parseTree: ParseTreeNodeModel
    status: Literal["success", "error", "warning"]
    logs: list[str]
    phase: str = "output"
    semantic_errors: list[SemanticErrorModel] = Field(
        default_factory=list,
        alias="semanticErrors",
    )
    symbol_table: list[SymbolTableEntryModel] = Field(
        default_factory=list,
        alias="symbolTable",
    )

    model_config = {"populate_by_name": True}
