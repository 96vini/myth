"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap } from "lucide-react"

type BotRecord = {
  id: string
  name: string // Nome do agente/função
  employeeName: string // Nome do funcionário
  avatar: string // URL do avatar
  status: string
  description: string
  isActive: boolean
  channels: string[]
  analysisType: string
  frequency: string
  insights: number
  tools: string[]
}

const initialBots: BotRecord[] = [
  {
    id: "agent-competitor-monitor",
    name: "Monitor de Concorrentes",
    employeeName: "Ana Silva",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Ana",
    status: "ativo",
    description: "Analisa constantemente preços, estratégias e movimentações dos concorrentes no mercado.",
    isActive: true,
    channels: ["Web", "APIs", "RSS"],
    analysisType: "Competitiva",
    frequency: "Tempo real",
    insights: 1843,
    tools: ["Scraping", "Análise de preços", "Alertas"]
  },
  {
    id: "agent-market-trends",
    name: "Análise de Tendências",
    employeeName: "Carlos Mendes",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Carlos",
    status: "ativo",
    description: "Monitora tendências de mercado, redes sociais e comportamento do consumidor continuamente.",
    isActive: true,
    channels: ["Redes Sociais", "Notícias", "APIs"],
    analysisType: "Mercado",
    frequency: "A cada hora",
    insights: 2340,
    tools: ["NLP", "Sentiment analysis", "Relatórios"]
  },
  {
    id: "agent-customer-insights",
    name: "Insights de Clientes",
    employeeName: "Mariana Costa",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Mariana",
    status: "ativo",
    description: "Analisa feedbacks, reviews e interações para identificar padrões e oportunidades.",
    isActive: true,
    channels: ["Reviews", "Suporte", "E-mail"],
    analysisType: "Cliente",
    frequency: "Contínua",
    insights: 1672,
    tools: ["Análise de texto", "Categorização", "Dashboard"]
  },
  {
    id: "agent-product-monitor",
    name: "Monitor de Produtos",
    employeeName: "Rafael Santos",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rafael",
    status: "em testes",
    description: "Rastreia disponibilidade, preços e avaliações de produtos em múltiplas plataformas.",
    isActive: false,
    channels: ["E-commerce", "Marketplaces", "APIs"],
    analysisType: "Produto",
    frequency: "A cada 30min",
    insights: 1210,
    tools: ["Scraping", "Comparação", "Alertas"]
  },
  {
    id: "agent-brand-monitor",
    name: "Monitor de Marca",
    employeeName: "Julia Oliveira",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Julia",
    status: "ativo",
    description: "Monitora menções da marca, sentiment e reputação em tempo real em todas as plataformas.",
    isActive: true,
    channels: ["Redes Sociais", "Notícias", "Forums"],
    analysisType: "Marca",
    frequency: "Tempo real",
    insights: 2890,
    tools: ["Mention tracking", "Sentiment", "Crises"]
  },
  {
    id: "agent-seo-analyzer",
    name: "Analisador SEO",
    employeeName: "Pedro Alves",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Pedro",
    status: "ativo",
    description: "Analisa constantemente rankings, palavras-chave e oportunidades de otimização.",
    isActive: true,
    channels: ["Google", "Bing", "APIs"],
    analysisType: "SEO",
    frequency: "Diária",
    insights: 1456,
    tools: ["Rank tracking", "Keyword research", "Backlinks"]
  },
]

export default function Page() {
  const router = useRouter()
  const [botList, setBotList] = useState<BotRecord[]>(initialBots)
  const [searchTerm, setSearchTerm] = useState("")

  // Carregar bots do localStorage ao montar e quando a página ganha foco
  const loadBots = useCallback(() => {
    const savedBots = localStorage.getItem("bots")
    if (savedBots) {
      try {
        const parsed = JSON.parse(savedBots)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalizar dados antigos que podem não ter os novos campos
          const normalizedBots = parsed.map((b: any) => ({
            ...b,
            employeeName: b.employeeName || b.name || "Agente",
            avatar: b.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(b.employeeName || b.name || "default")}`,
          }))
          
          // Combinar bots salvos com os iniciais, evitando duplicatas
          const savedIds = new Set(normalizedBots.map((b: BotRecord) => b.id))
          const uniqueInitials = initialBots.filter((b) => !savedIds.has(b.id))
          setBotList([...normalizedBots, ...uniqueInitials])
        } else {
          setBotList(initialBots)
        }
      } catch (error) {
        console.error("Erro ao carregar bots do localStorage:", error)
        setBotList(initialBots)
      }
    } else {
      setBotList(initialBots)
    }
  }, [])

  useEffect(() => {
    loadBots()
    
    // Recarregar quando um novo bot é criado
    const handleBotCreated = () => {
      loadBots()
    }
    
    window.addEventListener("botCreated", handleBotCreated)
    return () => window.removeEventListener("botCreated", handleBotCreated)
  }, [loadBots])

  const filteredBots = useMemo(() => {
    if (!searchTerm.trim()) return botList
    const term = searchTerm.toLowerCase()
    return botList.filter((bot) => {
      const haystack = [
        bot.name,
        bot.employeeName,
        bot.description,
        bot.status,
        bot.analysisType,
        bot.channels.join(" "),
        bot.tools.join(" "),
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(term)
    })
  }, [botList, searchTerm])


  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Agentes
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Agentes de análise inteligente</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex-1 sm:w-72">
            <Input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border-border/70 bg-muted/10 focus-visible:border-[#23b559] focus-visible:ring-[#23b559]"
            />
          </div>
          <Button
            className="gap-2 rounded-full bg-[#23b559] hover:bg-[#23b559]/90 px-6"
            onClick={() => router.push("/bots/new")}
          >
            <Zap className="h-4 w-4" />
            Novo agente
          </Button>
        </div>
      </div>

      {filteredBots.length === 0 ? (
        <div className="border border-dashed border-border/70 rounded-lg p-10 text-center space-y-2">
          <p className="text-lg font-medium text-foreground">Nenhum agente encontrado</p>
          <p className="text-muted-foreground text-sm">Ajuste sua busca ou crie um novo agente de análise.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredBots.map((bot) => (
            <Card
              key={bot.id}
              className="flex flex-col gap-3 border border-border/60 bg-background/70 p-4 shadow-sm rounded-xl card-transition"
            >
              {/* Header com Avatar e Nome do Funcionário */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-border/50">
                  <AvatarImage src={bot.avatar} alt={bot.employeeName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {bot.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold truncate">{bot.employeeName}</CardTitle>
                  <p className="text-xs text-muted-foreground truncate">{bot.name}</p>
                </div>
                <button
                  onClick={() => {
                    setBotList((prev) =>
                      prev.map((b) => (b.id === bot.id ? { ...b, isActive: !b.isActive } : b))
                    )
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#23b559] focus:ring-offset-2 shrink-0 ${
                    bot.isActive ? "bg-[#23b559]" : "bg-zinc-300"
                  }`}
                  role="switch"
                  aria-checked={bot.isActive}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      bot.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {bot.description}
              </CardDescription>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded-md bg-muted/50">{bot.analysisType}</span>
                <span>•</span>
                <span>{bot.frequency}</span>
              </div>

              <Button variant="outline" className="w-full rounded-lg border-border/70 text-foreground text-sm">
                Configurar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
