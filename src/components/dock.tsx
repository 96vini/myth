"use client"

import { useState, useCallback, useMemo, memo } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  UsersIcon,
  Calendar,
  RocketIcon,
  DollarSignIcon,
  SettingsIcon,
  FolderIcon,
  BellIcon,
  MessageSquareIcon,
  ImagesIcon,
  SquareDashedMousePointerIcon,
  type LucideIcon,
  Calendar1Icon,
  SwordIcon,
  BotIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type DockItem = {
  id: string
  icon: LucideIcon
  label: string
  href?: string
  onClick?: () => void
  separator?: boolean
}

const dockItems: (DockItem | { id: string; separator: true; icon?: never; label: string })[] = [
  {
    id: "home",
    icon: Home,
    label: "Início",
    href: "/",
  },
  {
    id: "workflow",
    icon: SquareDashedMousePointerIcon,
    label: "Fluxo",
    href: "/workflow",
  },
  {
    id: "bots",
    icon: BotIcon,
    label: "Bots",
    href: "/bots",
  },
  {
    id: "separator",
    separator: true,
    label: "",
  },
  {
    id: "notifications",
    icon: BellIcon,
    label: "Notificações",
    href: "/notifications",
  },
  {
    id: "settings",
    icon: SettingsIcon,
    label: "Configurações",
    href: "/settings",
  },
]

function DockComponent() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = useCallback((href?: string) => {
    if (!href) return false
    return pathname === href
  }, [pathname])

  const handleClick = useCallback((item: DockItem) => {
    if (item.href) {
      router.push(item.href)
    } else if (item.onClick) {
      item.onClick()
    }
  }, [router])

  const handleMouseLeave = useCallback(() => setHoveredIndex(null), [])
  const handleMouseEnter = useCallback((index: number) => setHoveredIndex(index), [])

  return (
    <div className="relative inline-flex mt-5">
      {/* Dock Container */}
      <div
        className="relative rounded-2xl bg-muted/60 border border-border/60 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:bg-muted/70"
        onMouseLeave={handleMouseLeave}
      >
        {/* Dock Items */}
        <div className="relative flex items-center gap-1.5 px-3 py-2.5">
          {dockItems.map((item, index) => {
            if (item.separator) {
              return (
                <div
                  key={item.id}
                  className="w-px h-10 bg-border/50 mx-1 transition-opacity duration-300"
                />
              )
            }

            const Icon = item.icon
            const active = isActive(item.href)
            const isHovered = hoveredIndex === index

            return (
              <div
                key={item.id}
                className="relative z-10 flex flex-col items-center"
                onMouseEnter={() => handleMouseEnter(index)}
              >
                {/* Icon Container */}
                <button
                  onClick={() => handleClick(item)}
                  className={cn(
                    "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ease-out",
                    "hover:bg-accent/60 hover:scale-110 active:scale-95",
                    active && "bg-primary hover:bg-primary/90 scale-105",
                    isHovered && !active && "scale-110"
                  )}
                >
                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground animate-in fade-in-0 zoom-in-95 duration-200" />
                  )}

                  {/* Hover Glow Effect */}
                  {isHovered && !active && (
                    <div className="absolute inset-0 rounded-xl bg-primary/10 blur-md -z-10 animate-in fade-in-0 zoom-in-95 duration-200" />
                  )}

                  {/* Icon */}
                  <Icon
                    className={cn(
                      "transition-all duration-200",
                      active 
                        ? "text-primary-foreground scale-110" 
                        : "text-foreground/70 hover:text-foreground",
                      isHovered && !active && "scale-110"
                    )}
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </button>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -bottom-11 px-3 py-1.5 rounded-lg bg-popover border border-border shadow-xl text-xs font-medium whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200 z-50 pointer-events-none">
                    {item.label}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-popover border-l border-t border-border" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const Dock = memo(DockComponent)

