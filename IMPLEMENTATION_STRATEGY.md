# Sales Flow Implementation Strategy

## Overview
This document outlines the implementation strategy for the sales flow system following the pattern: **Origin → Lead → Qualification → Follow-up → Offer → Decision → Sale or Loss**.

## Architecture

### Folder Structure
```
src/components/workflow/
├── types/
│   └── sales-flow.types.ts          # TypeScript interfaces for all stages
├── nodes/
│   ├── origin-node.tsx              # Origin stage component
│   ├── lead-node.tsx                # Lead stage component (extends existing)
│   ├── qualification-node.tsx       # Qualification stage component
│   ├── followup-node.tsx            # Follow-up stage component
│   ├── offer-node.tsx               # Offer stage component
│   ├── decision-node.tsx            # Decision stage component
│   ├── sale-node.tsx                # Sale outcome component
│   └── loss-node.tsx                # Loss outcome component
├── configs/
│   ├── origin-node-config.tsx       # Origin configuration panel
│   ├── qualification-node-config.tsx # Qualification configuration panel
│   ├── followup-node-config.tsx     # Follow-up configuration panel
│   ├── offer-node-config.tsx        # Offer configuration panel
│   ├── decision-node-config.tsx     # Decision configuration panel
│   ├── sale-node-config.tsx         # Sale configuration panel
│   └── loss-node-config.tsx         # Loss configuration panel
├── hooks/
│   └── use-sales-flow.ts            # Business logic for flow transitions
└── utils/
    └── sales-flow-validators.ts    # Validation utilities
```

## Component Specifications

### 1. Origin Node (`origin-node.tsx`)
**Purpose**: Entry point for all leads
**Visual**: Green badge with "ORIGEM" label, Globe icon
**Connections**: Single source handle (bottom) → connects to Lead
**Data Structure**: `OriginNodeData`
- `source`: Lead origin channel
- `captureMethod`: How lead was captured
- `autoQualify`: Auto-qualification flag
- `minScore`: Minimum score threshold

**State Transitions**:
- Origin → Lead (automatic or conditional)

### 2. Lead Node (`lead-node.tsx`)
**Purpose**: Lead management and initial processing
**Visual**: Extends existing lead node, uses existing config
**Connections**: Target (top) from Origin, Source (bottom) to Qualification
**Data Structure**: `LeadNodeData` (already exists)
**State Transitions**:
- Lead → Qualification (after scoring/validation)

### 3. Qualification Node (`qualification-node.tsx`)
**Purpose**: Lead scoring and qualification
**Visual**: Blue badge with "QUALIFICAÇÃO" label, CheckCircle2 icon
**Connections**: Target (top) from Lead, Source (bottom) to Follow-up
**Data Structure**: `QualificationNodeData`
- `criteria`: Array of qualification criteria
- `scoringRules`: Scoring rules with weights
- `autoAdvance`: Auto-advance qualified leads
- `minScore`: Minimum qualification score
- `enableAI`: AI-powered qualification

**State Transitions**:
- Qualification → Follow-up (qualified)
- Qualification → Loss (disqualified, optional)

### 4. Follow-up Node (`followup-node.tsx`)
**Purpose**: Automated follow-up sequences
**Visual**: Yellow badge with "FOLLOW-UP" label, Clock icon
**Connections**: Target (top) from Qualification, Source (bottom) to Offer
**Data Structure**: `FollowUpNodeData`
- `strategy`: Follow-up strategy type
- `delay`: Delay before follow-up
- `maxAttempts`: Maximum follow-up attempts
- `channels`: Communication channels
- `template`: Message template

**State Transitions**:
- Follow-up → Offer (after engagement)
- Follow-up → Decision (timeout/no response)

### 5. Offer Node (`offer-node.tsx`)
**Purpose**: Present offers and proposals
**Visual**: Purple badge with "OFERTA" label, Gift icon
**Connections**: Target (top) from Follow-up, Source (bottom) to Decision
**Data Structure**: `OfferNodeData`
- `offerType`: Type of offer
- `value`: Offer value
- `currency`: Currency code
- `validUntil`: Offer expiration
- `conditions`: Offer conditions
- `personalization`: Personalization flag

**State Transitions**:
- Offer → Decision (after presentation)

### 6. Decision Node (`decision-node.tsx`)
**Purpose**: Decision point with multiple outcomes
**Visual**: Orange badge with "DECISÃO" label, Scale icon
**Connections**: 
- Target (top) from Offer
- Source (left) → Sale (green handle)
- Source (right) → Loss (red handle)
- Source (bottom) → Follow-up (yellow handle, optional)

**Data Structure**: `DecisionNodeData`
- `timeout`: Decision timeout period
- `autoDecision`: Auto-decision on timeout
- `defaultPath`: Default path if timeout
- `requireConfirmation`: Require explicit confirmation

**State Transitions**:
- Decision → Sale (accepted)
- Decision → Loss (rejected)
- Decision → Follow-up (needs more time)

### 7. Sale Node (`sale-node.tsx`)
**Purpose**: Successful sale completion
**Visual**: Green badge with "VENDA" label, CheckCircle icon, green border
**Connections**: Target (top) from Decision (left handle)
**Data Structure**: `SaleNodeData`
- `celebrationMessage`: Success message
- `nextSteps`: Post-sale actions
- `assignToTeam`: Team assignment flag
- `createTask`: Create follow-up task
- `sendReceipt`: Send receipt flag

**State Transitions**: Terminal node (no outgoing connections)

### 8. Loss Node (`loss-node.tsx`)
**Purpose**: Lost sale handling
**Visual**: Red badge with "PERDA" label, XCircle icon, red border
**Connections**: Target (top) from Decision (right handle)
**Data Structure**: `LossNodeData`
- `reason`: Loss reason
- `feedbackRequest`: Request feedback flag
- `reEngageStrategy`: Re-engagement strategy
- `reEngageDelay`: Delay before re-engagement
- `saveForFuture`: Save for future contact

**State Transitions**: Terminal node (no outgoing connections)

## React Flow Integration

### Node Registration
```typescript
nodeTypes={{
  origin: OriginNode,
  lead: LeadNode, // Extends existing
  qualification: QualificationNode,
  followup: FollowUpNode,
  offer: OfferNode,
  decision: DecisionNode,
  sale: SaleNode,
  loss: LossNode,
}}
```

### Edge Configuration
- All edges use `smoothstep` type (curved)
- Color: `hsl(var(--primary))` (#23b559)
- Animated: `true`
- Marker: ArrowClosed

### Connection Validation
The `useSalesFlow` hook provides `canConnect()` function that validates:
- Sequential flow (Origin → Lead → Qualification → ...)
- Decision node special rules (3 outputs: Sale, Loss, Follow-up)
- Terminal nodes (Sale/Loss) cannot have outgoing connections

## State Management

### Node Data Updates
- Use `updateNodeData` from `useReactFlow()` hook
- Maintain type safety with TypeScript interfaces
- Sync editing state with `isEditing` flag

### Flow Validation
- `validateFlow()` checks:
  - At least one Origin node exists
  - At least one Sale or Loss node exists
  - Decision nodes have both Sale and Loss connections
  - Flow follows sequential order

## Configuration Panels

Each node type has a corresponding config component in `configs/`:
- Follows existing pattern from `lead-node-config.tsx`
- Uses shadcn UI components (Select, Input, Checkbox, etc.)
- Updates node data via `onUpdate` callback
- Shows metrics and performance indicators

## Hooks & Utilities

### `useSalesFlow` Hook
Provides:
- `createNode()`: Create nodes with default data
- `canConnect()`: Validate connections
- `getNextStage()`: Get next stage in sequence
- `getPreviousStage()`: Get previous stage
- `validateFlow()`: Validate entire flow structure

### Validators (`sales-flow-validators.ts`)
- `validateNodeData()`: Validate node-specific data
- `validateTransition()`: Validate stage transitions
- `calculateScore()`: Calculate qualification scores

## Visual Design

### Color Coding
- Origin: Green (#23b559)
- Lead: Green (existing)
- Qualification: Blue
- Follow-up: Yellow
- Offer: Purple
- Decision: Orange
- Sale: Green (success)
- Loss: Red (failure)

### Badge System
Each node has a top badge showing:
- Stage name in uppercase
- Icon representing the stage
- Color-coded background

### Handles
- Standard: Green (#23b559) for normal connections
- Decision → Sale: Green handle (left)
- Decision → Loss: Red handle (right)
- Decision → Follow-up: Yellow handle (bottom)

## Integration Points

### Update `node-type-submenu.tsx`
Add new node types to the menu:
```typescript
const nodeTypes = {
  origin: { label: "Origem", icon: Globe, description: "Ponto de entrada do lead" },
  qualification: { label: "Qualificação", icon: CheckCircle2, description: "Qualificar e pontuar lead" },
  followup: { label: "Follow-up", icon: Clock, description: "Acompanhamento automático" },
  offer: { label: "Oferta", icon: Gift, description: "Apresentar proposta" },
  decision: { label: "Decisão", icon: Scale, description: "Ponto de decisão" },
  sale: { label: "Venda", icon: CheckCircle, description: "Venda concluída" },
  loss: { label: "Perda", icon: XCircle, description: "Venda perdida" },
  // ... existing types
}
```

### Update `node-config-panel.tsx`
Add config components for new node types:
```typescript
{nodeType === "origin" && <OriginNodeConfig ... />}
{nodeType === "qualification" && <QualificationNodeConfig ... />}
// ... etc
```

### Update `workflow/page.tsx`
- Register new node types in `nodeTypes` object
- Use `useSalesFlow` hook for validation
- Apply `canConnect` in `onConnect` handler

## Implementation Order

1. **Types & Interfaces** (`sales-flow.types.ts`)
2. **Hook** (`use-sales-flow.ts`)
3. **Node Components** (all 8 nodes)
4. **Config Components** (all 8 configs)
5. **Integration** (update existing files)
6. **Validation** (validators utility)

## Testing Considerations

- Test sequential flow creation
- Test Decision node multi-output
- Test connection validation
- Test flow validation
- Test node data persistence
- Test configuration panel updates

## Future Enhancements

- Conditional branching based on lead data
- Parallel paths (A/B testing)
- Loop detection and prevention
- Flow templates
- Analytics integration per stage
- Webhook triggers at each stage

