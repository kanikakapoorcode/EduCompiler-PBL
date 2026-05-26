from pydantic import BaseModel, Field


class SaveSessionRequest(BaseModel):
    source_code: str = Field(..., min_length=0)
    tokens: list[dict] = Field(default_factory=list)
    errors: list[dict] = Field(default_factory=list)
    syntax_status: str = Field("unknown", description="success | error | warning")


class SessionResponse(BaseModel):
    id: str
    user_id: str
    source_code: str
    tokens: list[dict]
    errors: list[dict]
    syntax_status: str
    created_at: str | None = None


class SessionListResponse(BaseModel):
    sessions: list[SessionResponse]
    count: int


class DashboardStatsResponse(BaseModel):
    total_compilations: int
    saved_programs: int
    error_runs: int
    success_runs: int
    recent_sessions: list[SessionResponse]
