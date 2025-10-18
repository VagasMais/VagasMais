# Estrutura do Projeto Vagas+

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura do Frontend](#arquitetura-do-frontend)
- [Arquitetura do Backend](#arquitetura-do-backend)
- [Recursos Principais](#recursos-principais)
- [Convenções de Nomenclatura](#convenções-de-nomenclatura)
- [Transformação de Dados da API](#transformação-de-dados-da-api)
- [Fluxo de Dados](#fluxo-de-dados)
- [Melhores Práticas](#melhores-práticas)
- [Melhorias Futuras](#melhorias-futuras)

## Visão Geral

Esta é uma aplicação React + TypeScript que ajuda pessoas com necessidades especiais (PcD, gestantes e idosos) a encontrar vagas de estacionamento acessíveis. Todo o código é escrito em inglês para melhor manutenibilidade e colaboração internacional, mas a interface do usuário é em português brasileiro.

### Filosofia do Código

**Código em Inglês, Interface em Português**
- **Código fonte**: Todo em inglês (variáveis, funções, tipos, comentários técnicos)
- **Interface do usuário**: Todo em português brasileiro (textos, mensagens, labels)
- **Documentação**: Em português brasileiro (arquivos .md)

Esta abordagem oferece:
- Código mantível e colaborativo internacionalmente
- Experiência do usuário totalmente em português
- Facilita contribuições de desenvolvedores de qualquer nacionalidade

---

## Arquitetura do Frontend

### Estrutura de Diretórios

```
frontend/@latest/src/
├── api/                          # Camada de serviço da API
│   ├── parkingSpots.ts           # CRUD de vagas
│   └── denuncias.ts              # CRUD de denúncias
├── components/                   # Componentes React reutilizáveis
│   ├── AddressSearchBar.tsx      # Busca com autocomplete
│   ├── Footer.tsx                # Rodapé do app
│   ├── NavigationModal.tsx       # Modal de escolha de navegação
│   ├── ParkingMap.tsx            # Mapa interativo
│   ├── ParkingSpotCard.tsx       # Card de vaga individual
│   ├── ParkingSpotsList.tsx      # Lista de vagas
│   └── ReportForm.tsx            # Formulário de denúncia
├── constants/
│   └── defaults.ts               # Constantes e configurações
├── hooks/                        # Custom hooks do React
│   ├── useGeocode.ts             # Geocodificação e cálculo de distância
│   ├── useLocation.ts            # Geolocalização do usuário
│   ├── useParkingSpots.ts        # Gerenciamento de dados de vagas
│   ├── useRoute.ts               # Informações de rota
│   └── index.ts                  # Exportação central
├── pages/                        # Componentes de página
│   ├── AboutPage.tsx             # Página sobre o app
│   ├── DenunciasPage.tsx         # Página de denúncias
│   ├── HomePage.tsx              # Página inicial
│   └── MapPage.tsx               # Página do mapa
├── styles/
│   └── ReportForm.css            # Estilos do formulário
├── types/
│   ├── parking.ts                # Tipos principais
│   └── index.ts                  # Exportação central
├── utils/                        # Funções utilitárias
│   ├── externalNavigation.ts     # Navegação externa (Maps, Waze)
│   ├── googleMaps.ts             # Carregador da API do Google Maps
│   └── index.ts                  # Exportação central
├── App.tsx                       # Componente principal
├── App.css                       # Estilos globais
├── main.tsx                      # Ponto de entrada
└── index.css                     # Estilos base
```

---

### `/src/types/` - Definições de Tipos TypeScript

#### `parking.ts`
Define as interfaces e tipos principais usados em toda a aplicação:

```typescript
// Coordenadas geográficas
interface Coordinates {
  lat: number
  lng: number
}

// Informações de rota
interface RouteInfo {
  distance: string
  duration: string
}

// Vaga de estacionamento
interface ParkingSpot {
  _id: string
  name: string
  address: string
  latitude: number
  longitude: number
  accessible: boolean
  totalSpots: number
  availableSpots: number
  vaga_gestante: boolean   // Para gestantes
  vaga_idoso: boolean       // Para idosos
  vaga_pcd: boolean         // Para PcD
}

// Denúncia de infração
interface Denuncia {
  _id?: string
  endereco: string
  latitude?: number
  longitude?: number
  tipo_vaga: 'pregnant' | 'elderly' | 'disabled'
  tipo_infracao: 'no_credential' | 'blocking_access' | 'misuse' | 'other'
  descricao: string
  midias: string[]          // Base64 de imagens/vídeos
  data_criacao?: string
  status?: 'pendente' | 'em_analise' | 'resolvida' | 'arquivada'
}
```

---

### `/src/constants/` - Configurações e Valores Constantes

#### `defaults.ts`
Centraliza todas as configurações, URLs da API e mensagens:

```typescript
// Raios de busca em quilômetros
export const SEARCH_RADIUS_KM = 3      // Raio para listar vagas
export const NEARBY_RADIUS_KM = 0.5    // Raio para destacar no mapa

// Configuração do mapa
export const DEFAULT_ZOOM = 14
export const FOCUSED_ZOOM = 15

// URLs da API
export const API_URL = import.meta.env.VITE_BACKEND_URL
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Mensagens de erro
export const ERROR_MESSAGES = {
  LOCATION_UNAVAILABLE: 'Não foi possível obter sua localização...',
  FETCH_SPOTS_FAILED: 'Não foi possível carregar as vagas...',
  // ... outras mensagens
}
```

---

### `/src/api/` - Camada de Serviço da API

#### `parkingSpots.ts`
Gerencia comunicação com o backend para vagas:

```typescript
// Buscar todas as vagas
export async function fetchParkingSpots(): Promise<ParkingSpot[]>

// Transforma resposta do backend (português) para tipos (inglês)
// Backend: { nome, endereco, vagas_disponiveis }
// Frontend: { name, address, availableSpots }
```

#### `denuncias.ts`
Gerencia denúncias de infrações:

```typescript
// Criar denúncia
export async function submitDenuncia(denuncia: Denuncia): Promise<void>

// Buscar denúncias
export async function fetchDenuncias(status?: string): Promise<Denuncia[]>

// Buscar denúncia específica
export async function fetchDenuncia(id: string): Promise<Denuncia>

// Atualizar status
export async function updateDenunciaStatus(
  id: string,
  status: string
): Promise<void>

// Deletar denúncia
export async function deleteDenuncia(id: string): Promise<void>
```

---

### `/src/hooks/` - Custom Hooks do React

#### `useLocation.ts`
Obtém e gerencia a geolocalização do usuário.

**Características:**
- Estratégia de fallback: baixa precisão (rápido) → alta precisão (GPS)
- Cache de geolocalização por 5 minutos
- Tratamento de erros detalhado
- Localização fake para testes: `-23.5505, -46.6333` (São Paulo)

```typescript
const { location, error } = useLocation()
// location: { lat: number, lng: number } | null
// error: string | null
```

#### `useGeocode.ts`
Geocodificação e cálculo de distâncias.

**Funções:**
- `geocodeAddress(address: string)` - Converte endereço em coordenadas
- `calculateDistance(from: Coordinates, to: Coordinates)` - Calcula distância em km (fórmula de Haversine)
- `reverseGeocode(coords: Coordinates)` - Converte coordenadas em endereço

```typescript
const { geocodeAddress, calculateDistance, reverseGeocode } = useGeocode()
```

#### `useParkingSpots.ts`
Busca e gerencia dados de vagas do backend.

```typescript
const { spots, loading, error, refetch } = useParkingSpots()
// spots: ParkingSpot[]
// loading: boolean
// error: string | null
// refetch: () => Promise<void>
```

#### `useRoute.ts`
Obtém informações de rota entre dois pontos.

**Retorna:**
- Distância formatada (ex: "2.5 km")
- Duração formatada (ex: "8 min")
- Considera trânsito se disponível

```typescript
const { distance, duration, loading, error } = useRoute(origin, destination)
```

---

### `/src/utils/` - Funções Utilitárias

#### `googleMaps.ts`
Carrega dinamicamente a API JavaScript do Google Maps.

**Características:**
- Previne múltiplos carregamentos simultâneos
- Inclui biblioteca Places para autocomplete
- Validação de chave de API

```typescript
export function loadGoogleMapsAPI(): Promise<void>
```

#### `externalNavigation.ts`
Abre aplicativos de navegação externos.

**Funções:**
- `openGoogleMaps(lat, lng, label?)` - Abre Google Maps (app ou web)
- `openWaze(lat, lng)` - Abre Waze (app ou web)
- Detecção de plataforma (iOS, Android, Desktop)
- Deep links para apps nativos
- Fallback para versão web

```typescript
openGoogleMaps(-23.5505, -46.6333, 'Minha Vaga')
openWaze(-23.5505, -46.6333)
```

---

### `/src/components/` - Componentes React Reutilizáveis

#### `AddressSearchBar.tsx`
Barra de busca com autocomplete do Google Places.

**Props:**
```typescript
interface AddressSearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  onSelectAddress: (address: string, coords: Coordinates) => void
  placeholder?: string
}
```

**Características:**
- Suporta API legada e nova do Places
- Filtra resultados apenas para o Brasil
- Session tokens para otimização de billing
- Fallback automático se nova API falhar

#### `ParkingMap.tsx`
Mapa interativo do Google Maps com marcadores de vagas.

**Props:**
```typescript
interface ParkingMapProps {
  spots: ParkingSpot[]
  userLocation: Coordinates | null
  onSelectSpot: (spot: ParkingSpot | null) => void
  error: string
  setError: (error: string) => void
  setSelectedSpot: (spot: ParkingSpot | null) => void
  googleMapRef: React.MutableRefObject<google.maps.Map | null>
  nearbySpotIds: string[]  // IDs das vagas próximas para destacar
}
```

**Características:**
- Marcadores coloridos por tipo:
  - 🟠 Laranja: PcD
  - 🔵 Azul: Gestante
  - 🩷 Rosa: Idoso
- Marcador azul para localização do usuário
- Clique no marcador seleciona a vaga
- Destaca vagas próximas (dentro de 500m)

#### `ParkingSpotCard.tsx`
Card exibindo informações de uma vaga individual.

**Props:**
```typescript
interface ParkingSpotCardProps {
  spot: ParkingSpot
  isSelected: boolean
  onSelect: () => void
  onViewRoute?: () => void
  onNavigate?: () => void
  routeInfo?: RouteInfo | null
}
```

**Características:**
- Mostra disponibilidade (Livre/Lotada)
- Exibe ícones por tipo de vaga
- Botões para ver rota e navegar
- Informações de distância e tempo
- Efeito visual quando selecionado

#### `ParkingSpotsList.tsx`
Grid de cards de vagas com contador.

**Props:**
```typescript
interface ParkingSpotsListProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSelect: (spot: ParkingSpot) => void
  onViewRoute?: (spot: ParkingSpot) => void
  onNavigate?: (spot: ParkingSpot) => void
  userLocation: Coordinates | null
}
```

**Características:**
- Grid responsivo (1-3 colunas)
- Contador de vagas próximas
- Integra ParkingSpotCard
- Obtém informações de rota para cada vaga

#### `ReportForm.tsx`
Formulário completo para denúncia de infrações.

**Props:**
```typescript
interface ReportFormProps {
  onSubmitSuccess: () => void
}
```

**Características:**
- Upload de até 3 arquivos (imagens/vídeos, máx 10MB cada)
- Tipos de vaga: PcD, Gestante, Idoso
- Tipos de infração: Sem credencial, Bloqueio, Uso indevido, Outro
- Detecção automática de localização
- Geocodificação reversa para endereço
- Validação de formulário
- Conversão de arquivos para base64

#### `NavigationModal.tsx`
Modal para escolher entre Google Maps e Waze.

**Props:**
```typescript
interface NavigationModalProps {
  isOpen: boolean
  onClose: () => void
  origin: Coordinates | null
  destinationLat: number
  destinationLng: number
  destinationName: string
}
```

#### `Footer.tsx`
Rodapé do aplicativo com links e informações.

**Características:**
- Links de navegação
- Redes sociais
- Informações de contato
- Copyright

---

### `/src/pages/` - Componentes de Página

#### `HomePage.tsx`
Página inicial com hero e apresentação do app.

**Seções:**
- Hero com vídeo de fundo
- Como funciona (3 passos)
- Grade de funcionalidades (7 features)
- Call-to-action para mapa
- Footer

#### `MapPage.tsx`
Interface principal do mapa e busca.

**Características:**
- Barra de busca de endereço
- Mapa interativo
- Lista de vagas filtradas
- Desenho de rota no mapa
- Modal de navegação
- Tratamento de erros (localização, vagas)

**Lógica de Filtragem:**
```typescript
// Filtrar vagas por texto OU proximidade
const filteredSpots = spots.filter(spot => {
  // Se há busca de texto
  const matchesText = spot.name.includes(searchQuery) ||
                     spot.address.includes(searchQuery)

  // Se há endereço selecionado, filtrar por raio de 3km
  if (selectedAddress) {
    const distance = calculateDistance(selectedAddress, spotCoords)
    return distance <= SEARCH_RADIUS_KM  // 3km
  }

  return matchesText
})

// Vagas muito próximas para destaque (500m)
const nearbySpotIds = selectedAddress
  ? spots.filter(spot =>
      calculateDistance(selectedAddress, spotCoords) <= NEARBY_RADIUS_KM
    ).map(s => s._id)
  : []
```

#### `DenunciasPage.tsx`
Página para reportar infrações.

**Seções:**
- Formulário de denúncia
- Informações educativas
- Canais oficiais (153, NITTRANS, DETRAN)
- Penalidades e legislação
- Footer

#### `AboutPage.tsx`
Informações sobre o aplicativo.

**Seções:**
- Missão do projeto
- Explicação de funcionalidades
- Como usar (3 passos)
- Informações de contato
- Footer

---

## Arquitetura do Backend

### Estrutura de Diretórios

```
backend/
├── db/
│   └── database.py               # Configuração MongoDB
├── models/
│   ├── vaga.py                   # Modelo de vaga
│   └── denuncia.py               # Modelo de denúncia
├── routes/
│   ├── vagas.py                  # Rotas de vagas
│   └── denuncias.py              # Rotas de denúncias
├── main.py                       # App FastAPI principal
├── requirements.txt              # Dependências Python
└── .env                          # Variáveis de ambiente
```

---

### Modelos de Dados

#### Vaga (Parking Spot)
```python
{
  "_id": ObjectId,
  "nome": str,                    # Nome da vaga
  "latitude": float,
  "longitude": float,
  "endereco": str,
  "acessivel": bool,
  "total_vagas": int,
  "vagas_disponiveis": int,
  "vaga_gestante": bool,
  "vaga_idoso": bool,
  "vaga_pcd": bool
}
```

#### Denúncia (Violation Report)
```python
{
  "_id": ObjectId,
  "endereco": str,
  "latitude": Optional[float],
  "longitude": Optional[float],
  "tipo_vaga": str,               # 'pregnant', 'elderly', 'disabled'
  "tipo_infracao": str,           # 'no_credential', 'blocking_access', etc
  "descricao": str,
  "midias": List[str],            # Base64 de imagens/vídeos
  "data_criacao": datetime,
  "status": str                   # 'pendente', 'em_analise', 'resolvida', 'arquivada'
}
```

---

### Endpoints da API

#### Vagas
- **GET /** - Health check
- **GET /vagas** - Lista todas as vagas
- **POST /vagas** - Cria nova vaga
- **GET /vagas/{id}** - Busca vaga específica
- **DELETE /vagas/{id}** - Deleta vaga

#### Denúncias
- **POST /denuncias** - Cria denúncia
- **GET /denuncias?status={status}** - Lista denúncias (filtro opcional)
- **GET /denuncias/{id}** - Busca denúncia específica
- **PATCH /denuncias/{id}/status** - Atualiza status
- **DELETE /denuncias/{id}** - Deleta denúncia

---

### Configuração do Banco de Dados

**MongoDB Atlas** com:
- Conexão TLS criptografada
- Certificados SSL via `certifi`
- Ping para verificação de conexão
- Tratamento de erros de rede

```python
# database.py
from pymongo import MongoClient
import certifi

client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)
db = client.vagasmais
```

---

## Recursos Principais

### 1. Sistema de Busca Inteligente

**Dois raios de busca:**
- **3 km (SEARCH_RADIUS_KM)** - Filtra vagas para exibição na lista
- **500 m (NEARBY_RADIUS_KM)** - Destaca vagas muito próximas no mapa

**Fluxo:**
1. Usuário busca endereço
2. Mapa centraliza no endereço
3. Sistema filtra vagas dentro de 3km
4. Vagas dentro de 500m são destacadas com marcadores especiais
5. Lista exibe apenas vagas dentro de 3km

### 2. Sistema de Geolocalização

**Estratégia de Fallback:**
1. Tenta obter localização de baixa precisão (rápido)
2. Se bem-sucedido, tenta obter alta precisão (GPS)
3. Cache por 5 minutos para evitar requisições repetidas
4. Em desenvolvimento, usa localização fake de São Paulo

**Tratamento de Erros:**
- Permissão negada
- Posição indisponível
- Timeout
- Navegador não suporta

### 3. Sistema de Navegação Externa

**Detecção de Plataforma:**
```typescript
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const isAndroid = /Android/.test(navigator.userAgent)
```

**Deep Links:**
- **iOS Google Maps**: `comgooglemaps://?daddr=lat,lng`
- **Android Google Maps**: Intent com `google.navigation:q=lat,lng`
- **Waze**: `waze://?ll=lat,lng&navigate=yes`

**Fallback:**
- Se app não instalado, abre versão web
- Google Maps Web: `https://www.google.com/maps/dir/?api=1&destination=`
- Waze Web: `https://waze.com/ul?ll=lat,lng&navigate=yes`

### 4. Upload e Processamento de Mídia

**Características:**
- Até 3 arquivos por denúncia
- Suporte a imagens e vídeos
- Limite de 10MB por arquivo
- Conversão para base64 antes do envio

**Fluxo:**
```typescript
1. Usuário seleciona arquivos
2. Validação de tamanho (< 10MB)
3. Validação de quantidade (≤ 3)
4. Conversão para base64
5. Envio para API
6. Armazenamento no MongoDB
```

### 5. Sistema de Marcadores no Mapa

**Cores por Tipo:**
```typescript
// PcD - Laranja
color: '#FF8C00'

// Gestante - Azul
color: '#4169E1'

// Idoso - Rosa
color: '#FF69B4'
```

**Estados:**
- Normal: Tamanho padrão
- Destacado (nearby): Tamanho maior, borda branca
- Selecionado: Animação bounce

---

## Convenções de Nomenclatura

### Arquivos
- **Componentes**: PascalCase - `ParkingSpotCard.tsx`
- **Hooks**: camelCase com prefixo 'use' - `useLocation.ts`
- **Utilitários**: camelCase - `externalNavigation.ts`
- **Tipos**: PascalCase - `Parking.ts`
- **Constantes**: camelCase - `defaults.ts`

### Variáveis e Funções
- **Variáveis**: camelCase - `userLocation`, `selectedSpot`
- **Funções**: camelCase - `fetchParkingSpots()`, `calculateDistance()`
- **Tipos/Interfaces**: PascalCase - `ParkingSpot`, `Coordinates`
- **Constantes**: UPPER_CASE - `DEFAULT_ZOOM`, `SEARCH_RADIUS_KM`

### Componentes
- **Nome**: PascalCase - `ParkingMap`, `HomePage`
- **Props Interface**: Nome + "Props" - `ParkingMapProps`
- **Variáveis de estado**: camelCase descritivo

---

## Transformação de Dados da API

O backend retorna dados em português, mas a camada de API transforma para inglês:

### Backend (Português)
```python
{
  "nome": "Vaga Shopping",
  "endereco": "Av. Paulista, 1000",
  "vagas_disponiveis": 5,
  "total_vagas": 10,
  "vaga_pcd": True
}
```

### Frontend (Inglês - Código)
```typescript
{
  name: "Vaga Shopping",
  address: "Av. Paulista, 1000",
  availableSpots: 5,
  totalSpots: 10,
  vaga_pcd: true
}
```

**Importante:** Os dados do usuário (nome, endereço) permanecem em português para o usuário final. Apenas os nomes das propriedades no código são em inglês.

---

## Fluxo de Dados

### 1. Fluxo de Carregamento de Vagas

```
[Usuário acessa MapPage]
       ↓
[useParkingSpots executa]
       ↓
[fetchParkingSpots() - API]
       ↓
[Backend retorna vagas em português]
       ↓
[Transformação para inglês]
       ↓
[Estado atualizado com vagas]
       ↓
[ParkingMap renderiza marcadores]
[ParkingSpotsList renderiza cards]
```

### 2. Fluxo de Busca de Endereço

```
[Usuário digita na AddressSearchBar]
       ↓
[Google Places Autocomplete sugere]
       ↓
[Usuário seleciona endereço]
       ↓
[onSelectAddress retorna coordenadas]
       ↓
[MapPage atualiza selectedAddress]
       ↓
[Mapa centraliza nas coordenadas]
       ↓
[Vagas são filtradas por raio de 3km]
       ↓
[Vagas dentro de 500m são destacadas]
       ↓
[Lista atualiza com vagas filtradas]
```

### 3. Fluxo de Navegação

```
[Usuário clica em "Navegar"]
       ↓
[Modal abre com opções]
       ↓
[Usuário escolhe app (Maps/Waze)]
       ↓
[Detecção de plataforma]
       ↓
[Tentativa de deep link]
       ↓
[Se falhar, abre versão web]
```

### 4. Fluxo de Denúncia

```
[Usuário preenche formulário]
       ↓
[Seleciona arquivos de mídia]
       ↓
[Validação (tamanho, quantidade)]
       ↓
[Conversão para base64]
       ↓
[submitDenuncia() - API]
       ↓
[Backend salva no MongoDB]
       ↓
[Feedback de sucesso/erro]
```

---

## Melhores Práticas

### 1. Responsabilidade Única
Cada arquivo/função faz uma coisa bem feita:
- Componentes focam em renderização
- Hooks gerenciam lógica de estado
- Utils fornecem funções auxiliares
- API faz comunicação com backend

### 2. DRY (Don't Repeat Yourself)
- Componentes reutilizáveis
- Hooks customizados extraem lógica comum
- Constantes centralizadas
- Exportação centralizada por diretório

### 3. Segurança de Tipos
- **100% TypeScript** no frontend
- Nenhum uso de `any`
- Interfaces bem definidas
- Props tipadas para componentes

### 4. Nomenclatura Clara
- Nomes descritivos em inglês (código)
- Mensagens em português (UI)
- Comentários explicativos quando necessário
- JSDoc para funções complexas

### 5. Tratamento de Erros
- Try-catch em operações assíncronas
- Mensagens de erro amigáveis
- Estados de loading
- Fallbacks apropriados

### 6. Performance
- Lazy loading de Google Maps API
- Cache de geolocalização (5 min)
- Session tokens para Places API
- Debounce em inputs de busca (se necessário)

### 7. Acessibilidade
- HTML semântico
- Labels descritivos
- Contraste de cores adequado
- Foco em usabilidade para pessoas com necessidades especiais

---

## Melhorias Futuras

### Backend
1. **Autenticação e Autorização** - Sistema de login para usuários e administradores
2. **Rate Limiting** - Proteção contra abuso da API
3. **Logging** - Sistema de logs estruturado
4. **Testes** - Cobertura de testes unitários e integração
5. **Validação de Dados** - Pydantic models para validação robusta
6. **Paginação** - Para endpoints que retornam muitos dados
7. **WebSocket** - Atualizações em tempo real de disponibilidade

### Frontend
1. **Sistema de Reservas** - Permitir reservar vagas com antecedência
2. **Avaliações e Reviews** - Usuários podem avaliar vagas
3. **Dashboard Admin** - Interface para gerenciar vagas e denúncias
4. **Modo Offline Completo** - Service workers para offline total
5. **Multi-idioma** - Internacionalização (i18n)
6. **Analytics** - Dashboard de uso e estatísticas
7. **Notificações Push** - Alertas sobre vagas e denúncias
8. **Histórico de Navegação** - Salvar vagas favoritas e rotas recentes
9. **Filtros Avançados** - Por tipo de vaga, distância, disponibilidade
10. **Modo Escuro** - Theme switcher

### Infraestrutura
1. **CI/CD** - Pipeline automatizado
2. **Docker** - Containerização da aplicação
3. **Monitoramento** - APM e health checks
4. **Backup Automático** - Backup do MongoDB
5. **CDN** - Para assets estáticos
6. **Mobile App** - React Native para iOS e Android

---

## Variáveis de Ambiente

### Frontend
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### Backend
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/vagasmais
```

### APIs Necessárias no Google Cloud
- Maps JavaScript API
- Places API (New)
- Places API (Legacy)
- Geocoding API
- Directions API

---

## Resumo da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                     USUÁRIO                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (React + TypeScript)          │
├─────────────────────────────────────────────────────────┤
│  Pages  │  Components  │  Hooks  │  Utils  │  API      │
│         │              │         │         │           │
│ - Home  │ - Map        │ - Location       │ - External│
│ - Map   │ - Cards      │ - Geocode        │   Nav     │
│ - About │ - Search     │ - Parking        │ - Maps    │
│ - Report│ - Modal      │ - Route          │   Loader  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (FastAPI + Python)                 │
├─────────────────────────────────────────────────────────┤
│  Routes         │  Models        │  Database            │
│                 │                │                      │
│  - /vagas       │  - Vaga        │  MongoDB Atlas      │
│  - /denuncias   │  - Denuncia    │  (Cloud NoSQL)      │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SERVIÇOS EXTERNOS                          │
├─────────────────────────────────────────────────────────┤
│  Google Maps API  │  Google Places  │  Geocoding        │
└─────────────────────────────────────────────────────────┘
```

---

**Este documento deve ser atualizado conforme o projeto evolui.**
