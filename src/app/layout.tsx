import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavHeader from "@/components/nav-header"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Myth',
  description: 'Organize your credentials',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <div className="w-full flex flex-col md:flex-row justify-between">
            
            <div className="hidden md:block">
              <AppSidebar />
            </div>

            <main className="antialiased flex-1 h-screen bg-muted overflow-y-auto">
              <div className="flex justify-between py-4 px-3">
                <div className="block md:hidden">
                  <SidebarTrigger />
                </div>
                <NavHeader />
              </div>
              {children}
            </main>
          
          </div>
          </SidebarProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}
