"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { Node } from "@xyflow/react"
import { useState } from "react"

interface TeamNodeConfigProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
}

export function TeamNodeConfig({ node, onUpdate }: TeamNodeConfigProps) {
  const [config, setConfig] = useState({
    assignTo: (node.data?.assignTo as string) || "auto",
    priority: (node.data?.priority as string) || "normal",
    maxConcurrent: (node.data?.maxConcurrent as number) || 5,
    responseTime: (node.data?.responseTime as number) || 5,
    enableNotifications: (node.data?.enableNotifications as boolean) ?? true,
    enableMetrics: (node.data?.enableMetrics as boolean) ?? true,
    teamMembers: (node.data?.teamMembers as any[]) || [],
  })

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onUpdate(node.id, { ...node.data, ...newConfig })
  }

  const teamMembers = [
    { id: "1", name: "Ana Silva", status: "online", workload: 65 },
    { id: "2", name: "Carlos Santos", status: "busy", workload: 85 },
    { id: "3", name: "Maria Oliveira", status: "online", workload: 45 },
    { id: "4", name: "João Pereira", status: "offline", workload: 0 },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Atribuição</Label>
        <Select value={config.assignTo as string} onValueChange={(v) => updateConfig("assignTo", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Automática (Menor Carga)</SelectItem>
            <SelectItem value="round-robin">Round Robin</SelectItem>
            <SelectItem value="priority">Por Prioridade</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Como os leads serão distribuídos entre a equipe
        </p>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium">Prioridade</Label>
        <Select value={config.priority as string} onValueChange={(v) => updateConfig("priority", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm font-medium">Máx. Simultâneos</Label>
          <Input
            type="number"
            value={config.maxConcurrent as number}
            onChange={(e) => updateConfig("maxConcurrent", parseInt(e.target.value) || 0)}
            className="mt-2"
            min={1}
            max={20}
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Tempo Resposta (min)</Label>
          <Input
            type="number"
            value={config.responseTime as number}
            onChange={(e) => updateConfig("responseTime", parseInt(e.target.value) || 0)}
            className="mt-2"
            min={1}
            max={60}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Notificações</Label>
          </div>
          <Checkbox
            checked={config.enableNotifications as boolean}
            onCheckedChange={(checked) => updateConfig("enableNotifications", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Coletar Métricas</Label>
          </div>
          <Checkbox
            checked={config.enableMetrics as boolean}
            onCheckedChange={(checked) => updateConfig("enableMetrics", checked)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Membros da Equipe</Label>
        </div>
        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    member.status === "online"
                      ? "bg-green-500"
                      : member.status === "busy"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-sm">{member.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#23b559]"
                    style={{ width: `${member.workload}%` }}
                  />
                </div>
                <Badge variant="outline" className="text-xs">
                  {member.workload}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

