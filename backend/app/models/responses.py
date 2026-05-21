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


class CompileResponse(BaseModel):
    tokens: list[TokenModel]
    errors: list[ErrorModel]
    parseTree: ParseTreeNodeModel
    status: Literal["success", "error", "warning"]
    logs: list[str]
    phase: str = "output"
