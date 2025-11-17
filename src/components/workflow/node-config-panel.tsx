"use client"

import { useMemo, memo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, TrendingUp, Clock, CheckCircle2, AlertCircle, BotIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Node } from "@xyflow/react"
import { NODE_TYPES } from "./constants/node-types"
import { getConfigComponent } from "./configs/config-registry"

interface NodeConfigPanelProps {
  selectedNode: Node | null
  onClose: () => void
  onUpdateNode: (nodeId: string, data: any) => void
}

// Funções utilitárias movidas para fora do componente
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

// Lista de bots estática (memoizada fora do componente)
const BOTS_LIST = [
  { id: "1", name: "John", performance: 95, status: "active" as const, interactions: 1234 },
  { id: "2", name: "Sarah", performance: 87, status: "active" as const, interactions: 892 },
  { id: "3", name: "Mike", performance: 92, status: "active" as const, interactions: 1456 },
  { id: "4", name: "Emma", performance: 78, status: "inactive" as const, interactions: 567 },
  { id: "5", name: "David", performance: 89, status: "active" as const, interactions: 1023 },
] as const

function NodeConfigPanelComponent({ selectedNode, onClose, onUpdateNode }: NodeConfigPanelProps) {
  if (!selectedNode) return null

  const nodeType = selectedNode.type || "default"
  const nodeTypeInfo = useMemo(() => NODE_TYPES[nodeType as keyof typeof NODE_TYPES] || NODE_TYPES.team, [nodeType])

  const selectedBotId = useMemo(() => (selectedNode.data?.botId as string) || null, [selectedNode.data?.botId])

  const handleBotSelect = useCallback((botId: string) => {
    onUpdateNode(selectedNode.id, { ...selectedNode.data, botId })
  }, [selectedNode.id, selectedNode.data, onUpdateNode])

  // Memoizar ConfigComponent
  const ConfigComponent = useMemo(() => getConfigComponent(nodeType), [nodeType])

  return (
    <>
      {/* Mobile: Full Screen Bottom Sheet */}
      <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <Card className="md:hidden fixed bottom-0 left-0 right-0 max-h-[85vh] bg-background border-t border-border/50 shadow-xl z-50 flex flex-col overflow-hidden rounded-t-xl">
        {/* Mobile Header */}
        <div className="p-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {nodeTypeInfo.icon && (
                <nodeTypeInfo.icon className="h-5 w-5 text-[#23b559]" />
              )}
              <h3 className="font-semibold text-lg">{(selectedNode.data?.label as string) || nodeTypeInfo.label}</h3>
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

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Lista de Bots */}
          <div className="p-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <BotIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Vincular Bot</span>
            </div>
            <div 
              className="flex gap-2 overflow-x-auto scrollbar-hide pb-2" 
              style={{ scrollBehavior: 'smooth' }}
              onWheel={(e) => {
                // Permite scroll vertical do painel quando roda o mouse na lista de bots
                const container = e.currentTarget
                const canScrollHorizontal = container.scrollWidth > container.clientWidth
                
                // Se há scroll horizontal disponível e o movimento é principalmente horizontal, permite
                // Caso contrário, deixa o scroll vertical passar para o painel pai
                if (canScrollHorizontal && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                  e.stopPropagation()
                }
              }}
            >
              {BOTS_LIST.map((bot) => {
                const isSelected = selectedBotId === bot.id
                return (
                  <div
                    key={bot.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBotSelect(bot.id)
                    }}
                    className={`
                      flex-shrink-0 w-[180px] space-y-1 rounded-md p-2 cursor-pointer transition-all select-none touch-none
                      ${isSelected 
                        ? "border-primary border-2 bg-primary/5" 
                        : "border border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-medium">{bot.name}</span>
                        {bot.status === "active" && (
                          <Badge variant="default" className="text-xs bg-[#23b559]">
                            Ativo
                          </Badge>
                        )}
                        {bot.status === "inactive" && (
                          <Badge variant="secondary" className="text-xs">
                            Inativo
                          </Badge>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-3 w-3 text-[#23b559] flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={getPerformanceBadge(bot.performance) as any} className="text-xs">
                        {bot.performance}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">{bot.interactions}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#23b559] transition-all"
                        style={{ width: `${bot.performance}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Configurações Específicas */}
          <div className="p-4">
            {ConfigComponent ? (
              <ConfigComponent node={selectedNode} onUpdate={onUpdateNode} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Selecione um tipo de nó para configurar</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Desktop: Fixed Right Panel */}
      <Card className="hidden md:flex absolute right-4 top-4 bottom-4 w-96 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl z-30 flex-col overflow-hidden">
        {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {nodeTypeInfo.icon && (
              <nodeTypeInfo.icon className="h-5 w-5 text-[#23b559]" />
            )}
            <h3 className="font-semibold text-lg">{(selectedNode.data?.label as string) || nodeTypeInfo.label}</h3>
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

      {/* Lista de Bots */}
      <div className="p-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <BotIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Vincular Bot</span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollBehavior: 'smooth' }}>
          {BOTS_LIST.map((bot) => {
            const isSelected = selectedBotId === bot.id
            return (
              <div
                key={bot.id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleBotSelect(bot.id)
                }}
                className={`
                  flex-shrink-0 w-[180px] space-y-1 rounded-md p-2 cursor-pointer transition-all select-none touch-none
                  ${isSelected 
                    ? "border-primary border-2 bg-primary/5" 
                    : "border border-border hover:border-primary/50 hover:bg-muted/50"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium">{bot.name}</span>
                    {bot.status === "active" && (
                      <Badge variant="default" className="text-xs bg-[#23b559]">
                        Ativo
                      </Badge>
                    )}
                    {bot.status === "inactive" && (
                      <Badge variant="secondary" className="text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-3 w-3 text-[#23b559] flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={getPerformanceBadge(bot.performance) as any} className="text-xs">
                    {bot.performance}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">{bot.interactions}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#23b559] transition-all"
                    style={{ width: `${bot.performance}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Configurações Específicas */}
      <div className="flex-1 overflow-y-auto p-4">
        {ConfigComponent ? (
          <ConfigComponent node={selectedNode} onUpdate={onUpdateNode} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Selecione um tipo de nó para configurar</p>
          </div>
        )}
      </div>
      </Card>
    </>
  )
}

export const NodeConfigPanel = memo(NodeConfigPanelComponent)

