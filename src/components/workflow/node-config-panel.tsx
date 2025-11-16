"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Node } from "@xyflow/react"
import { NODE_TYPES } from "./constants/node-types"
import { getConfigComponent } from "./configs/config-registry"

interface NodeConfigPanelProps {
  selectedNode: Node | null
  onClose: () => void
  onUpdateNode: (nodeId: string, data: any) => void
}

export function NodeConfigPanel({ selectedNode, onClose, onUpdateNode }: NodeConfigPanelProps) {
  if (!selectedNode) return null

  const nodeType = selectedNode.type || "default"
  const nodeTypeInfo = NODE_TYPES[nodeType as keyof typeof NODE_TYPES] || NODE_TYPES.team

  // Calcular métricas simuladas
  const metrics = {
    performance: Math.floor(Math.random() * 30) + 70, // 70-100%
    avgResponseTime: Math.floor(Math.random() * 5) + 1, // 1-5 min
    successRate: Math.floor(Math.random() * 20) + 80, // 80-100%
    totalInteractions: Math.floor(Math.random() * 500) + 100,
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "text-green-500"
    if (value >= 75) return "text-yellow-500"
    return "text-red-500"
  }

  const getPerformanceBadge = (value: number) => {
    if (value >= 90) return "default"
    if (value >= 75) return "secondary"
    return "destructive"
  }

  return (
    <Card className="absolute right-4 top-4 bottom-4 w-96 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl z-30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {nodeTypeInfo.icon && (
              <nodeTypeInfo.icon className="h-5 w-5 text-[#23b559]" />
            )}
            <h3 className="font-semibold text-lg">{selectedNode.data?.label || nodeTypeInfo.label}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Badge variant="outline" className="text-xs">
          {nodeTypeInfo.label}
        </Badge>
      </div>

      {/* Métricas Rápidas */}
      <div className="p-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Métricas de Performance</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Performance</span>
              <Badge variant={getPerformanceBadge(metrics.performance) as any} className="text-xs">
                {metrics.performance}%
              </Badge>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-[#23b559] transition-all`}
                style={{ width: `${metrics.performance}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Taxa de Sucesso</span>
              <span className={`text-xs font-medium ${getPerformanceColor(metrics.successRate)}`}>
                {metrics.successRate}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${metrics.successRate}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tempo Médio</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{metrics.avgResponseTime}min</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Interações</span>
              <span className="text-xs font-medium">{metrics.totalInteractions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações Específicas */}
      <div className="flex-1 overflow-y-auto p-4">
        {(() => {
          const ConfigComponent = getConfigComponent(nodeType)
          if (ConfigComponent) {
            return <ConfigComponent node={selectedNode} onUpdate={onUpdateNode} />
          }
          return (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Selecione um tipo de nó para configurar</p>
            </div>
          )
        })()}
      </div>
    </Card>
  )
}

