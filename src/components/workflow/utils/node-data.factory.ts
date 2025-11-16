import type { Node } from "@xyflow/react"
import { NODE_TYPES } from "../constants/node-types"

export class NodeDataFactory {
  static createDefaultData(nodeType: string): any {
    const baseData = {
      label: NODE_TYPES[nodeType as keyof typeof NODE_TYPES]?.label || "Novo elemento",
      isEditing: false,
    }

    switch (nodeType) {
      case "origin":
        return {
          ...baseData,
          originType: "whatsapp",
          captureMethod: "form",
          autoQualify: false,
          minScore: 60,
          requiredFields: ["name", "phone"],
        }
      case "if":
        return {
          ...baseData,
          condition: "",
        }
      default:
        return baseData
    }
  }

  static updateNodeData(node: Node, updates: any): Node {
    return {
      ...node,
      data: {
        ...node.data,
        ...updates,
      },
    }
  }
}

