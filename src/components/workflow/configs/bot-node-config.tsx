"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bot, Brain, MessageSquare, Clock, AlertCircle } from "lucide-react"
import { Node } from "@xyflow/react"
import { useState } from "react"

interface BotNodeConfigProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
}

export function BotNodeConfig({ node, onUpdate }: BotNodeConfigProps) {
  const [config, setConfig] = useState({
    botType: node.data?.botType || "ai",
    aiModel: node.data?.aiModel || "gpt-4",
    responseTime: node.data?.responseTime || 2,
    enableContext: node.data?.enableContext ?? true,
    enableLearning: node.data?.enableLearning ?? true,
    fallbackToHuman: node.data?.fallbackToHuman ?? true,
    confidenceThreshold: node.data?.confidenceThreshold || 70,
    maxTurns: node.data?.maxTurns || 5,
  })

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onUpdate(node.id, { ...node.data, ...newConfig })
  }

  const aiModels = [
    { value: "gpt-4", label: "GPT-4", accuracy: 95 },
    { value: "gpt-3.5", label: "GPT-3.5 Turbo", accuracy: 88 },
    { value: "claude", label: "Claude 3", accuracy: 92 },
    { value: "custom", label: "Modelo Customizado", accuracy: 85 },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Tipo de Bot</Label>
        <Select value={config.botType} onValueChange={(v) => updateConfig("botType", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai">IA Avançada</SelectItem>
            <SelectItem value="rule">Baseado em Regras</SelectItem>
            <SelectItem value="hybrid">Híbrido</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Bot com IA entende contexto e aprende com interações
        </p>
      </div>

      {config.botType === "ai" && (
        <>
          <div>
            <Label className="text-sm font-medium">Modelo de IA</Label>
            <Select value={config.aiModel} onValueChange={(v) => updateConfig("aiModel", v)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{model.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {model.accuracy}% precisão
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Limiar de Confiança (%)</Label>
            <Input
              type="number"
              value={config.confidenceThreshold}
              onChange={(e) => updateConfig("confidenceThreshold", parseInt(e.target.value) || 0)}
              className="mt-2"
              min={0}
              max={100}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Se a confiança for menor, transfere para humano
            </p>
          </div>
        </>
      )}

      <Separator />

      <div>
        <Label className="text-sm font-medium">Tempo de Resposta (segundos)</Label>
        <Input
          type="number"
          value={config.responseTime}
          onChange={(e) => updateConfig("responseTime", parseInt(e.target.value) || 0)}
          className="mt-2"
          min={0}
          max={10}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Máximo de Turnos</Label>
        <Input
          type="number"
          value={config.maxTurns}
          onChange={(e) => updateConfig("maxTurns", parseInt(e.target.value) || 0)}
          className="mt-2"
          min={1}
          max={20}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Número máximo de interações antes de transferir
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Usar Contexto</Label>
          </div>
          <Checkbox
            checked={config.enableContext}
            onCheckedChange={(checked) => updateConfig("enableContext", checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Bot lembra conversas anteriores e histórico do lead
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Aprendizado Contínuo</Label>
          </div>
          <Checkbox
            checked={config.enableLearning}
            onCheckedChange={(checked) => updateConfig("enableLearning", checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Bot melhora respostas baseado em feedback
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Fallback para Humano</Label>
          </div>
          <Checkbox
            checked={config.fallbackToHuman}
            onCheckedChange={(checked) => updateConfig("fallbackToHuman", checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Transfere automaticamente quando não consegue responder
        </p>
      </div>

      <Separator />

      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-[#23b559]" />
          <Label className="text-sm font-medium">Estatísticas do Bot</Label>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Taxa de Sucesso</span>
            <div className="font-medium text-[#23b559]">87%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Respostas Automáticas</span>
            <div className="font-medium">1,234</div>
          </div>
          <div>
            <span className="text-muted-foreground">Transferências</span>
            <div className="font-medium">156</div>
          </div>
          <div>
            <span className="text-muted-foreground">Tempo Médio</span>
            <div className="font-medium">1.8s</div>
          </div>
        </div>
      </div>
    </div>
  )
}

