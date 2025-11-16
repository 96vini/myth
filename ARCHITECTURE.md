# Workflow System Architecture

## Estrutura de Pastas

```
src/components/workflow/
├── constants/                    # Constantes e configurações
│   ├── node-types.ts            # Tipos de nós, origens, métodos, etc.
│   └── index.ts
├── types/                        # TypeScript interfaces
│   ├── node.types.ts            # Tipos para sistema de nós
│   └── sales-flow.types.ts      # Tipos para fluxo de vendas
├── hooks/                        # React hooks reutilizáveis
│   ├── use-node-config.ts       # Hook para gerenciar configuração de nós
│   ├── use-flow-engine.ts       # Lógica de execução do fluxo
│   ├── use-sales-flow.ts        # Lógica específica de vendas
│   └── index.ts
├── utils/                        # Utilitários e factories
│   ├── node-data.factory.ts     # Factory para dados de nós
│   ├── lead-payload.factory.ts  # Factory para LeadPayload
│   └── index.ts
├── nodes/                        # Componentes de nós
│   ├── source/                   # Nós de origem
│   ├── processing/               # Nós de processamento
│   ├── decision/                 # Nós de decisão
│   ├── action/                   # Nós de ação
│   ├── delay/                    # Nós de delay
│   └── end/                      # Nós finais
├── configs/                      # Componentes de configuração
│   ├── origin-node-config.tsx
│   ├── team-node-config.tsx
│   ├── config-registry.ts       # Registry pattern para configs
│   └── index.ts
├── components/                   # Componentes auxiliares
│   └── edge-label.tsx           # Labels para edges
└── ...
```

## Padrões de Arquitetura

### 1. Constants Pattern
**Localização**: `constants/node-types.ts`

Centraliza todas as constantes relacionadas a tipos de nós:
- `ORIGIN_TYPES`: Tipos de origem disponíveis
- `CAPTURE_METHODS`: Métodos de captura
- `REQUIRED_FIELDS`: Campos obrigatórios
- `NODE_TYPES`: Definições de todos os tipos de nós
- `ORIGIN_ICONS` / `ORIGIN_LABELS`: Mapeamentos de ícones e labels

**Vantagens**:
- Fácil adicionar novos tipos
- Single source of truth
- Type-safe com TypeScript

### 2. Registry Pattern
**Localização**: `configs/config-registry.ts`

Registry pattern para componentes de configuração:
```typescript
CONFIG_REGISTRY[nodeType] = ConfigComponent
getConfigComponent(nodeType) // Retorna componente ou null
```

**Vantagens**:
- Adicionar novos configs sem modificar o painel principal
- Desacoplamento entre painel e configs
- Fácil extensão

### 3. Factory Pattern
**Localização**: `utils/node-data.factory.ts`

Cria dados padrão para nós:
```typescript
NodeDataFactory.createDefaultData(nodeType)
NodeDataFactory.updateNodeData(node, updates)
```

**Vantagens**:
- Dados consistentes
- Fácil adicionar novos tipos
- Centralização de lógica de criação

### 4. Custom Hook Pattern
**Localização**: `hooks/use-node-config.ts`

Hook reutilizável para gerenciar configuração:
```typescript
const { config, updateConfig, updateConfigMultiple } = useNodeConfig({
  node,
  onUpdate,
  defaultConfig
})
```

**Vantagens**:
- Lógica reutilizável
- Estado gerenciado automaticamente
- Fácil testar

## Como Adicionar Novas Regras

### 1. Adicionar Novo Tipo de Origem

**Passo 1**: Atualizar `constants/node-types.ts`
```typescript
export const ORIGIN_TYPES = [
  // ... existentes
  { value: "novo_tipo", label: "Novo Tipo", icon: NovoIcon, color: "#color" },
]
```

**Passo 2**: Atualizar mapeamentos
```typescript
export const ORIGIN_ICONS = {
  // ... existentes
  novo_tipo: NovoIcon,
}

export const ORIGIN_LABELS = {
  // ... existentes
  novo_tipo: "Novo Tipo",
}
```

### 2. Adicionar Novo Tipo de Nó

**Passo 1**: Adicionar em `constants/node-types.ts`
```typescript
export const NODE_TYPES = {
  // ... existentes
  novo_no: { label: "Novo Nó", icon: Icon, description: "Descrição" },
}
```

**Passo 2**: Criar componente do nó em `nodes/`
```typescript
// nodes/novo-no.tsx
export function NovoNo({ id, data, selected }: NodeProps) {
  // Implementação
}
```

**Passo 3**: Criar config em `configs/`
```typescript
// configs/novo-no-config.tsx
export function NovoNoConfig({ node, onUpdate }: Props) {
  const { config, updateConfig } = useNodeConfig({
    node,
    onUpdate,
    defaultConfig: { /* defaults */ }
  })
  // UI
}
```

**Passo 4**: Registrar no registry
```typescript
// configs/config-registry.ts
import { NovoNoConfig } from "./novo-no-config"

export const CONFIG_REGISTRY = {
  // ... existentes
  novo_no: NovoNoConfig,
}
```

**Passo 5**: Registrar no ReactFlow
```typescript
// workflow/page.tsx
nodeTypes={{
  // ... existentes
  novo_no: NovoNo,
}}
```

### 3. Adicionar Novas Regras de Validação

**Passo 1**: Criar arquivo de validação
```typescript
// utils/validation-rules.ts
export const VALIDATION_RULES = {
  origin: {
    requiredFields: (data) => data.requiredFields?.length > 0,
    minScore: (data) => data.minScore >= 0 && data.minScore <= 100,
  },
  // ... outras regras
}
```

**Passo 2**: Usar no hook ou componente
```typescript
import { VALIDATION_RULES } from "../utils/validation-rules"

const isValid = VALIDATION_RULES.origin.requiredFields(config)
```

## Boas Práticas

### 1. Separação de Responsabilidades
- **Constants**: Apenas dados estáticos
- **Hooks**: Lógica de estado e efeitos
- **Utils**: Funções puras e factories
- **Components**: Apenas UI

### 2. Type Safety
- Sempre usar interfaces TypeScript
- Evitar `any` quando possível
- Usar tipos específicos para cada contexto

### 3. Extensibilidade
- Usar Registry Pattern para extensões
- Factory Pattern para criação de dados
- Hooks reutilizáveis para lógica comum

### 4. Manutenibilidade
- Um arquivo por responsabilidade
- Nomes descritivos
- Comentários apenas quando necessário
- Estrutura de pastas clara

## Exemplo: Adicionar Regra de Validação

```typescript
// utils/validation-rules.ts
export interface ValidationRule {
  name: string
  validate: (data: any) => boolean
  message: string
}

export const ORIGIN_VALIDATION_RULES: ValidationRule[] = [
  {
    name: "requiredFields",
    validate: (data) => data.requiredFields?.length > 0,
    message: "Pelo menos um campo obrigatório deve ser selecionado",
  },
  {
    name: "minScore",
    validate: (data) => !data.autoQualify || (data.minScore >= 0 && data.minScore <= 100),
    message: "Score mínimo deve estar entre 0 e 100",
  },
]

// Usar no componente
import { ORIGIN_VALIDATION_RULES } from "../utils/validation-rules"

const errors = ORIGIN_VALIDATION_RULES
  .filter(rule => !rule.validate(config))
  .map(rule => rule.message)
```

## Estrutura de Dados Padrão

Todos os nós seguem esta estrutura base:
```typescript
{
  label: string
  isEditing?: boolean
  // ... campos específicos do tipo
}
```

Use `NodeDataFactory.createDefaultData()` para criar dados iniciais.

