"use client"

import { useState, useEffect, useRef } from "react"
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"
import { MessageCircle } from "lucide-react"
import type { SourceNodeData, LeadPayload } from "../../types/node.types"

export function WhatsAppSourceNode({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState((data?.isEditing as boolean) || false)
  const [label, setLabel] = useState((data?.label as string) || "WhatsApp")
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateNodeData } = useReactFlow()

  useEffect(() => {
    if (data?.label !== undefined) {
      setLabel(data.label as string)
    }
  }, [data.label])

  useEffect(() => {
    if (data?.isEditing !== undefined) {
      setIsEditing(data.isEditing as boolean)
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
      label: (label as string).trim() || "WhatsApp",
      isEditing: false,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === "Escape") {
      setLabel((data?.label as string) || "WhatsApp")
      setIsEditing(false)
      updateNodeData(id, { ...data, isEditing: false })
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-3 shadow-md rounded-lg border-2 min-w-[150px] bg-card relative",
        selected ? "border-[#25D366] shadow-lg" : "border-border"
      )}
      onDoubleClick={handleDoubleClick}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <div className="bg-[#25D366] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          <span>WHATSAPP</span>
        </div>
      </div>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={label as string}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium text-card-foreground text-center bg-transparent border-none outline-none w-full focus:ring-0 p-0 mt-4"
          style={{ minWidth: "120px" }}
        />
      ) : (
        <div className="text-sm font-medium text-card-foreground text-center cursor-text mt-4">
          {label || "WhatsApp"}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#25D366]" />
    </div>
  )
}

