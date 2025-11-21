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
        className="fixed inset-0 z-10 bg-background/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="pointer-events-none fixed inset-y-0 right-0 z-20 flex items-center justify-center p-4"
        style={{ left: "var(--sidebar-width, 0px)" }}
      >
        <Card
          className={cn(
            "pointer-events-auto w-full max-w-md rounded-2xl border border-border/60 bg-background shadow-2xl p-4",
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
      </div>
    </>
  )
}

