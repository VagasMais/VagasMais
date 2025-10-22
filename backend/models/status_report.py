from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class StatusReport(BaseModel):
    id: Optional[str] = None
    vaga_id: str
    vagas_disponiveis: int
    total_vagas: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ip_address: str
    observacoes: Optional[str] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class StatusReportSubmission(BaseModel):
    vagas_disponiveis: int
    total_vagas: int
    observacoes: Optional[str] = None
