"use client"

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

export function Toolbar({
  selectedTool,
  onToolSelect,
  onAddNode,
  onZoomIn,
  onZoomOut,
  onFitView,
  onDeleteSelected,
  hasSelectedNodes,
}: ToolbarProps) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
      <Card className="p-1.5 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl">
        <div className="flex flex-col gap-1">
          {Object.entries(NODE_TYPES).map(([key, { icon: Icon, label }]) => (
            <ToolbarButton
              key={key}
              icon={Icon}
              label={label}
              onClick={() => {
                onAddNode(key as keyof typeof nodeTypes)
                onToolSelect("select")
              }}
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
  )
}
