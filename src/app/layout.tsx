import { ThemeProvider } from "@/components/theme-provider"

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thunder',
  description: 'Gerencie seu negócio com eficiência',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
