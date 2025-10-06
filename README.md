# Funcionalidades

- Visualize vagas especiais de estacionamento em um mapa interativo.
- Veja status de disponibilidade (livre/ocupada) de cada vaga.
- Permita que usuários indiquem se uma vaga está ocupada ou livre.
- Sugira a adição de novas vagas ou a remoção de vagas inexistentes.
- Traçe rotas até a vaga desejada usando Google Maps.
- Instale o app como PWA e utilize offline.
- Busca por local ou endereço.

# Tecnologias utilizadas

- Frontend: React + Vite + TypeScript
- Backend: FastAPI (Python)
- Banco de dados: MongoDB
- Google Maps API

# Observações

- As variáveis de ambiente do frontend devem ser configuradas no arquivo `frontend/.env`.
- O backend deve estar rodando para que o frontend exiba as vagas reais.
- Para contribuir, abra uma issue ou envie um pull request.
# Vagas+

## Como rodar o projeto

### Frontend

1. Acesse a pasta do frontend:
	```sh
	cd frontend/@latest
	```
2. Instale as dependências (se necessário):
	```sh
	npm install
	```
3. Inicie o servidor de desenvolvimento:
	```sh
	npm run dev
	```

### Backend

1. Acesse a pasta do backend:
	```sh
	cd backend
	```
2. (Opcional) Ative o ambiente virtual:
	```sh
	source venv/bin/activate
	```
3. Inicie o backend com Uvicorn:
	```sh
	uvicorn main:app --reload
	```
