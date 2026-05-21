from fastapi import APIRouter

from app.compiler.pipeline import compile_source
from app.models.requests import CompileRequest
from app.models.responses import CompileResponse

router = APIRouter()


@router.post("/compile", response_model=CompileResponse)
def compile_endpoint(request: CompileRequest) -> CompileResponse:
    """
    **Full pipeline** — lexical + syntax + error detection in one call.
    """
    return compile_source(
        request.source,
        enable_semantic=request.enable_semantic,
        enable_symbol_table=request.enable_symbol_table,
    )
