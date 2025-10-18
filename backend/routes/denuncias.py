from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from typing import List

from models.denuncia import Denuncia, DenunciaCreate
from db.database import denuncias_collection

router = APIRouter()


@router.post("/denuncias", response_model=Denuncia, status_code=201)
async def create_denuncia(denuncia: DenunciaCreate):
    """
    Create a new parking violation report (denúncia)
    """
    denuncia_dict = denuncia.model_dump()
    denuncia_dict["data_criacao"] = datetime.utcnow()
    denuncia_dict["status"] = "pendente"

    result = denuncias_collection.insert_one(denuncia_dict)

    created_denuncia = denuncias_collection.find_one({"_id": result.inserted_id})
    if created_denuncia:
        created_denuncia["id"] = str(created_denuncia["_id"])
        del created_denuncia["_id"]
        return created_denuncia

    raise HTTPException(status_code=500, detail="Erro ao criar denúncia")


@router.get("/denuncias", response_model=List[Denuncia])
async def get_denuncias(status: str = None, limit: int = 100):
    """
    Get all denuncias, optionally filtered by status
    """
    query = {}
    if status:
        query["status"] = status

    denuncias = list(denuncias_collection.find(query).limit(limit).sort("data_criacao", -1))

    for denuncia in denuncias:
        denuncia["id"] = str(denuncia["_id"])
        del denuncia["_id"]

    return denuncias


@router.get("/denuncias/{denuncia_id}", response_model=Denuncia)
async def get_denuncia(denuncia_id: str):
    """
    Get a specific denúncia by ID
    """
    try:
        denuncia = denuncias_collection.find_one({"_id": ObjectId(denuncia_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")

    if not denuncia:
        raise HTTPException(status_code=404, detail="Denúncia não encontrada")

    denuncia["id"] = str(denuncia["_id"])
    del denuncia["_id"]
    return denuncia


@router.patch("/denuncias/{denuncia_id}/status")
async def update_denuncia_status(denuncia_id: str, status: str):
    """
    Update the status of a denúncia
    Valid statuses: pendente, em_analise, resolvida, arquivada
    """
    valid_statuses = ["pendente", "em_analise", "resolvida", "arquivada"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status inválido. Use: {', '.join(valid_statuses)}"
        )

    try:
        result = denuncias_collection.update_one(
            {"_id": ObjectId(denuncia_id)},
            {"$set": {"status": status}}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Denúncia não encontrada")

    return {"message": "Status atualizado com sucesso", "status": status}


@router.delete("/denuncias/{denuncia_id}")
async def delete_denuncia(denuncia_id: str):
    """
    Delete a denúncia by ID
    """
    try:
        result = denuncias_collection.delete_one({"_id": ObjectId(denuncia_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Denúncia não encontrada")

    return {"message": "Denúncia deletada com sucesso"}
