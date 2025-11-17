"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon, FileText, Send, Zap } from "lucide-react"
import { Node } from "@xyflow/react"
import { useState } from "react"

interface MessageNodeConfigProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
}

export function MessageNodeConfig({ node, onUpdate }: MessageNodeConfigProps) {
  const [config, setConfig] = useState({
    messageType: (node.data?.messageType as string) || "text",
    content: (node.data?.content as string) || "",
    delay: (node.data?.delay as number) || 0,
    enablePersonalization: (node.data?.enablePersonalization as boolean) ?? true,
    enableMedia: (node.data?.enableMedia as boolean) ?? false,
    mediaUrl: (node.data?.mediaUrl as string) || "",
    enableButtons: (node.data?.enableButtons as boolean) ?? false,
    buttonText: (node.data?.buttonText as string) || "",
    enableTracking: (node.data?.enableTracking as boolean) ?? true,
  })

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onUpdate(node.id, { ...node.data, ...newConfig })
  }

  const messageTemplates = [
    { id: "1", name: "Boas-vindas", content: "Olá! Bem-vindo à nossa empresa..." },
    { id: "2", name: "Apresentação", content: "Somos especialistas em..." },
    { id: "3", name: "Oferta", content: "Temos uma oferta especial para você..." },
    { id: "4", name: "Follow-up", content: "Olá! Como podemos ajudar você hoje?" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Tipo de Mensagem</Label>
        <Select value={config.messageType as string} onValueChange={(v) => updateConfig("messageType", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Texto</SelectItem>
            <SelectItem value="template">Template</SelectItem>
            <SelectItem value="media">Mídia</SelectItem>
            <SelectItem value="interactive">Interativa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.messageType === "template" && (
        <div>
          <Label className="text-sm font-medium">Template</Label>
          <Select onValueChange={(v) => {
            const template = messageTemplates.find((t) => t.id === v)
            if (template) {
              updateConfig("content", template.content)
            }
          }}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione um template" />
            </SelectTrigger>
            <SelectContent>
              {messageTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className="text-sm font-medium">Conteúdo da Mensagem</Label>
        <Textarea
          value={config.content as string}
          onChange={(e) => updateConfig("content", e.target.value)}
          className="mt-2 min-h-[120px]"
          placeholder="Digite sua mensagem aqui..."
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">
            Variáveis: {"{"}nome{"}"}, {"{"}empresa{"}"}, {"{"}produto{"}"}
          </p>
          <Badge variant="outline" className="text-xs">
            {(config.content as string).length} caracteres
          </Badge>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium">Atraso de Envio (segundos)</Label>
        <Input
          type="number"
          value={config.delay as number}
          onChange={(e) => updateConfig("delay", parseInt(e.target.value) || 0)}
          className="mt-2"
          min={0}
          max={300}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Tempo de espera antes de enviar a mensagem
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Personalização</Label>
          </div>
          <Checkbox
            checked={config.enablePersonalization as boolean}
            onCheckedChange={(checked) => updateConfig("enablePersonalization", checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Substitui variáveis pelo nome, empresa, etc. do lead
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Incluir Mídia</Label>
          </div>
          <Checkbox
            checked={config.enableMedia as boolean}
            onCheckedChange={(checked) => updateConfig("enableMedia", checked)}
          />
        </div>

        {config.enableMedia && (
          <div>
            <Label className="text-sm font-medium">URL da Mídia</Label>
            <Input
              value={config.mediaUrl as string}
              onChange={(e) => updateConfig("mediaUrl", e.target.value)}
              className="mt-2"
              placeholder="https://..."
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Botões de Ação</Label>
          </div>
          <Checkbox
            checked={config.enableButtons as boolean}
            onCheckedChange={(checked) => updateConfig("enableButtons", checked)}
          />
        </div>

        {config.enableButtons && (
          <div>
            <Label className="text-sm font-medium">Texto do Botão</Label>
            <Input
              value={config.buttonText as string}
              onChange={(e) => updateConfig("buttonText", e.target.value)}
              className="mt-2"
              placeholder="Ex: Fale com um especialista"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Rastreamento</Label>
          </div>
          <Checkbox
            checked={config.enableTracking as boolean}
            onCheckedChange={(checked) => updateConfig("enableTracking", checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Registra quando a mensagem foi lida e clicada
        </p>
      </div>
    </div>
  )
}

