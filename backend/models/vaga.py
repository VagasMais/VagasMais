from pydantic import BaseModel
from typing import Optional

class Vaga(BaseModel):
    id: Optional[str] = None
    nome: str
    latitude: float
    longitude: float
    endereco: str
    acessivel: bool = False
    total_vagas: int
    vagas_disponiveis: int
    vaga_gestante: bool = False
    vaga_idoso: bool = False
    vaga_pcd: bool = False
