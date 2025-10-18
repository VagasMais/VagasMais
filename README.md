# Vagas+ 🚗♿

**Vagas+** é uma aplicação web inovadora e inclusiva que ajuda pessoas com necessidades especiais (PcD, gestantes e idosos) a encontrar vagas de estacionamento acessíveis em sua cidade. O app utiliza a API do Google Maps para mapeamento interativo, fornece informações de disponibilidade em tempo real e permite que usuários relatem infrações.

## 📋 Sumário

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Características Técnicas](#-características-técnicas)
- [Como Contribuir](#-como-contribuir)
- [Licença](#-licença)

## ✨ Funcionalidades

- 🗺️ **Visualização em Mapa Interativo** - Veja vagas especiais de estacionamento em um mapa do Google Maps
- 🔍 **Busca por Endereço** - Autocomplete do Google Places para buscar locais específicos
- 📍 **Filtragem por Proximidade** - Encontre vagas próximas a você ou ao endereço pesquisado
  - Raio de busca: **3 km** para listar vagas
  - Raio de destaque: **500 metros** para vagas muito próximas no mapa
- 🎨 **Marcadores Coloridos** - Identificação visual por tipo de vaga:
  - 🟠 Laranja: PcD (Pessoa com Deficiência)
  - 🔵 Azul: Gestante
  - 🩷 Rosa: Idoso
- 📊 **Status de Disponibilidade** - Veja se a vaga está livre ou ocupada
- 🚗 **Informações de Rota** - Distância e tempo estimado até cada vaga
- 🧭 **Navegação Externa** - Abra rotas no Google Maps ou Waze
- 📢 **Denúncias de Infrações** - Reporte vagas ocupadas irregularmente
- 📸 **Upload de Mídia** - Envie fotos e vídeos nas denúncias (até 3 arquivos, máx 10MB cada)
- 📱 **Progressive Web App (PWA)** - Instale como app e use offline
- 🌐 **Geocodificação Reversa** - Detecção automática de endereço pela localização

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** 19.1.1 - Biblioteca para construção de interfaces
- **TypeScript** 5.9.3 - Superset do JavaScript com tipagem estática
- **Vite** 7.1.7 - Build tool moderno e rápido
- **Google Maps API** - Mapeamento e geocodificação
- **Axios** 1.12.2 - Cliente HTTP para requisições
- **Lucide React** - Biblioteca de ícones
- **ESLint** - Linter para qualidade de código
- **vite-plugin-pwa** - Suporte a Progressive Web App

### Backend
- **FastAPI** - Framework web Python moderno e rápido
- **Python** - Linguagem de programação
- **MongoDB Atlas** - Banco de dados NoSQL em nuvem
- **Uvicorn** - Servidor ASGI de alta performance
- **PyMongo** - Driver Python para MongoDB
- **python-dotenv** - Gerenciamento de variáveis de ambiente

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- Python 3.8+
- Conta no Google Cloud (para API do Google Maps)
- Conta no MongoDB Atlas

### Frontend

1. Acesse a pasta do frontend:
   ```bash
   cd frontend/@latest
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (crie um arquivo `.env`):
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   VITE_GOOGLE_MAPS_API_KEY=sua_chave_da_api_do_google_maps
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse no navegador: `http://localhost:5173`

### Backend

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```

2. Crie e ative o ambiente virtual (opcional, mas recomendado):
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate  # Windows
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure as variáveis de ambiente (crie um arquivo `.env`):
   ```env
   MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/database
   ```

5. Inicie o servidor:
   ```bash
   uvicorn main:app --reload
   ```

6. Acesse a documentação da API: `http://localhost:8000/docs`

## 🔐 Variáveis de Ambiente

### Frontend (`frontend/@latest/.env`)
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

### Backend (`backend/.env`)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

## 📁 Estrutura do Projeto

```
VagasMais/
├── frontend/@latest/
│   ├── public/              # Assets estáticos
│   │   ├── background.mp4   # Vídeo de fundo
│   │   ├── pcd.png          # Ícone PcD
│   │   ├── gestante.png     # Ícone gestante
│   │   └── idoso.png        # Ícone idoso
│   ├── src/
│   │   ├── api/             # Camada de serviços da API
│   │   ├── components/      # Componentes React reutilizáveis
│   │   ├── constants/       # Constantes e configurações
│   │   ├── hooks/           # Custom hooks do React
│   │   ├── pages/           # Componentes de página
│   │   ├── styles/          # Arquivos CSS
│   │   ├── types/           # Definições TypeScript
│   │   ├── utils/           # Funções utilitárias
│   │   ├── App.tsx          # Componente principal
│   │   └── main.tsx         # Ponto de entrada
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── db/                  # Configuração do banco de dados
│   ├── models/              # Modelos de dados
│   ├── routes/              # Rotas da API
│   ├── main.py              # Ponto de entrada
│   └── requirements.txt
└── docs/
    └── ESTRUTURA_DO_PROJETO.md
```

Para mais detalhes sobre a arquitetura, consulte [ESTRUTURA_DO_PROJETO.md](docs/ESTRUTURA_DO_PROJETO.md).

## 🔌 API Endpoints

### Vagas (Parking Spots)
- `GET /` - Health check
- `GET /vagas` - Listar todas as vagas
- `POST /vagas` - Criar nova vaga
- `GET /vagas/{id}` - Buscar vaga específica
- `DELETE /vagas/{id}` - Deletar vaga

### Denúncias (Violation Reports)
- `POST /denuncias` - Criar denúncia
- `GET /denuncias` - Listar denúncias (filtro por status opcional)
- `GET /denuncias/{id}` - Buscar denúncia específica
- `PATCH /denuncias/{id}/status` - Atualizar status da denúncia
- `DELETE /denuncias/{id}` - Deletar denúncia

### Status de Denúncias
- `pendente` - Aguardando análise
- `em_analise` - Em processo de verificação
- `resolvida` - Resolvida
- `arquivada` - Arquivada

## 🎯 Funcionalidades Principais

### 1. Busca Inteligente
O sistema utiliza dois raios diferentes para otimizar a experiência:
- **3 km**: Raio de busca para listar vagas próximas
- **500 metros**: Raio para destacar vagas muito próximas no mapa

### 2. Sistema de Navegação
- Detecção automática de plataforma (iOS, Android, Desktop)
- Deep links para apps nativos (Google Maps, Waze)
- Fallback para versão web quando app não está instalado

### 3. Upload de Mídia
- Suporte para imagens e vídeos
- Até 3 arquivos por denúncia
- Limite de 10MB por arquivo
- Conversão automática para base64 para envio à API

### 4. Geolocalização
- Detecção automática da localização do usuário
- Estratégia de fallback: baixa precisão (rápido) → alta precisão (GPS)
- Cache de localização por 5 minutos
- Geocodificação reversa para obter endereço

## 💡 Características Técnicas

### Arquitetura Modular
- Separação clara de responsabilidades (types, hooks, components, utils)
- Componentes reutilizáveis e testáveis
- Custom hooks para lógica de negócio

### Segurança de Tipos
- 100% TypeScript no frontend
- Interfaces bem definidas
- Zero uso de `any`

### Performance
- Lazy loading de componentes
- Cache de geolocalização
- Session tokens para Google Places API (otimização de billing)

### Responsividade
- Design mobile-first
- Grid responsivo para lista de vagas
- Modais adaptáveis

### Acessibilidade
- HTML semântico
- Labels ARIA
- Foco em usabilidade para pessoas com necessidades especiais

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenções de Código
- Código em **inglês** (variáveis, funções, comentários)
- Interface do usuário em **português brasileiro**
- Documentação em **português brasileiro**

## 📝 Scripts Disponíveis

### Frontend
```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build de produção
npm run lint      # Executa ESLint
```

### Backend
```bash
uvicorn main:app --reload  # Inicia servidor com reload automático
```

## 🐛 Problemas Conhecidos

Se encontrar problemas, verifique:
- As variáveis de ambiente estão configuradas corretamente
- O backend está rodando antes de iniciar o frontend
- A chave da API do Google Maps tem as APIs necessárias habilitadas:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Directions API

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de inclusão social.

## 📞 Contato

Para sugestões, dúvidas ou contribuições, abra uma issue ou envie um pull request.

---

**Desenvolvido com ❤️ para tornar a cidade mais acessível para todos.**
