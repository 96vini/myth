export type SourceNodeType =
  | "whatsapp"
  | "landing_page"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "email_campaign"
  | "manual_entry"

export type ProcessingNodeType =
  | "lead_classifier"
  | "lead_enricher"
  | "spam_detector"
  | "lead_score_calculator"

export type DecisionNodeType = "if" | "switch" | "rule_engine"

export type ActionNodeType =
  | "send_message"
  | "send_email"
  | "create_task"
  | "assign_to_user"
  | "push_to_crm"

export type DelayNodeType = "wait_ms" | "wait_until" | "wait_for_event"

export type EndNodeType = "success_end" | "error_end"

export type FlowNodeType =
  | SourceNodeType
  | ProcessingNodeType
  | DecisionNodeType
  | ActionNodeType
  | DelayNodeType
  | EndNodeType

export interface LeadPayload {
  id: string
  source: SourceNodeType
  contact: {
    name?: string
    phone?: string
    email?: string
    whatsapp?: string
  }
  metadata: {
    [key: string]: any
    timestamp: string
    ip?: string
    userAgent?: string
    referrer?: string
  }
  tags: string[]
  score?: number
  status: "new" | "processing" | "qualified" | "disqualified" | "spam" | "completed"
}

export interface BaseNodeData {
  label: string
  isEditing?: boolean
  nodeType: FlowNodeType
  description?: string
}

export interface SourceNodeData extends BaseNodeData {
  nodeType: SourceNodeType
  outputPayload: Partial<LeadPayload>
  validationRules?: {
    requiredFields: string[]
    formatValidation: boolean
  }
}

export interface ProcessingNodeData extends BaseNodeData {
  nodeType: ProcessingNodeType
  config: {
    classifier?: {
      categories: string[]
      rules: ClassificationRule[]
    }
    enricher?: {
      sources: ("email" | "phone" | "social" | "crm")[]
      timeout: number
    }
    spamDetector?: {
      threshold: number
      checkPatterns: boolean
      checkFrequency: boolean
    }
    scoreCalculator?: {
      rules: ScoringRule[]
      weights: { [key: string]: number }
    }
  }
}

export interface ClassificationRule {
  field: string
  operator: "equals" | "contains" | "regex" | "greater" | "less"
  value: string | number
  category: string
}

export interface ScoringRule {
  condition: string
  score: number
  maxScore?: number
}

export interface DecisionNodeData extends BaseNodeData {
  nodeType: DecisionNodeType
  conditions: Condition[]
  defaultPath?: string
}

export interface Condition {
  id: string
  field: string
  operator: "equals" | "not_equals" | "contains" | "greater" | "less" | "between" | "in" | "not_in"
  value: string | number | string[] | [number, number]
  targetNode?: string
  priority: number
}

export interface ActionNodeData extends BaseNodeData {
  nodeType: ActionNodeType
  config: {
    sendMessage?: {
      channel: "whatsapp" | "sms" | "push"
      template: string
      variables: { [key: string]: string }
    }
    sendEmail?: {
      template: string
      subject: string
      variables: { [key: string]: string }
    }
    createTask?: {
      title: string
      description: string
      assignee?: string
      dueDate?: string
      priority: "low" | "medium" | "high"
    }
    assignToUser?: {
      userId: string
      teamId?: string
      notify: boolean
    }
    pushToCrm?: {
      crmSystem: "salesforce" | "hubspot" | "pipedrive" | "custom"
      mapping: { [key: string]: string }
      syncFields: string[]
    }
  }
}

export interface DelayNodeData extends BaseNodeData {
  nodeType: DelayNodeType
  config: {
    waitMs?: {
      milliseconds: number
    }
    waitUntil?: {
      dateTime: string
      timezone: string
    }
    waitForEvent?: {
      eventType: string
      timeout: number
      timeoutAction: "continue" | "abort" | "retry"
    }
  }
}

export interface EndNodeData extends BaseNodeData {
  nodeType: EndNodeType
  config: {
    successEnd?: {
      message: string
      logResult: boolean
      notify: boolean
    }
    errorEnd?: {
      errorCode: string
      errorMessage: string
      retry: boolean
      retryDelay?: number
    }
  }
}

export type FlowNodeData =
  | SourceNodeData
  | ProcessingNodeData
  | DecisionNodeData
  | ActionNodeData
  | DelayNodeData
  | EndNodeData

export interface FlowEdge {
  id: string
  source: string
  target: string
  condition?: string
  label?: string
}

export interface FlowValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

