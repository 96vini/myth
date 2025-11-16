"use client"

import { useState, useEffect, useRef } from "react"
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"

export function CustomNode({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(data.isEditing || false)
  const [label, setLabel] = useState(data.label || "")
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateNodeData } = useReactFlow()

  // Sincroniza o label quando data.label muda
  useEffect(() => {
    if (data.label !== undefined) {
      setLabel(data.label)
    }
  }, [data.label])

  // Sincroniza o estado de edição quando data.isEditing muda
  useEffect(() => {
    if (data.isEditing !== undefined) {
      setIsEditing(data.isEditing)
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
      label: label.trim() || data.label || "Novo elemento",
      isEditing: false 
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === "Escape") {
      setLabel(data.label || "")
      setIsEditing(false)
      updateNodeData(id, { isEditing: false })
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-3 shadow-md rounded-lg border-2 min-w-[150px] bg-card",
        selected
          ? "border-[#23b559] shadow-lg"
          : "border-border"
      )}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#23b559]" />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium text-card-foreground text-center bg-transparent border-none outline-none w-full focus:ring-0 p-0"
          style={{ minWidth: "120px" }}
        />
      ) : (
        <div className="text-sm font-medium text-card-foreground text-center cursor-text">
          {label || data.label || "Novo elemento"}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#23b559]" />
    </div>
  )
}

