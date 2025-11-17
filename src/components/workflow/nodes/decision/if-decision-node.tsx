"use client"

import { useState, useEffect, useRef, memo } from "react"
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"
import { GitBranch } from "lucide-react"
import type { DecisionNodeData } from "../../types/node.types"

function IfDecisionNodeComponent({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState((data?.isEditing as boolean) || false)
  const [label, setLabel] = useState((data?.label as string) || "Se")
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
      label: (label as string).trim() || "Se",
      isEditing: false,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === "Escape") {
      setLabel((data?.label as string) || "Se")
      setIsEditing(false)
      updateNodeData(id, { ...data, isEditing: false })
    }
  }

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 min-w-[150px] bg-card relative select-none",
        selected ? "border-orange-500" : "border-border"
      )}
      onDoubleClick={handleDoubleClick}
      style={{ 
        boxShadow: selected ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
        transition: "none",
        willChange: "auto"
      }}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <div className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          <span>SE</span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#23b559]" />
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
          {label || "Se"}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Left}
        id="true"
        className="w-3 h-3 bg-green-500"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3"
        style={{ right: "50%", transform: "translateX(50%)", backgroundColor: "#ED333E" }}
      />
    </div>
  )
}

export const IfDecisionNode = memo(IfDecisionNodeComponent)

