import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { CalendarIcon, UsersIcon } from "lucide-react";

export default function AppTabsList({ children }: { children: React.ReactNode }) {
  return (
    <TabsList className="inline-flex h-12 items-center justify-center rounded-full bg-muted/50 p-1 backdrop-blur-xl border border-border/50 shadow-lg">
      {children}
    </TabsList>
  )
}