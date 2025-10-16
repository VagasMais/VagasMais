# Estrutura do Projeto Vagas+

## Visão Geral
Esta é uma aplicação React + TypeScript que ajuda pessoas com necessidades especiais a encontrar vagas de estacionamento acessíveis. Todo o código é escrito em inglês para melhor manutenibilidade e colaboração, mas a interface do usuário é em português brasileiro.

## Arquitetura do Projeto

### `/src/types/`
Contém todas as definições de tipos TypeScript e interfaces.
- `parking.ts` - Tipos principais para vagas, coordenadas e rotas
- `index.ts` - Ponto central de exportação para todos os tipos

### `/src/constants/`
Configurações e valores constantes.
- `defaults.ts` - Valores padrão, URLs da API, mensagens de erro e configurações

### `/src/api/`
Camada de serviço da API para comunicação com o backend.
- `parkingSpots.ts` - Funções para buscar dados de vagas do backend
  - Transforma respostas da API em português para definições de tipos em inglês

### `/src/hooks/`
Hooks customizados do React para gerenciamento de estado e efeitos colaterais.
- `useLocation.ts` - Obtém a geolocalização do usuário com fallback para localização padrão
- `useGeocode.ts` - Geocodifica endereços e calcula distâncias entre coordenadas
- `useParkingSpots.ts` - Busca e gerencia dados de vagas
- `useRoute.ts` - Obtém informações de rota (distância/duração) entre dois pontos
- `index.ts` - Ponto central de exportação para todos os hooks

### `/src/utils/`
Funções utilitárias e auxiliares.
- `googleMaps.ts` - Carrega a API JavaScript do Google Maps
- `externalNavigation.ts` - Abre aplicativos de navegação externos (Google Maps/Apple Maps)
- `index.ts` - Ponto central de exportação para todos os utilitários

### `/src/components/`
Componentes React reutilizáveis.
- `ParkingSpotCard.tsx` - Card exibindo informações de uma vaga individual
- `ParkingSpotsList.tsx` - Lista/grade de cards de vagas
- `ParkingMap.tsx` - Componente interativo do Google Maps com marcadores
- `AddressSearchBar.tsx` - Barra de busca com autocomplete do Google Places

### `/src/pages/`
Componentes de nível de página.
- `HomePage.tsx` - Página principal com mapa, busca e lista de vagas
- `AboutPage.tsx` - Informações sobre a missão e recursos do app

### `/src/`
Arquivos no nível raiz.
- `App.tsx` - Componente principal do app com navegação
- `main.tsx` - Ponto de entrada da aplicação
- `App.css` - Estilos globais

## Recursos Principais

### Arquitetura Modular
- Cada funcionalidade é separada em arquivos dedicados
- Separação clara de responsabilidades (types, hooks, components, utils)
- Fácil de manter e estender

### Segurança de Tipos
- Todos os componentes e funções usam tipos TypeScript
- Definições de tipos centralizadas no diretório `/types`
- Nenhum tipo `any` usado

### Hooks Reutilizáveis
- Lógica de negócio extraída em hooks customizados
- Fácil de testar e reutilizar entre componentes
- Código de componentes limpo e focado em renderização

### Componentes Inteligentes
- Componentes recebem props e permanecem flexíveis
- Sem valores hard-coded, tudo configurável via props
- Design responsivo e acessível

## Convenções de Nomenclatura

### Arquivos
- PascalCase para componentes: `ParkingSpotCard.tsx`
- camelCase para hooks: `useLocation.ts`
- camelCase para utilitários: `externalNavigation.ts`
- PascalCase para arquivos de tipos: `Parking.ts`

### Variáveis e Funções
- camelCase para variáveis: `userLocation`, `selectedSpot`
- camelCase para funções: `fetchParkingSpots()`, `calculateDistance()`
- PascalCase para tipos/interfaces: `ParkingSpot`, `Coordinates`
- UPPER_CASE para constantes: `DEFAULT_LOCATION`, `SEARCH_RADIUS_KM`

### Componentes
- Nomes de componentes em PascalCase: `ParkingMap`, `HomePage`
- Interfaces de props nomeadas com componente + "Props": `ParkingMapProps`

## Transformação de Resposta da API

O backend retorna dados em português, mas nós os transformamos para inglês na camada de API:
```typescript
// Resposta do backend (Português)
{
  nome: "Nome da Vaga",
  endereco: "Endereço",
  vagas_disponiveis: 5
}

// Transformado para (Inglês no código)
{
  name: "Nome da Vaga",
  address: "Endereço",
  availableSpots: 5
}
```

**Importante:** Os dados do usuário (nome, endereço) permanecem em português para o usuário final, apenas os nomes das propriedades no código são em inglês.

## Variáveis de Ambiente
- `VITE_BACKEND_URL` - URL da API do backend
- `VITE_GOOGLE_MAPS_API_KEY` - Chave da API do Google Maps

## Melhores Práticas

1. **Responsabilidade Única** - Cada arquivo/função faz uma coisa bem feita
2. **DRY (Don't Repeat Yourself)** - Componentes e hooks reutilizáveis
3. **Segurança de Tipos** - Use tipos TypeScript em todos os lugares
4. **Nomenclatura Clara** - Nomes descritivos em inglês (código) e português (UI)
5. **Documentação** - Comentários JSDoc para funções complexas
6. **Tratamento de Erros** - Mensagens de erro apropriadas e fallbacks
7. **Performance** - Lazy loading, memoização quando apropriado

## Melhorias Futuras

Áreas potenciais para expansão:
- Adicionar sistema de autenticação
- Implementar recurso de reserva de vagas
- Adicionar avaliações e classificações de usuários
- Criar dashboard administrativo para gerenciamento de vagas
- Adicionar atualizações de disponibilidade em tempo real
- Implementar modo offline com service workers

## Filosofia do Código

### Código em Inglês, Interface em Português
- **Código fonte**: Todo em inglês (variáveis, funções, tipos, comentários)
- **Interface do usuário**: Todo em português brasileiro (textos, mensagens, labels)
- **Documentação**: Em português brasileiro (arquivos .md)

Esta abordagem oferece o melhor dos dois mundos:
- Código mantível e colaborativo internacionalmente
- Experiência do usuário totalmente em português
