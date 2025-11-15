"use client"

import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolbarButtonProps {
  icon: LucideIcon
  onClick?: () => void
  isActive?: boolean
  disabled?: boolean
  title?: string
  variant?: "default" | "ghost"
}

export function ToolbarButton({
  icon: Icon,
  onClick,
  isActive = false,
  disabled = false,
  title,
  variant = "ghost",
}: ToolbarButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      className={cn("h-10 w-10 rounded-lg", isActive && "bg-[#23b559] text-white")}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={isActive ? { backgroundColor: "#23b559", color: "white" } : {}}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

