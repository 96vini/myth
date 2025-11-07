"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    badge?: string | number
  }[]
  label?: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/70">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url + '/')
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  className={cn(
                    "transition-all duration-200",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon className={cn(
                        "transition-all",
                        isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/60"
                      )} />
                    )}
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium transition-colors",
                        isActive 
                          ? "bg-sidebar-accent-foreground/10 text-sidebar-accent-foreground" 
                          : "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
