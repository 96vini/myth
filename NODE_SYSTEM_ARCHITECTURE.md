# Node-Based Flow System Architecture

## Overview
Modular and scalable TypeScript-based node system for automated sales pipeline management.

## Architecture

### Folder Structure
```
src/components/workflow/
├── types/
│   └── node.types.ts                    # All TypeScript interfaces
├── nodes/
│   ├── source/                          # Source nodes
│   │   ├── whatsapp-source-node.tsx
│   │   ├── landing-page-source-node.tsx
│   │   ├── facebook-source-node.tsx
│   │   ├── instagram-source-node.tsx
│   │   ├── tiktok-source-node.tsx
│   │   ├── email-campaign-source-node.tsx
│   │   └── manual-entry-source-node.tsx
│   ├── processing/                      # Processing nodes
│   │   ├── lead-classifier-node.tsx
│   │   ├── lead-enricher-node.tsx
│   │   ├── spam-detector-node.tsx
│   │   └── lead-score-calculator-node.tsx
│   ├── decision/                        # Decision nodes
│   │   ├── if-decision-node.tsx
│   │   ├── switch-decision-node.tsx
│   │   └── rule-engine-decision-node.tsx
│   ├── action/                          # Action nodes
│   │   ├── send-message-action-node.tsx
│   │   ├── send-email-action-node.tsx
│   │   ├── create-task-action-node.tsx
│   │   ├── assign-to-user-action-node.tsx
│   │   └── push-to-crm-action-node.tsx
│   ├── delay/                           # Delay nodes
│   │   ├── wait-ms-delay-node.tsx
│   │   ├── wait-until-delay-node.tsx
│   │   └── wait-for-event-delay-node.tsx
│   └── end/                             # End nodes
│       ├── success-end-node.tsx
│       └── error-end-node.tsx
├── hooks/
│   └── use-flow-engine.ts               # Flow execution logic
├── utils/
│   └── lead-payload.factory.ts          # LeadPayload creation
└── configs/                             # Configuration panels (existing)
```

## Node Types

### 1. Source Nodes
**Purpose**: Entry points that generate standardized `LeadPayload`

**Types**:
- `whatsapp` - WhatsApp message/chat
- `landing_page` - Web form submission
- `facebook` - Facebook lead/ad
- `instagram` - Instagram lead/ad
- `tiktok` - TikTok lead/ad
- `email_campaign` - Email campaign click
- `manual_entry` - Manual data entry

**Characteristics**:
- No input handles (entry points)
- Single output handle (bottom)
- Must output `LeadPayload`
- Color-coded by source type

**Data Structure**: `SourceNodeData`
```typescript
{
  label: string
  nodeType: SourceNodeType
  outputPayload: Partial<LeadPayload>
  validationRules?: {
    requiredFields: string[]
    formatValidation: boolean
  }
}
```

### 2. Processing Nodes
**Purpose**: Transform and enrich lead data

**Types**:
- `lead_classifier` - Categorize leads
- `lead_enricher` - Add external data
- `spam_detector` - Filter spam
- `lead_score_calculator` - Calculate lead score

**Characteristics**:
- Input handle (top)
- Output handle (bottom)
- Process `LeadPayload` in → `LeadPayload` out
- Can modify payload fields

**Data Structure**: `ProcessingNodeData`
```typescript
{
  label: string
  nodeType: ProcessingNodeType
  config: {
    classifier?: { categories, rules }
    enricher?: { sources, timeout }
    spamDetector?: { threshold, checkPatterns }
    scoreCalculator?: { rules, weights }
  }
}
```

### 3. Decision Nodes
**Purpose**: Branch flow based on conditions

**Types**:
- `if` - Binary decision (true/false)
- `switch` - Multi-path decision
- `rule_engine` - Complex rule evaluation

**Characteristics**:
- Input handle (top)
- Multiple output handles (left/right/bottom)
- Evaluate conditions against `LeadPayload`
- Route to different paths

**Data Structure**: `DecisionNodeData`
```typescript
{
  label: string
  nodeType: DecisionNodeType
  conditions: Condition[]
  defaultPath?: string
}
```

### 4. Action Nodes
**Purpose**: Execute side effects

**Types**:
- `send_message` - Send WhatsApp/SMS
- `send_email` - Send email
- `create_task` - Create task in system
- `assign_to_user` - Assign to team member
- `push_to_crm` - Sync to CRM system

**Characteristics**:
- Input handle (top)
- Output handle (bottom)
- Execute action, continue flow
- Can modify payload status

**Data Structure**: `ActionNodeData`
```typescript
{
  label: string
  nodeType: ActionNodeType
  config: {
    sendMessage?: { channel, template, variables }
    sendEmail?: { template, subject, variables }
    createTask?: { title, description, assignee }
    assignToUser?: { userId, teamId, notify }
    pushToCrm?: { crmSystem, mapping, syncFields }
  }
}
```

### 5. Delay Nodes
**Purpose**: Pause flow execution

**Types**:
- `wait_ms` - Wait milliseconds
- `wait_until` - Wait until date/time
- `wait_for_event` - Wait for external event

**Characteristics**:
- Input handle (top)
- Output handle (bottom)
- Pause execution
- Resume when condition met

**Data Structure**: `DelayNodeData`
```typescript
{
  label: string
  nodeType: DelayNodeType
  config: {
    waitMs?: { milliseconds }
    waitUntil?: { dateTime, timezone }
    waitForEvent?: { eventType, timeout, timeoutAction }
  }
}
```

### 6. End Nodes
**Purpose**: Terminate flow execution

**Types**:
- `success_end` - Successful completion
- `error_end` - Error termination

**Characteristics**:
- Input handle (top)
- No output handles
- Terminal nodes
- Log final state

**Data Structure**: `EndNodeData`
```typescript
{
  label: string
  nodeType: EndNodeType
  config: {
    successEnd?: { message, logResult, notify }
    errorEnd?: { errorCode, errorMessage, retry }
  }
}
```

## LeadPayload Standard

All source nodes output a standardized `LeadPayload`:

```typescript
interface LeadPayload {
  id: string                    // Unique lead identifier
  source: SourceNodeType        // Origin source
  contact: {
    name?: string
    phone?: string
    email?: string
    whatsapp?: string
  }
  metadata: {
    timestamp: string
    ip?: string
    userAgent?: string
    referrer?: string
    [key: string]: any         // Source-specific data
  }
  tags: string[]               // Classification tags
  score?: number               // Calculated score
  status: "new" | "processing" | "qualified" | "disqualified" | "spam" | "completed"
}
```

## Flow Execution

### Connection Rules
- Source nodes: No inputs, only outputs
- End nodes: Only inputs, no outputs
- Decision nodes: One input, multiple outputs
- All other nodes: One input, one output

### Validation
The `useFlowEngine` hook provides:
- `canConnect()` - Validates if two nodes can connect
- `validateFlow()` - Validates entire flow structure
- `createLeadPayload()` - Creates standardized payload

### Execution Order
1. Source node generates `LeadPayload`
2. Processing nodes transform payload
3. Decision nodes route based on conditions
4. Action nodes execute side effects
5. Delay nodes pause execution
6. End nodes terminate flow

## Visual Design

### Color Coding
- **Source Nodes**: Green (#25D366 for WhatsApp, Blue for Landing Page, etc.)
- **Processing Nodes**: Purple
- **Decision Nodes**: Orange
- **Action Nodes**: Blue
- **Delay Nodes**: Yellow
- **Success End**: Green
- **Error End**: Red

### Badge System
Each node displays:
- Category badge at top (e.g., "WHATSAPP", "CLASSIFICAR")
- Icon representing node type
- Editable label in center
- Handles for connections

## Integration

### React Flow Registration
```typescript
const nodeTypes = {
  // Source
  whatsapp: WhatsAppSourceNode,
  landing_page: LandingPageSourceNode,
  // ... other sources
  
  // Processing
  lead_classifier: LeadClassifierNode,
  // ... other processing
  
  // Decision
  if: IfDecisionNode,
  // ... other decisions
  
  // Action
  send_message: SendMessageActionNode,
  // ... other actions
  
  // Delay
  wait_ms: WaitMsDelayNode,
  // ... other delays
  
  // End
  success_end: SuccessEndNode,
  error_end: ErrorEndNode,
}
```

### Toolbar Integration
Add node types to `node-type-submenu.tsx`:
```typescript
const nodeTypes = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle, description: "Lead via WhatsApp" },
  landing_page: { label: "Landing Page", icon: Globe, description: "Lead via formulário" },
  // ... etc
}
```

## Extensibility

### Adding New Node Types
1. Define type in `node.types.ts`
2. Create component in appropriate folder
3. Add to `NODE_CATEGORIES` in `use-flow-engine.ts`
4. Register in React Flow `nodeTypes`
5. Create config component if needed

### Adding New Source Types
1. Add to `SourceNodeType` union
2. Create source node component
3. Update `LeadPayloadFactory` if needed
4. Add to toolbar menu

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces
2. **Standardization**: All sources output `LeadPayload`
3. **Immutability**: Processing nodes create new payloads
4. **Validation**: Validate connections and flow structure
5. **Error Handling**: Use error end nodes for failures
6. **Logging**: Log payload transformations
7. **Testing**: Test each node type independently

