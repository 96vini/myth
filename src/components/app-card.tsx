import { Card } from "./ui/card";

export function AppCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full hover:shadow-md hover:shadow-primary/5 border border-secondary/80 h-full bg-background rounded-lg p-5">
      {children}
    </Card>
  )
}