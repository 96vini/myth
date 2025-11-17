"use client"

import { useState, useEffect, useRef, memo } from "react"
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"

function CustomNodeComponent({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState((data.isEditing as boolean) || false)
  const [label, setLabel] = useState((data.label as string) || "")
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateNodeData } = useReactFlow()

  // Sincroniza o label quando data.label muda (apenas se não estiver editando)
  useEffect(() => {
    if (!isEditing && data.label !== undefined) {
      const newLabel = data.label as string
      if (newLabel !== label) {
        setLabel(newLabel)
      }
    }
  }, [data.label, isEditing]) // Removido 'label' das dependências para evitar loops

  // Sincroniza o estado de edição quando data.isEditing muda
  useEffect(() => {
    if (data.isEditing !== undefined) {
      setIsEditing(data.isEditing as boolean)
    }
  }, [data.isEditing])

  // Foca no input quando entra em modo de edição
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
    updateNodeData(id, { isEditing: true })
  }

  const handleBlur = () => {
    setIsEditing(false)
    updateNodeData(id, { 
      label: (label as string).trim() || (data.label as string) || "Novo elemento",
      isEditing: false 
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === "Escape") {
      setLabel((data.label as string) || "")
      setIsEditing(false)
      updateNodeData(id, { isEditing: false })
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 min-w-[150px] bg-card",
        "select-none",
        selected
          ? "border-[#23b559]"
          : "border-border"
      )}
      onDoubleClick={handleDoubleClick}
      style={{ 
        boxShadow: selected ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
        transition: "none",
        willChange: "auto"
      }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#23b559]" />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={label as string}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium text-card-foreground text-center bg-transparent border-none outline-none w-full focus:ring-0 p-0"
          style={{ minWidth: "120px" }}
        />
      ) : (
        <div className="text-sm font-medium text-card-foreground text-center cursor-text">
          {label || (data.label as string) || "Novo elemento"}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#23b559]" />
    </div>
  )
}

export const CustomNode = memo(CustomNodeComponent)

