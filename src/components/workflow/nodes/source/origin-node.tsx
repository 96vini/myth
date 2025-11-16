"use client"

import { useState, useEffect, useRef } from "react"
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"
import { PlayCircle } from "lucide-react"
import { ORIGIN_ICONS, ORIGIN_LABELS } from "../../constants/node-types"

export function OriginNode({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(data.isEditing || false)
  const originType = data?.originType || "whatsapp"
  const displayLabel = data?.label || ORIGIN_LABELS[originType] || "Origem"
  const [label, setLabel] = useState(displayLabel)
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateNodeData } = useReactFlow()
  
  const Icon = ORIGIN_ICONS[originType] || PlayCircle
  const originLabel = ORIGIN_LABELS[originType]?.toUpperCase() || "ORIGEM"

  useEffect(() => {
    const currentOriginType = data?.originType || "whatsapp"
    if (data.label !== undefined) {
      setLabel(data.label)
    } else if (data?.originType) {
      setLabel(ORIGIN_LABELS[currentOriginType] || "Origem")
    }
  }, [data.label, data?.originType])

  useEffect(() => {
    if (data.isEditing !== undefined) {
      setIsEditing(data.isEditing)
    }
  }, [data.isEditing])

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
      ...data,
      label: label.trim() || "Origem",
      isEditing: false,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === "Escape") {
      setLabel(data.label || "Origem")
      setIsEditing(false)
      updateNodeData(id, { ...data, isEditing: false })
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-3 shadow-md rounded-lg border-2 min-w-[150px] bg-card relative",
        selected ? "border-[#23b559] shadow-lg" : "border-border"
      )}
      onDoubleClick={handleDoubleClick}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <div className="bg-[#23b559] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Icon className="h-3 w-3" />
          <span>{originLabel}</span>
        </div>
      </div>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium text-card-foreground text-center bg-transparent border-none outline-none w-full focus:ring-0 p-0 mt-4"
          style={{ minWidth: "120px" }}
        />
      ) : (
        <div className="text-sm font-medium text-card-foreground text-center cursor-text mt-4">
          {label || "Origem"}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#23b559]" />
    </div>
  )
}

