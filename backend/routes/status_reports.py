from fastapi import APIRouter, HTTPException, Request
from models.status_report import StatusReport, StatusReportSubmission
from db.database import status_reports_collection
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()

# Anti-spam: limite de 1 report por IP a cada 15 minutos
RATE_LIMIT_MINUTES = 15

@router.post("/vagas/{vaga_id}/status")
def criar_status_report(vaga_id: str, report: StatusReportSubmission, request: Request):
    """
    Criar um novo report de status para uma vaga
    """
    # Obter IP do cliente
    ip_address = request.client.host if request.client else "unknown"

    # Verificar rate limit (anti-spam)
    cutoff_time = datetime.utcnow() - timedelta(minutes=RATE_LIMIT_MINUTES)
    recent_report = status_reports_collection.find_one({
        "vaga_id": vaga_id,
        "ip_address": ip_address,
        "timestamp": {"$gte": cutoff_time}
    })

    if recent_report:
        raise HTTPException(
            status_code=429,
            detail=f"Você já reportou esta vaga recentemente. Aguarde {RATE_LIMIT_MINUTES} minutos."
        )

    # Validar dados
    if report.vagas_disponiveis < 0 or report.vagas_disponiveis > report.total_vagas:
        raise HTTPException(
            status_code=400,
            detail="Número de vagas disponíveis inválido"
        )

    # Criar report
    status_report = StatusReport(
        vaga_id=vaga_id,
        vagas_disponiveis=report.vagas_disponiveis,
        total_vagas=report.total_vagas,
        ip_address=ip_address,
        observacoes=report.observacoes
    )

    result = status_reports_collection.insert_one(status_report.dict(exclude={"id"}))

    return {
        "id": str(result.inserted_id),
        "message": "Report criado com sucesso",
        "vaga_id": vaga_id,
        "vagas_disponiveis": report.vagas_disponiveis
    }

@router.get("/vagas/{vaga_id}/status/latest")
def buscar_ultimo_status(vaga_id: str):
    """
    Buscar o último report de status válido (menos de 2 horas) para uma vaga
    """
    # Reports são válidos por 2 horas
    cutoff_time = datetime.utcnow() - timedelta(hours=2)

    # Buscar o report mais recente dentro do período válido
    report = status_reports_collection.find_one(
        {
            "vaga_id": vaga_id,
            "timestamp": {"$gte": cutoff_time}
        },
        sort=[("timestamp", -1)]
    )

    if not report:
        return None

    # Converter ObjectId para string
    report["_id"] = str(report["_id"])

    # Calcular tempo desde o report (em minutos)
    time_diff = datetime.utcnow() - report["timestamp"]
    minutes_ago = int(time_diff.total_seconds() / 60)

    return {
        **report,
        "minutes_ago": minutes_ago
    }
