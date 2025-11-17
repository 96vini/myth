import { useCallback } from "react"
import { Node, Edge, Connection } from "@xyflow/react"
import type {
  FlowNodeType,
  SourceNodeType,
  ProcessingNodeType,
  DecisionNodeType,
  ActionNodeType,
  DelayNodeType,
  EndNodeType,
  LeadPayload,
  FlowNodeData,
  FlowValidationResult,
} from "../types/node.types"

const NODE_CATEGORIES = {
  source: ["whatsapp", "landing_page", "facebook", "instagram", "tiktok", "email_campaign", "manual_entry"],
  processing: ["lead_classifier", "lead_enricher", "spam_detector", "lead_score_calculator"],
  decision: ["if", "switch", "rule_engine"],
  action: ["send_message", "send_email", "create_task", "assign_to_user", "push_to_crm"],
  delay: ["wait_ms", "wait_until", "wait_for_event"],
  end: ["success_end", "error_end"],
} as const

export function useFlowEngine() {
  const createLeadPayload = useCallback(
    (source: SourceNodeType, data: any): LeadPayload => {
      return {
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source,
        contact: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          whatsapp: data.whatsapp,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          ip: data.ip,
          userAgent: data.userAgent,
          referrer: data.referrer,
          ...data.metadata,
        },
        tags: data.tags || [],
        status: "new",
      }
    },
    []
  )

  const canConnect = useCallback(
    (source: Node, target: Node): boolean => {
      const sourceType = source.type as FlowNodeType
      const targetType = target.type as FlowNodeType

      if (NODE_CATEGORIES.end.includes(sourceType as EndNodeType)) {
        return false
      }

      if (NODE_CATEGORIES.source.includes(targetType as SourceNodeType)) {
        return false
      }

      if (NODE_CATEGORIES.decision.includes(sourceType as DecisionNodeType)) {
        return true
      }

      if (NODE_CATEGORIES.end.includes(targetType as EndNodeType)) {
        return !NODE_CATEGORIES.source.includes(sourceType as SourceNodeType)
      }

      return true
    },
    []
  )

  const validateFlow = useCallback(
    (nodes: Node[], edges: Edge[]): FlowValidationResult => {
      const errors: string[] = []
      const warnings: string[] = []

      const sourceNodes = nodes.filter((n) =>
        NODE_CATEGORIES.source.includes(n.type as SourceNodeType)
      )
      if (sourceNodes.length === 0) {
        errors.push("Flow must have at least one source node")
      }

      const endNodes = nodes.filter((n) => NODE_CATEGORIES.end.includes(n.type as EndNodeType))
      if (endNodes.length === 0) {
        errors.push("Flow must have at least one end node")
      }

      for (const node of nodes) {
        if (NODE_CATEGORIES.source.includes(node.type as SourceNodeType)) {
          const outgoingEdges = edges.filter((e) => e.source === node.id)
          if (outgoingEdges.length === 0) {
            warnings.push(`Source node "${node.data.label}" has no outgoing connections`)
          }
        }

        if (NODE_CATEGORIES.decision.includes(node.type as DecisionNodeType)) {
          const outgoingEdges = edges.filter((e) => e.source === node.id)
          if (outgoingEdges.length < 2) {
            warnings.push(
              `Decision node "${node.data.label}" should have at least 2 outgoing connections`
            )
          }
        }

        if (NODE_CATEGORIES.end.includes(node.type as EndNodeType)) {
          const incomingEdges = edges.filter((e) => e.target === node.id)
          if (incomingEdges.length === 0) {
            warnings.push(`End node "${node.data.label}" has no incoming connections`)
          }
        }
      }

      const nodeIds = new Set(nodes.map((n) => n.id))
      for (const edge of edges) {
        if (!nodeIds.has(edge.source)) {
          errors.push(`Edge references non-existent source node: ${edge.source}`)
        }
        if (!nodeIds.has(edge.target)) {
          errors.push(`Edge references non-existent target node: ${edge.target}`)
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      }
    },
    []
  )

  const getNodeCategory = useCallback((nodeType: FlowNodeType): string | null => {
    for (const [category, types] of Object.entries(NODE_CATEGORIES)) {
      if ((types as readonly string[]).includes(nodeType as string)) {
        return category
      }
    }
    return null
  }, [])

  const isSourceNode = useCallback((nodeType: FlowNodeType): boolean => {
    return NODE_CATEGORIES.source.includes(nodeType as SourceNodeType)
  }, [])

  const isEndNode = useCallback((nodeType: FlowNodeType): boolean => {
    return NODE_CATEGORIES.end.includes(nodeType as EndNodeType)
  }, [])

  const isDecisionNode = useCallback((nodeType: FlowNodeType): boolean => {
    return NODE_CATEGORIES.decision.includes(nodeType as DecisionNodeType)
  }, [])

  return {
    createLeadPayload,
    canConnect,
    validateFlow,
    getNodeCategory,
    isSourceNode,
    isEndNode,
    isDecisionNode,
    NODE_CATEGORIES,
  }
}

