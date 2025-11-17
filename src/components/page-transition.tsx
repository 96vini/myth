"use client"

import { useEffect, useState, useRef, memo } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

function PageTransitionComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isExiting, setIsExiting] = useState(false)
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      // Iniciar fade-out
      setIsExiting(true)
      
      // Após fade-out, atualizar conteúdo e iniciar fade-in
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsExiting(false)
        prevPathnameRef.current = pathname
      }, 200) // Duração do fade-out (mais rápido)

      return () => clearTimeout(timer)
    }
  }, [pathname, children]) // Mantido children apenas quando pathname muda

  // Atualizar children quando pathname não muda (primeira renderização)
  useEffect(() => {
    if (prevPathnameRef.current === pathname) {
      setDisplayChildren(children)
    }
  }, [children, pathname])

  return (
    <div className="w-full relative">
      <div
        className={cn(
          "w-full",
          isExiting && "page-transition-exit"
        )}
      >
        <div className={cn(
          "w-full",
          !isExiting && "page-transition"
        )}>
          {displayChildren}
        </div>
      </div>
    </div>
  )
}

export const PageTransition = memo(PageTransitionComponent)

