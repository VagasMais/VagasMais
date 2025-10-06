from pydantic import BaseModel
from typing import Optional

class Vaga(BaseModel):
    id: Optional[str] = None
    nome: str
    latitude: float
    longitude: float
    endereco: str
    acessivel: bool = True
