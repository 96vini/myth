import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

const maxWidthClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1600px]",
  "2xl": "max-w-[1920px]",
  full: "max-w-full",
}

export function PageContainer({ 
  children, 
  className,
  maxWidth = "xl" 
}: PageContainerProps) {
  return (
    <div className={cn(
      "w-full mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10",
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}

