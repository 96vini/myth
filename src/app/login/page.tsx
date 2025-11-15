"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Sparkles, GitBranch, TrendingUp, type LucideIcon } from "lucide-react"
import { LoginForm } from "@/components/login-form"

const texts: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: "Integração com WhatsApp",
    description: "Conecte-se diretamente com seus clientes e automatize conversas para aumentar suas vendas.",
    icon: MessageCircle
  },
  {
    title: "IA para Qualificar Leads",
    description: "Use inteligência artificial para identificar e priorizar os leads mais promissores automaticamente.",
    icon: Sparkles
  },
  {
    title: "Estratégias Visuais",
    description: "Crie e visualize estratégias complexas com nosso editor de fluxo intuitivo e poderoso.",
    icon: GitBranch
  },
  {
    title: "Análise de Concorrentes",
    description: "Monitore seus concorrentes e descubra oportunidades de mercado com dados em tempo real.",
    icon: TrendingUp
  }
]

export default function LoginPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length)
        setIsVisible(true)
      }, 300)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid min-h-screen overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col overflow-y-auto p-6 md:p-10">
        <div className="flex min-h-full items-center justify-center">
          <LoginForm />
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <div 
          className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/wave_background.svg)',
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 flex mt-56 justify-center pt-8 z-10">
          <div className="max-w-md text-center" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontWeight: 600 }}>
            <div
              className={`transition-all duration-700 ease-in-out ${
                isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <div className="flex justify-center mb-4">
                {(() => {
                  const Icon = texts[currentIndex].icon
                  return <Icon className="h-12 w-12 text-white drop-shadow-lg" />
                })()}
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white drop-shadow-lg tracking-wide">
                {texts[currentIndex].title}
              </h2>
              <p className="text-white/95 font-light">
                {texts[currentIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
