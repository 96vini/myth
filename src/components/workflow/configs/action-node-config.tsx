"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Send, Calendar, Tag, DollarSign, FileText, Zap } from "lucide-react"
import { Node } from "@xyflow/react"
import { useState } from "react"

interface ActionNodeConfigProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
}

export function ActionNodeConfig({ node, onUpdate }: ActionNodeConfigProps) {
  const [config, setConfig] = useState({
    actionType: (node.data?.actionType as string) || "tag",
    actionValue: (node.data?.actionValue as string) || "",
    enableNotification: (node.data?.enableNotification as boolean) ?? true,
    enableLogging: (node.data?.enableLogging as boolean) ?? true,
    delay: (node.data?.delay as number) || 0,
  })

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onUpdate(node.id, { ...node.data, ...newConfig })
  }

  const actionTypes = [
    { value: "tag", label: "Adicionar Tag", icon: Tag, description: "Marca o lead com uma tag" },
    { value: "score", label: "Atualizar Score", icon: Zap, description: "Modifica o score do lead" },
    { value: "assign", label: "Atribuir Equipe", icon: Send, description: "Atribui para um membro" },
    { value: "schedule", label: "Agendar Tarefa", icon: Calendar, description: "Cria uma tarefa futura" },
    { value: "value", label: "Definir Valor", icon: DollarSign, description: "Define valor estimado" },
    { value: "note", label: "Adicionar Nota", icon: FileText, description: "Registra uma observação" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Tipo de Ação</Label>
        <Select value={config.actionType as string} onValueChange={(v: string) => updateConfig("actionType", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {actionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {config.actionType === "tag" && (
        <div>
          <Label className="text-sm font-medium">Tag</Label>
          <Select onValueChange={(v) => updateConfig("actionValue", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione uma tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quente">Quente</SelectItem>
              <SelectItem value="morno">Morno</SelectItem>
              <SelectItem value="frio">Frio</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="convertido">Convertido</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {config.actionType === "score" && (
        <div>
          <Label className="text-sm font-medium">Novo Score</Label>
          <Input
            type="number"
            value={
              config.actionValue === undefined ||
              config.actionValue === null ||
              config.actionValue === ""
                ? ""
                : String(config.actionValue)
            }
            onChange={(e) => {
              const v = e.target.value;
              // Accept empty to allow erasing input
              if (v === "") {
                updateConfig("actionValue", "");
              } else {
                // Clamp value 0-100, only integers
                const num = Math.max(0, Math.min(100, Number(v)));
                updateConfig("actionValue", Number.isNaN(num) ? "" : num);
              }
            }}
            className="mt-2"
            min={0}
            max={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Score será atualizado quando o lead passar por este nó
          </p>
        </div>
      )}

      {config.actionType === "assign" && (
        <div>
          <Label className="text-sm font-medium">Membro da Equipe</Label>
          <Select onValueChange={(v) => updateConfig("actionValue", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione um membro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automático</SelectItem>
              <SelectItem value="ana">Ana Silva</SelectItem>
              <SelectItem value="carlos">Carlos Santos</SelectItem>
              <SelectItem value="maria">Maria Oliveira</SelectItem>
              <SelectItem value="joao">João Pereira</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {config.actionType === "schedule" && (
        <div>
          <Label className="text-sm font-medium">Dias para Agendar</Label>
          <Input
            type="number"
            value={
              config.actionValue === undefined ||
              config.actionValue === null ||
              config.actionValue === ""
                ? ""
                : String(config.actionValue)
            }
            onChange={(e) => {
              const v = e.target.value;
              // Allow the input to be cleared
              if (v === "") {
                updateConfig("actionValue", "");
              } else {
                // Clamp value 0-365, only integers
                const num = Math.max(0, Math.min(365, Number(v)));
                updateConfig("actionValue", Number.isNaN(num) ? "" : num);
              }
            }}
            className="mt-2"
            min={0}
            max={365}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Tarefa será criada para X dias no futuro
          </p>
        </div>
      )}

      {config.actionType === "value" && (
        <div>
          <Label className="text-sm font-medium">Valor Estimado (R$)</Label>
          <Input
            type="number"
            value={
              config.actionValue === undefined ||
              config.actionValue === null ||
              config.actionValue === ""
                ? ""
                : String(config.actionValue)
            }
            onChange={(e) => {
              const v = e.target.value;
              // Allow the input to be cleared
              if (v === "") {
                updateConfig("actionValue", "");
              } else {
                // Clamp value to positive numbers
                const num = Math.max(0, Number(v));
                updateConfig("actionValue", Number.isNaN(num) ? "" : num);
              }
            }}
            className="mt-2"
            min={0}
            step={0.01}
          />
        </div>
      )}

      {config.actionType === "note" && (
        <div>
          <Label className="text-sm font-medium">Nota</Label>
          <Input
            value={
              config.actionValue === undefined ||
              config.actionValue === null ||
              config.actionValue === ""
                ? ""
                : String(config.actionValue)
            }
            onChange={(e) => {
              const v = e.target.value;
              // Allow the input to be cleared
              if (v === "") {
                updateConfig("actionValue", "");
              } else {
                updateConfig("actionValue", v);
              }
            }}
            className="mt-2"
            placeholder="Digite a nota..."
          />
        </div>
      )}

      <Separator />

      <div>
        <Label className="text-sm font-medium">Atraso (segundos)</Label>
        <Input
          type="number"
            value={
            config.delay === undefined ||
            config.delay === null ||
            config.delay === 0
              ? ""
              : String(config.delay)
          }
          onChange={(e) => {
            const v = e.target.value;
            // Allow the input to be cleared
            if (v === "") {
              updateConfig("delay", "");
            } else {
              // Clamp value 0-300, only integers
              const num = Math.max(0, Math.min(300, Number(v)));
              updateConfig("delay", Number.isNaN(num) ? "" : num);
            }
          }}
          className="mt-2"
          min={0}
          max={300}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Tempo de espera antes de executar a ação
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Notificar Equipe</Label>
          </div>
          <Checkbox
            checked={!!config.enableNotification}
            onCheckedChange={(checked) =>
              updateConfig("enableNotification", checked === true)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Registrar no Log</Label>
          </div>
          <Checkbox
            checked={!!config.enableLogging}
            onCheckedChange={(checked) =>
              updateConfig("enableLogging", checked === true)
            }
          />
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Todas as ações são registradas para análise
        </p>
      </div>

      <Separator />

      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-[#23b559]" />
          <Label className="text-sm font-medium">Ações Executadas</Label>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hoje</span>
            <Badge variant="outline" className="text-xs">
              234 ações
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Esta Semana</span>
            <Badge variant="outline" className="text-xs">
              1,456 ações
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Taxa de Sucesso</span>
            <Badge variant="outline" className="text-xs text-[#23b559]">
              98.5%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

