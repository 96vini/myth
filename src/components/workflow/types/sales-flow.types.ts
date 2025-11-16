export type SalesFlowStage =
  | "origin"
  | "lead"
  | "qualification"
  | "followup"
  | "offer"
  | "decision"
  | "sale"
  | "loss"

export interface OriginNodeData {
  label: string
  isEditing?: boolean
  source: "whatsapp" | "website" | "instagram" | "facebook" | "referral" | "other"
  captureMethod: "form" | "chat" | "api" | "manual"
  autoQualify: boolean
  minScore?: number
  tags?: string[]
}

export interface LeadNodeData {
  label: string
  isEditing?: boolean
  leadSource: string
  qualification: "auto" | "manual" | "hybrid"
  minScore: number
  tags: string[]
  enableScoring: boolean
  enableTracking: boolean
  followUpDays: number
  autoAssign: boolean
}

export interface QualificationNodeData {
  label: string
  isEditing?: boolean
  criteria: QualificationCriteria[]
  scoringRules: ScoringRule[]
  autoAdvance: boolean
  minScore: number
  enableAI: boolean
  fallbackAction: "manual" | "reject" | "retry"
}

export interface QualificationCriteria {
  field: string
  operator: "equals" | "contains" | "greater" | "less" | "between"
  value: string | number | [number, number]
  weight: number
}

export interface ScoringRule {
  condition: string
  score: number
  priority: number
}

export interface FollowUpNodeData {
  label: string
  isEditing?: boolean
  strategy: "immediate" | "scheduled" | "conditional"
  delay: number
  delayUnit: "minutes" | "hours" | "days"
  maxAttempts: number
  channels: ("whatsapp" | "email" | "sms" | "call")[]
  template: string
  enableReminders: boolean
}

export interface OfferNodeData {
  label: string
  isEditing?: boolean
  offerType: "discount" | "package" | "custom" | "upsell"
  value: number
  currency: string
  validUntil?: string
  conditions: string[]
  personalization: boolean
  channels: ("whatsapp" | "email" | "sms")[]
}

export interface DecisionNodeData {
  label: string
  isEditing?: boolean
  timeout: number
  timeoutUnit: "hours" | "days"
  autoDecision: boolean
  defaultPath: "sale" | "loss" | "followup"
  requireConfirmation: boolean
  notificationChannels: ("whatsapp" | "email")[]
}

export interface SaleNodeData {
  label: string
  isEditing?: boolean
  celebrationMessage: string
  nextSteps: string[]
  assignToTeam: boolean
  teamMember?: string
  createTask: boolean
  sendReceipt: boolean
  channels: ("whatsapp" | "email")[]
}

export interface LossNodeData {
  label: string
  isEditing?: boolean
  reason: "price" | "timing" | "competitor" | "need" | "other"
  feedbackRequest: boolean
  reEngageStrategy: "none" | "later" | "alternative"
  reEngageDelay: number
  saveForFuture: boolean
}

export interface SalesFlowNode {
  id: string
  type: SalesFlowStage
  position: { x: number; y: number }
  data: OriginNodeData | LeadNodeData | QualificationNodeData | FollowUpNodeData | OfferNodeData | DecisionNodeData | SaleNodeData | LossNodeData
}

export interface StageTransition {
  from: SalesFlowStage
  to: SalesFlowStage
  condition?: string
  auto?: boolean
}

