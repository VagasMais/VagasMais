from fastapi import FastAPI
from routes import vagas, denuncias
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Vagas Acessíveis API")

# CORS para permitir o front se conectar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vagas.router)
app.include_router(denuncias.router)

@app.get("/")
def raiz():
    return {"mensagem": "API de Vagas Acessíveis ativa 🚗"}
