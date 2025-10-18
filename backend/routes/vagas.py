from fastapi import APIRouter, HTTPException
from models.vaga import Vaga
from db.database import vagas_collection
from bson import ObjectId

router = APIRouter()

@router.get("/vagas")
def listar_vagas():
    vagas = list(vagas_collection.find())
    for vaga in vagas:
        vaga["_id"] = str(vaga["_id"])
    return vagas

@router.post("/vagas")
def criar_vaga(vaga: Vaga):
    result = vagas_collection.insert_one(vaga.dict())
    return {"id": str(result.inserted_id)}

@router.get("/vagas/{id}")
def buscar_vaga(id: str):
    vaga = vagas_collection.find_one({"_id": ObjectId(id)})
    if not vaga:
        raise HTTPException(404, "Vaga não encontrada")
    vaga["_id"] = str(vaga["_id"])
    return vaga

@router.delete("/vagas/{id}")
def deletar_vaga(id: str):
    result = vagas_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Vaga não encontrada")
    return {"message": "Vaga deletada com sucesso"}
