import { AppHeader } from "@/components/app-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="page-transition">
          {children}
        </div>
      </main>
    </div>
  )
}

