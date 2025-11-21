"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolbarButtonProps {
  icon: LucideIcon
  label?: string
  onClick?: () => void
  isActive?: boolean
  disabled?: boolean
  title?: string
  variant?: "default" | "ghost"
}

function ToolbarButtonComponent({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  title,
  variant = "ghost",
}: ToolbarButtonProps) {
  return (
    <div className="relative group">
      <Button
        variant={variant}
        size="icon"
        className={cn(
          "h-10 w-10 md:h-10 md:w-10 rounded-lg flex-shrink-0",
          isActive && "bg-[#23b559] text-white hover:bg-[#23b559] hover:text-white"
        )}
        onClick={onClick}
        disabled={disabled}
        title={title}
        style={isActive ? { backgroundColor: "#23b559", color: "white" } : {}}
      >
        <Icon className="h-4 w-4" />
      </Button>
      {label && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
          {label}
        </div>
      )}
    </div>
  )
}

export const ToolbarButton = memo(ToolbarButtonComponent)

