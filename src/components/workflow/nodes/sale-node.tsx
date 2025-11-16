"use client"

import { useState, useEffect, useRef } from "react"
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import type { SaleNodeData } from "../types/sales-flow.types"

export function SaleNode({ id, data, selected }: NodeProps<SaleNodeData>) {
  const [isEditing, setIsEditing] = useState(data.isEditing || false)
  const [label, setLabel] = useState(data.label || "Venda")
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateNodeData } = useReactFlow()

  useEffect(() => {
    if (data.label !== undefined) {
      setLabel(data.label)
    }
  }, [data.label])

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
      label: label.trim() || "Venda",
      isEditing: false,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === "Escape") {
      setLabel(data.label || "Venda")
      setIsEditing(false)
      updateNodeData(id, { ...data, isEditing: false })
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-3 shadow-md rounded-lg border-2 min-w-[150px] bg-card relative",
        selected ? "border-green-500 shadow-lg" : "border-green-300"
      )}
      onDoubleClick={handleDoubleClick}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>VENDA</span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-green-500" />
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
          {label || "Venda"}
        </div>
      )}
    </div>
  )
}

