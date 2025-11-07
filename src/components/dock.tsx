"use client"

import { useState, useCallback } from "react"
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
    id: "customers",
    icon: ImagesIcon,
    label: "Posts",
    href: "/customers",
  },
  {
    id: "team",
    icon: Calendar1Icon,
    label: "Agenda",
    href: "/team",
  },
  {
    id: "plans",
    icon: SquareDashedMousePointerIcon,
    label: "Fluxo",
    href: "/plans",
  },
  {
    id: "finance",
    icon: SwordIcon,
    label: "Benchmark",
    href: "/finance",
  },
  {
    id: "separator",
    separator: true,
    label: "",
  },
  {
    id: "folders",
    icon: FolderIcon,
    label: "Arquivos",
    href: "/files",
  },
  {
    id: "notifications",
    icon: BellIcon,
    label: "Notificações",
    href: "/notifications",
  },
  {
    id: "messages",
    icon: MessageSquareIcon,
    label: "Mensagens",
    href: "/messages",
  },
  {
    id: "settings",
    icon: SettingsIcon,
    label: "Configurações",
    href: "/settings",
  },
]

export function Dock() {
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

  return (
    <div className="relative inline-flex">
      {/* Dock Container */}
      <div
        className="relative rounded-2xl bg-background/60 backdrop-blur-xl border border-border/10 shadow-xl"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Dock Items */}
        <div className="relative flex items-center gap-1.5 px-2 py-2">
          {dockItems.map((item, index) => {
            if (item.separator) {
              return (
                <div
                  key={item.id}
                  className="w-px h-10 bg-border/20 mx-1"
                />
              )
            }

            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {/* Icon Container */}
                <button
                  onClick={() => handleClick(item)}
                  className={cn(
                    "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200",
                    "hover:bg-muted/50",
                    active && "bg-primary hover:bg-primary/90"
                  )}
                >
                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground" />
                  )}

                  {/* Icon */}
                  <Icon
                    className={cn(
                      "transition-colors duration-200",
                      active 
                        ? "text-primary-foreground" 
                        : "text-foreground/60 hover:text-foreground"
                    )}
                    size={20}
                    strokeWidth={2}
                  />
                </button>

                {/* Tooltip */}
                {hoveredIndex === index && (
                  <div className="absolute -bottom-10 px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg text-xs font-medium whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-100">
                    {item.label}
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

