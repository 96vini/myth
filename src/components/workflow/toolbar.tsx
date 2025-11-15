"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ToolbarButton } from "./toolbar-button"
import { NodeTypeSubmenu } from "./node-type-submenu"
import { EdgeTypeSubmenu } from "./edge-type-submenu"
import {
  Plus,
  Trash2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  GitBranch,
} from "lucide-react"
import type { nodeTypes } from "./node-type-submenu"

interface ToolbarProps {
  selectedTool: string
  onToolSelect: (tool: string) => void
  onAddNode: (nodeType: keyof typeof nodeTypes) => void
  onEdgeTypeChange: (edgeType: string) => void
  currentEdgeType: string
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
  onEdgeTypeChange,
  currentEdgeType,
  onZoomIn,
  onZoomOut,
  onFitView,
  onDeleteSelected,
  hasSelectedNodes,
}: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node | null)) {
        setIsOpen(false)
        setOpenSubmenu(null)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSubmenuToggle = (submenu: string) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu)
  }

  return (
    <div
      ref={toolbarRef}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
    >
      <div className="relative flex items-center">
        {/* Collapsed State - Icon Only */}
        {!isOpen && (
          <div
            className="w-12 h-12 rounded-xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => setIsOpen(true)}
          >
            <Move className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        {/* Expanded State - Full Toolbar */}
        {isOpen && (
          <Card className="p-2 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl">
            <div className="flex flex-col gap-2">
              <ToolbarButton
                icon={Move}
                onClick={() => {
                  onToolSelect("select")
                  setOpenSubmenu(null)
                }}
                isActive={selectedTool === "select"}
                title="Selecionar (V)"
              />

              {/* Add Node Button with Submenu */}
              <div className="relative">
                <ToolbarButton
                  icon={Plus}
                  onClick={() => handleSubmenuToggle("nodes")}
                  isActive={selectedTool === "add" || openSubmenu === "nodes"}
                  title="Adicionar Nó (A)"
                />
                <NodeTypeSubmenu
                  isOpen={openSubmenu === "nodes"}
                  onClose={() => setOpenSubmenu(null)}
                  onSelect={(nodeType) => {
                    onAddNode(nodeType)
                    onToolSelect("select")
                  }}
                />
              </div>

              <div className="h-px bg-border/50 my-1" />

              {/* Edge Type Button with Submenu */}
              <div className="relative">
                <ToolbarButton
                  icon={GitBranch}
                  onClick={() => handleSubmenuToggle("edges")}
                  isActive={openSubmenu === "edges"}
                  title="Tipo de Linha"
                />
                <EdgeTypeSubmenu
                  isOpen={openSubmenu === "edges"}
                  onClose={() => setOpenSubmenu(null)}
                  currentType={currentEdgeType as any}
                  onSelect={(edgeType) => {
                    onEdgeTypeChange(edgeType)
                  }}
                />
              </div>

              <div className="h-px bg-border/50 my-1" />

              <ToolbarButton
                icon={ZoomIn}
                onClick={onZoomIn}
                title="Zoom In (+)"
              />
              <ToolbarButton
                icon={ZoomOut}
                onClick={onZoomOut}
                title="Zoom Out (-)"
              />
              <ToolbarButton
                icon={RotateCw}
                onClick={onFitView}
                title="Ajustar Visualização (0)"
              />
              <div className="h-px bg-border/50 my-1" />
              <ToolbarButton
                icon={Trash2}
                onClick={onDeleteSelected}
                disabled={!hasSelectedNodes}
                title="Deletar Selecionado (Delete)"
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

