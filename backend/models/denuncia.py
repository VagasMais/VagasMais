from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Denuncia(BaseModel):
    id: Optional[str] = None
    endereco: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    tipo_vaga: str  # 'pregnant', 'elderly', 'disabled'
    tipo_infracao: str  # 'no_credential', 'blocking_access', 'misuse', 'other'
    descricao: str
    midias: List[str] = []  # URLs or base64 encoded strings
    data_criacao: Optional[datetime] = None
    status: str = "pendente"  # 'pendente', 'em_analise', 'resolvida', 'arquivada'


class DenunciaCreate(BaseModel):
    endereco: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    tipo_vaga: str
    tipo_infracao: str
    descricao: str
    midias: List[str] = []
