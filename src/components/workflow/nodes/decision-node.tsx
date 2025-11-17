"use client"

import { useState, useEffect, useRef, memo } from "react"
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"
import { GitBranch, CheckCircle2, XCircle } from "lucide-react"

function DecisionNodeComponent({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState((data?.isEditing as boolean) || false)
  const [label, setLabel] = useState((data?.label as string) || "Condição")
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateNodeData } = useReactFlow()

  useEffect(() => {
    if (data?.label !== undefined) {
      setLabel(data.label as string)
    }
  }, [data?.label])

  useEffect(() => {
    if (data?.isEditing !== undefined) {
      setIsEditing(data.isEditing as boolean)
    }
  }, [data?.isEditing])

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
      label: (label as string).trim() || "Condição",
      isEditing: false,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === "Escape") {
      setLabel((data?.label as string) || "Condição")
      setIsEditing(false)
      updateNodeData(id, { ...data, isEditing: false })
    }
  }

  return (
    <div className="relative" style={{ width: "180px", height: "120px" }}>
      {/* Diamond/Decision Shape */}
      <div
        className={cn(
          "absolute inset-0 border-2 bg-card flex items-center justify-center select-none",
          selected ? "border-orange-500" : "border-orange-400/60"
        )}
        style={{
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          boxShadow: selected ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
          transition: "none",
          willChange: "auto"
        }}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-full h-full flex items-center justify-center px-4">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={label as string}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-xs font-medium text-card-foreground text-center bg-transparent border-none outline-none w-full focus:ring-0 p-0"
              style={{ minWidth: "100px" }}
            />
          ) : (
            <div className="text-xs font-semibold text-card-foreground text-center cursor-text px-2">
              {label || "Condição"}
            </div>
          )}
        </div>
      </div>

      {/* Badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
          <GitBranch className="h-2.5 w-2.5" />
          <span>DECISÃO</span>
        </div>
      </div>

      {/* Top Handle (Input) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-[#23b559] border-2 border-background"
        style={{ top: "10px" }}
      />

      {/* Left Handle (Sim/True) */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10">
        <Handle
          type="source"
          id="true"
          position={Position.Left}
          className="w-4 h-4 border-2 border-background"
          style={{ backgroundColor: "#10b981", left: "-8px" }}
        />
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/30 shadow-sm whitespace-nowrap">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">Sim</span>
        </div>
      </div>

      {/* Right Handle (Não/False) */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10">
        <Handle
          type="source"
          id="false"
          position={Position.Right}
          className="w-4 h-4 border-2 border-background"
          style={{ backgroundColor: "#ED333E", right: "-8px" }}
        />
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#ED333E]/10 border border-[#ED333E]/30 shadow-sm whitespace-nowrap">
          <XCircle className="h-3 w-3" style={{ color: "#ED333E" }} />
          <span className="text-[10px] font-semibold" style={{ color: "#ED333E" }}>Não</span>
        </div>
      </div>
    </div>
  )
}

export const DecisionNode = memo(DecisionNodeComponent)
