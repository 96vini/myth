"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Tag, DollarSign, Calendar, TrendingUp } from "lucide-react"
import { Node } from "@xyflow/react"
import { useState } from "react"

interface LeadNodeConfigProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
}

export function LeadNodeConfig({ node, onUpdate }: LeadNodeConfigProps) {
  const [config, setConfig] = useState({
    leadSource: (node.data?.leadSource as string) || "whatsapp",
    qualification: (node.data?.qualification as string) || "auto",
    minScore: (node.data?.minScore as number) || 60,
    tags: (node.data?.tags as string[]) || [],
    enableScoring: (node.data?.enableScoring as boolean) ?? true,
    enableTracking: (node.data?.enableTracking as boolean) ?? true,
    followUpDays: (node.data?.followUpDays as number) || 3,
    autoAssign: (node.data?.autoAssign as boolean) ?? true,
  })

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onUpdate(node.id, { ...node.data, ...newConfig })
  }

  const leadSources = [
    { value: "whatsapp", label: "WhatsApp", count: 245 },
    { value: "website", label: "Website", count: 89 },
    { value: "instagram", label: "Instagram", count: 156 },
    { value: "facebook", label: "Facebook", count: 67 },
  ]

  const tags = [
    { id: "1", name: "Quente", color: "bg-red-500", count: 45 },
    { id: "2", name: "Morno", color: "bg-yellow-500", count: 123 },
    { id: "3", name: "Frio", color: "bg-blue-500", count: 89 },
    { id: "4", name: "VIP", color: "bg-purple-500", count: 12 },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Origem do Lead</Label>
        <Select value={config.leadSource as string} onValueChange={(v) => updateConfig("leadSource", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {leadSources.map((source) => (
              <SelectItem key={source.value} value={source.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{source.label}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {source.count}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium">Qualificação</Label>
        <Select value={config.qualification as string} onValueChange={(v) => updateConfig("qualification", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Automática (IA)</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="hybrid">Híbrida</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Sistema de IA analisa mensagens e classifica o lead
        </p>
      </div>

      {config.enableScoring && (
        <div>
          <Label className="text-sm font-medium">Score Mínimo</Label>
          <Input
            type="number"
            value={
              typeof config.minScore === "number"
                ? config.minScore
                : typeof config.minScore === "string"
                  ? config.minScore
                  : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              // Ensures only string or number is passed, never undefined/object.
              if (value === "") {
                updateConfig("minScore", "");
              } else {
                const num = Math.max(0, Math.min(100, Number(value)));
                updateConfig("minScore", isNaN(num) ? 0 : num);
              }
            }}
            className="mt-2"
            min={0}
            max={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leads abaixo deste score serão marcados como &quot;Frio&quot;
          </p>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Sistema de Pontuação</Label>
          </div>
          <Checkbox
            checked={config.enableScoring as boolean}
            onCheckedChange={(checked) => updateConfig("enableScoring", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Rastreamento</Label>
          </div>
          <Checkbox
            checked={config.enableTracking as boolean}
            onCheckedChange={(checked) => updateConfig("enableTracking", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Atribuição Automática</Label>
          </div>
          <Checkbox
            checked={config.autoAssign as boolean}
            onCheckedChange={(checked) => updateConfig("autoAssign", checked)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Tags Disponíveis</Label>
        </div>
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${tag.color}`} />
                <span className="text-sm">{tag.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {tag.count} leads
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Follow-up (dias)</Label>
        <Input
          type="number"
          value={config.followUpDays as number}
          onChange={(e) => updateConfig("followUpDays", parseInt(e.target.value) || 0)}
          className="mt-2"
          min={1}
          max={30}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Dias para recontato automático se não houver resposta
        </p>
      </div>
    </div>
  )
}

