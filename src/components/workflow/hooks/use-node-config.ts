import { useState, useCallback } from "react"
import type { Node } from "@xyflow/react"

interface UseNodeConfigProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
  defaultConfig?: any
}

export function useNodeConfig({ node, onUpdate, defaultConfig = {} }: UseNodeConfigProps) {
  const [config, setConfig] = useState(() => ({
    ...defaultConfig,
    ...node.data,
  }))

  const updateConfig = useCallback(
    (key: string, value: any) => {
      const newConfig = { ...config, [key]: value }
      setConfig(newConfig)
      onUpdate(node.id, { ...node.data, ...newConfig })
    },
    [config, node.id, node.data, onUpdate]
  )

  const updateConfigMultiple = useCallback(
    (updates: Record<string, any>) => {
      const newConfig = { ...config, ...updates }
      setConfig(newConfig)
      onUpdate(node.id, { ...node.data, ...newConfig })
    },
    [config, node.id, node.data, onUpdate]
  )

  return {
    config,
    updateConfig,
    updateConfigMultiple,
  }
}

