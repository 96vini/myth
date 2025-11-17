"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Zap } from "lucide-react"

const STATUS_OPTIONS = [
  { value: "ativo", label: "Ativo" },
  { value: "em testes", label: "Em testes" },
  { value: "pausado", label: "Pausado" },
]

type BotFormState = {
  name: string // Nome do agente/função
  employeeName: string // Nome do funcionário
  avatar: string // URL do avatar
  description: string
  status: string
  isActive: boolean
  channels: string
  analysisType: string
  frequency: string
  insights: string
  tools: string
}

const DEFAULT_FORM: BotFormState = {
  name: "",
  employeeName: "",
  avatar: "",
  description: "",
  status: "ativo",
  isActive: false,
  channels: "Web",
  analysisType: "Competitiva",
  frequency: "Tempo real",
  insights: "0",
  tools: "Análise",
}

export default function NewAgentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<BotFormState>(DEFAULT_FORM)
  const [isSaving, setIsSaving] = useState(false)

  const handleCreateBot = async () => {
    if (!formData.employeeName.trim()) {
      toast.error("Por favor, informe o nome do agente")
      return
    }

    if (!formData.name.trim()) {
      toast.error("Por favor, informe o nome da função/agente")
      return
    }

    setIsSaving(true)

    // Simular salvamento (aqui você integraria com sua API)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Salvar no localStorage (temporário)
    const channels = formData.channels
      .split(",")
      .map((channel) => channel.trim())
      .filter(Boolean)
    const tools = formData.tools
      .split(",")
      .map((tool) => tool.trim())
      .filter(Boolean)

    // Gerar avatar automático se não fornecido (robô)
    const avatar = formData.avatar.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.employeeName)}`

    const newBot = {
      id: `agent-${Date.now()}`,
      name: formData.name || "Novo Agente",
      employeeName: formData.employeeName || "Agente",
      avatar: avatar,
      status: formData.status || "ativo",
      description: formData.description || "Agente configurado para análise constante.",
      isActive: formData.isActive ?? false,
      channels: channels.length ? channels : ["Web"],
      analysisType: formData.analysisType || "Competitiva",
      frequency: formData.frequency || "Tempo real",
      insights: Number(formData.insights) || 0,
      tools: tools.length ? tools : ["Análise"],
    }

    // Obter lista atual do localStorage
    const existingBots = JSON.parse(localStorage.getItem("bots") || "[]")
    const updatedBots = [newBot, ...existingBots]
    localStorage.setItem("bots", JSON.stringify(updatedBots))

    setIsSaving(false)
    toast.success("Agente criado com sucesso!")
    
    // Disparar evento para atualizar a lista na página anterior
    window.dispatchEvent(new CustomEvent("botCreated"))
    
    router.push("/bots")
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="transition-all duration-150 hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Novo Agente
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Criar agente de análise</h1>
          </div>
        </div>

        {/* Form Card */}
        <Card className="card-transition">
          <CardHeader>
            <CardTitle>Configuração do agente</CardTitle>
            <CardDescription>
              Configure um agente para análise constante. Ele monitorará e analisará dados automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeName" className="text-sm font-medium text-muted-foreground">
                  Nome do agente *
                </Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employeeName: e.target.value }))}
                  placeholder="Ex: Bot-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar" className="text-sm font-medium text-muted-foreground">
                  URL do avatar (opcional)
                </Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                  placeholder="Deixe vazio para gerar automaticamente"
                />
                <p className="text-xs text-muted-foreground">
                  Se não informado, será gerado automaticamente baseado no nome
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  Nome da função/agente *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Monitor de Concorrentes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-muted-foreground">
                  Status inicial
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o que este agente irá analisar e monitorar."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysisType" className="text-sm font-medium text-muted-foreground">
                  Tipo de análise
                </Label>
                <Select
                  value={formData.analysisType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, analysisType: value }))}
                >
                  <SelectTrigger id="analysisType">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Competitiva">Competitiva</SelectItem>
                    <SelectItem value="Mercado">Mercado</SelectItem>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                    <SelectItem value="Produto">Produto</SelectItem>
                    <SelectItem value="Marca">Marca</SelectItem>
                    <SelectItem value="SEO">SEO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-sm font-medium text-muted-foreground">
                  Frequência de análise
                </Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tempo real">Tempo real</SelectItem>
                    <SelectItem value="A cada hora">A cada hora</SelectItem>
                    <SelectItem value="A cada 30min">A cada 30min</SelectItem>
                    <SelectItem value="Contínua">Contínua</SelectItem>
                    <SelectItem value="Diária">Diária</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive" className="text-sm font-medium text-muted-foreground">
                    Ativo e configurado
                  </Label>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#23b559] focus:ring-offset-2 ${
                      formData.isActive ? "bg-[#23b559]" : "bg-zinc-300"
                    }`}
                    role="switch"
                    aria-checked={formData.isActive}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channels" className="text-sm font-medium text-muted-foreground">
                  Canais de dados (separados por vírgula)
                </Label>
                <Input
                  id="channels"
                  value={formData.channels}
                  onChange={(e) => setFormData((prev) => ({ ...prev, channels: e.target.value }))}
                  placeholder="Web, APIs, Redes Sociais"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tools" className="text-sm font-medium text-muted-foreground">
                  Ferramentas (separadas por vírgula)
                </Label>
                <Input
                  id="tools"
                  value={formData.tools}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tools: e.target.value }))}
                  placeholder="Scraping, Análise de texto, Alertas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insights" className="text-sm font-medium text-muted-foreground">
                  Insights gerados
                </Label>
                <Input
                  id="insights"
                  type="number"
                  value={formData.insights}
                  onChange={(e) => setFormData((prev) => ({ ...prev, insights: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
                Cancelar
              </Button>
              <Button
                className="bg-[#23b559] hover:bg-[#23b559]/90 gap-2"
                onClick={handleCreateBot}
                disabled={isSaving || !formData.name.trim()}
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Criando...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Criar agente
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

