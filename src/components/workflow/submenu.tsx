"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface SubmenuProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Submenu({ isOpen, onClose, title, children, className }: SubmenuProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
      />
      <Card
        className={cn(
          "absolute left-full ml-2 top-0 p-2 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl min-w-[180px] z-20",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            {title}
          </div>
          {children}
        </div>
      </Card>
    </>
  )
}

