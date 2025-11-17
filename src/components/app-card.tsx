import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export function AppCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn(
      "w-full h-full bg-background/70 border border-border/60 rounded-xl p-5 md:p-6",
      "card-transition",
      "hover:border-border hover:bg-background/80",
      className
    )}>
      {children}
    </Card>
  )
}