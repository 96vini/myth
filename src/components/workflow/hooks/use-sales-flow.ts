import { useCallback } from "react"
import { Node, Edge, Connection } from "@xyflow/react"
import type {
  SalesFlowStage,
  OriginNodeData,
  LeadNodeData,
  QualificationNodeData,
  FollowUpNodeData,
  OfferNodeData,
  DecisionNodeData,
  SaleNodeData,
  LossNodeData,
} from "../types/sales-flow.types"

const STAGE_ORDER: SalesFlowStage[] = [
  "origin",
  "lead",
  "qualification",
  "followup",
  "offer",
  "decision",
  "sale",
  "loss",
]

const DEFAULT_NODE_DATA: Record<SalesFlowStage, any> = {
  origin: {
    label: "Origem",
    source: "whatsapp",
    captureMethod: "form",
    autoQualify: false,
  } as OriginNodeData,
  lead: {
    label: "Lead",
    leadSource: "whatsapp",
    qualification: "auto",
    minScore: 60,
    tags: [],
    enableScoring: true,
    enableTracking: true,
    followUpDays: 3,
    autoAssign: true,
  } as LeadNodeData,
  qualification: {
    label: "Qualificação",
    criteria: [],
    scoringRules: [],
    autoAdvance: false,
    minScore: 70,
    enableAI: true,
    fallbackAction: "manual",
  } as QualificationNodeData,
  followup: {
    label: "Follow-up",
    strategy: "scheduled",
    delay: 24,
    delayUnit: "hours",
    maxAttempts: 3,
    channels: ["whatsapp"],
    template: "",
    enableReminders: true,
  } as FollowUpNodeData,
  offer: {
    label: "Oferta",
    offerType: "discount",
    value: 0,
    currency: "BRL",
    conditions: [],
    personalization: true,
    channels: ["whatsapp"],
  } as OfferNodeData,
  decision: {
    label: "Decisão",
    timeout: 48,
    timeoutUnit: "hours",
    autoDecision: false,
    defaultPath: "followup",
    requireConfirmation: true,
    notificationChannels: ["whatsapp"],
  } as DecisionNodeData,
  sale: {
    label: "Venda",
    celebrationMessage: "Parabéns! Sua compra foi confirmada.",
    nextSteps: [],
    assignToTeam: false,
    createTask: true,
    sendReceipt: true,
    channels: ["whatsapp"],
  } as SaleNodeData,
  loss: {
    label: "Perda",
    reason: "other",
    feedbackRequest: true,
    reEngageStrategy: "later",
    reEngageDelay: 30,
    saveForFuture: true,
  } as LossNodeData,
}

export function useSalesFlow() {
  const createNode = useCallback(
    (
      stage: SalesFlowStage,
      position: { x: number; y: number },
      id?: string
    ): Node => {
      return {
        id: id || `${stage}-${Date.now()}`,
        type: stage,
        position,
        data: {
          ...DEFAULT_NODE_DATA[stage],
          isEditing: false,
        },
      }
    },
    []
  )

  const canConnect = useCallback(
    (source: Node, target: Node): boolean => {
      const sourceIndex = STAGE_ORDER.indexOf(source.type as SalesFlowStage)
      const targetIndex = STAGE_ORDER.indexOf(target.type as SalesFlowStage)

      if (sourceIndex === -1 || targetIndex === -1) return false

      if (source.type === "decision") {
        if (target.type === "sale" || target.type === "loss" || target.type === "followup") {
          return true
        }
        return false
      }

      if (target.type === "decision") {
        return source.type === "offer"
      }

      if (target.type === "sale" || target.type === "loss") {
        return source.type === "decision"
      }

      return targetIndex === sourceIndex + 1
    },
    []
  )

  const getNextStage = useCallback((currentStage: SalesFlowStage): SalesFlowStage | null => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage)
    if (currentIndex === -1 || currentIndex === STAGE_ORDER.length - 1) {
      return null
    }
    return STAGE_ORDER[currentIndex + 1]
  }, [])

  const getPreviousStage = useCallback((currentStage: SalesFlowStage): SalesFlowStage | null => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage)
    if (currentIndex <= 0) {
      return null
    }
    return STAGE_ORDER[currentIndex - 1]
  }, [])

  const validateFlow = useCallback((nodes: Node[], edges: Edge[]): boolean => {
    const originNodes = nodes.filter((n) => n.type === "origin")
    if (originNodes.length === 0) return false

    const saleNodes = nodes.filter((n) => n.type === "sale")
    const lossNodes = nodes.filter((n) => n.type === "loss")
    if (saleNodes.length === 0 && lossNodes.length === 0) return false

    const decisionNodes = nodes.filter((n) => n.type === "decision")
    for (const decisionNode of decisionNodes) {
      const outgoingEdges = edges.filter((e) => e.source === decisionNode.id)
      const hasSale = outgoingEdges.some((e) => {
        const targetNode = nodes.find((n) => n.id === e.target)
        return targetNode?.type === "sale"
      })
      const hasLoss = outgoingEdges.some((e) => {
        const targetNode = nodes.find((n) => n.id === e.target)
        return targetNode?.type === "loss"
      })
      if (!hasSale || !hasLoss) return false
    }

    return true
  }, [])

  return {
    createNode,
    canConnect,
    getNextStage,
    getPreviousStage,
    validateFlow,
    STAGE_ORDER,
  }
}

