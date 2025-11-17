"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Filter, Tag, DollarSign, Calendar, TrendingUp } from "lucide-react"
import { Node } from "@xyflow/react"
import { useState } from "react"

interface FilterNodeConfigProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
}

export function FilterNodeConfig({ node, onUpdate }: FilterNodeConfigProps) {
  const [config, setConfig] = useState({
    filterType: (node.data?.filterType as string) || "score",
    condition: (node.data?.condition as string) || "greater",
    value: (node.data?.value as number) || 60,
    enableMultiple: (node.data?.enableMultiple as boolean) ?? false,
    filters: (node.data?.filters as any[]) || [],
  })

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onUpdate(node.id, { ...node.data, ...newConfig })
  }

  const filterTypes = [
    { value: "score", label: "Score do Lead", icon: TrendingUp },
    { value: "tag", label: "Tag", icon: Tag },
    { value: "value", label: "Valor Estimado", icon: DollarSign },
    { value: "date", label: "Data de Contato", icon: Calendar },
    { value: "source", label: "Origem", icon: Filter },
  ]

  const conditions = [
    { value: "greater", label: "Maior que" },
    { value: "less", label: "Menor que" },
    { value: "equal", label: "Igual a" },
    { value: "contains", label: "Contém" },
    { value: "not_contains", label: "Não contém" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Tipo de Filtro</Label>
        <Select value={config.filterType as string} onValueChange={(v) => updateConfig("filterType", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Condição</Label>
        <Select value={config.condition as string} onValueChange={(v) => updateConfig("condition", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((condition) => (
              <SelectItem key={condition.value} value={condition.value}>
                {condition.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {config.filterType === "score" && (
        <div>
          <Label className="text-sm font-medium">Valor</Label>
          <Input
            type="number"
            value={config.value as number}
            onChange={(e) => updateConfig("value", parseInt(e.target.value) || 0)}
            className="mt-2"
            min={0}
            max={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leads que passarem por este filtro seguirão para o próximo nó
          </p>
        </div>
      )}

      {config.filterType === "tag" && (
        <div>
          <Label className="text-sm font-medium">Tag</Label>
          <Select onValueChange={(v) => updateConfig("value", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione uma tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quente">Quente</SelectItem>
              <SelectItem value="morno">Morno</SelectItem>
              <SelectItem value="frio">Frio</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {config.filterType === "value" && (
        <div>
          <Label className="text-sm font-medium">Valor Estimado (R$)</Label>
          <Input
            type="number"
            value={config.value as number}
            onChange={(e) => updateConfig("value", parseFloat(e.target.value) || 0)}
            className="mt-2"
            min={0}
            step={0.01}
          />
        </div>
      )}

      {config.filterType === "date" && (
        <div>
          <Label className="text-sm font-medium">Dias desde o contato</Label>
          <Input
            type="number"
            value={config.value as number}
            onChange={(e) => updateConfig("value", parseInt(e.target.value) || 0)}
            className="mt-2"
            min={0}
          />
        </div>
      )}

      {config.filterType === "source" && (
        <div>
          <Label className="text-sm font-medium">Origem</Label>
          <Select onValueChange={(v) => updateConfig("value", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione uma origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Múltiplos Filtros</Label>
        </div>
        <Checkbox
          checked={config.enableMultiple as boolean}
          onCheckedChange={(checked) => updateConfig("enableMultiple", checked)}
        />
      </div>
      <p className="text-xs text-muted-foreground ml-6">
        Permite combinar múltiplas condições (E/OU)
      </p>

      <Separator />

      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-[#23b559]" />
          <Label className="text-sm font-medium">Impacto do Filtro</Label>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Leads que passam</span>
            <Badge variant="outline" className="text-xs">
              78%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Leads filtrados</span>
            <Badge variant="outline" className="text-xs">
              22%
            </Badge>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[#23b559] transition-all"
              style={{ width: "78%" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

