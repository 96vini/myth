"use client"

import { useMemo, memo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { ToolbarButton } from "./toolbar-button"
import {
  Trash2,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { NODE_TYPES } from "./constants/node-types"
import type { nodeTypes } from "./node-type-submenu"

interface ToolbarProps {
  selectedTool: string
  onToolSelect: (tool: string) => void
  onAddNode: (nodeType: keyof typeof nodeTypes) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onDeleteSelected: () => void
  hasSelectedNodes: boolean
}

function ToolbarComponent({
  selectedTool,
  onToolSelect,
  onAddNode,
  onZoomIn,
  onZoomOut,
  onFitView,
  onDeleteSelected,
  hasSelectedNodes,
}: ToolbarProps) {
  // Memoizar node types entries
  const nodeTypesEntries = useMemo(() => Object.entries(NODE_TYPES), [])

  const handleNodeAdd = useCallback((key: string) => {
    onAddNode(key as keyof typeof nodeTypes)
    onToolSelect("select")
  }, [onAddNode, onToolSelect])

  return (
    <>
      {/* Desktop Toolbar */}
      <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <Card className="p-1.5 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl">
          <div className="flex flex-col gap-1">
          {nodeTypesEntries.map(([key, { icon: Icon, label }]) => (
            <ToolbarButton
              key={key}
              icon={Icon}
              label={label}
              onClick={() => handleNodeAdd(key)}
              isActive={selectedTool === key}
              title={label}
            />
          ))}

          <div className="h-px bg-border/50 my-1.5" />

          <ToolbarButton
            icon={ZoomIn}
            label="Zoom In"
            onClick={onZoomIn}
            title="Zoom In (+)"
          />
          <ToolbarButton
            icon={ZoomOut}
            label="Zoom Out"
            onClick={onZoomOut}
            title="Zoom Out (-)"
          />
          <ToolbarButton
            icon={RotateCw}
            label="Ajustar"
            onClick={onFitView}
            title="Ajustar Visualização (0)"
          />

          <div className="h-px bg-border/50 my-1.5" />

          <ToolbarButton
            icon={Trash2}
            label="Deletar"
            onClick={onDeleteSelected}
            disabled={!hasSelectedNodes}
            title="Deletar Selecionado (Delete)"
          />
          </div>
        </Card>
      </div>

      {/* Mobile Toolbar - Bottom */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <Card className="p-2 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl">
          <div className="flex gap-1 overflow-x-auto max-w-[calc(100vw-2rem)] scrollbar-hide">
            {nodeTypesEntries.slice(0, 6).map(([key, { icon: Icon, label }]) => (
              <ToolbarButton
                key={key}
                icon={Icon}
                label={label}
                onClick={() => handleNodeAdd(key)}
                isActive={selectedTool === key}
                title={label}
              />
            ))}
            <div className="h-8 w-px bg-border/50 mx-1" />
            <ToolbarButton
              icon={ZoomIn}
              label="Zoom In"
              onClick={onZoomIn}
              title="Zoom In"
            />
            <ToolbarButton
              icon={ZoomOut}
              label="Zoom Out"
              onClick={onZoomOut}
              title="Zoom Out"
            />
            <ToolbarButton
              icon={RotateCw}
              label="Ajustar"
              onClick={onFitView}
              title="Ajustar"
            />
            <ToolbarButton
              icon={Trash2}
              label="Deletar"
              onClick={onDeleteSelected}
              disabled={!hasSelectedNodes}
              title="Deletar"
            />
          </div>
        </Card>
      </div>
    </>
  )
}

export const Toolbar = memo(ToolbarComponent)
