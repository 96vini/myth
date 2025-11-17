"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useNodeConfig } from "../hooks/use-node-config"
import { ORIGIN_TYPES, CAPTURE_METHODS, REQUIRED_FIELDS } from "../constants/node-types"
import type { Node } from "@xyflow/react"

interface OriginNodeConfigProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
}

export function OriginNodeConfig({ node, onUpdate }: OriginNodeConfigProps) {
  const { config, updateConfig } = useNodeConfig({
    node,
    onUpdate,
    defaultConfig: {
      originType: "whatsapp",
      captureMethod: "form",
      autoQualify: false,
      minScore: 60,
      requiredFields: ["name", "phone"],
    },
  })

  const selectedOrigin = ORIGIN_TYPES.find((o) => o.value === config.originType)

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Tipo de Origem</Label>
        <Select value={config.originType as string} onValueChange={(v) => updateConfig("originType", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORIGIN_TYPES.map((origin) => {
              const Icon = origin.icon
              return (
                <SelectItem key={origin.value} value={origin.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: origin.color }} />
                    <span>{origin.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {selectedOrigin && (
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <selectedOrigin.icon className="h-3 w-3 mr-1 inline" style={{ color: selectedOrigin.color }} />
              {selectedOrigin.label}
            </Badge>
          </div>
        )}
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium">Método de Captura</Label>
        <Select value={config.captureMethod as string} onValueChange={(v) => updateConfig("captureMethod", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CAPTURE_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Como o lead será capturado nesta origem
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Qualificação Automática</Label>
          <Checkbox
            checked={config.autoQualify as boolean}
            onCheckedChange={(checked) => updateConfig("autoQualify", checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Qualifica automaticamente leads desta origem
        </p>
      </div>

      {config.autoQualify && (
        <div>
          <Label className="text-sm font-medium">Score Mínimo</Label>
          <Input
            type="number"
            value={config.minScore as number}
            onChange={(e) => updateConfig("minScore", parseInt(e.target.value) || 0)}
            className="mt-2"
            min={0}
            max={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Score mínimo para qualificação automática
          </p>
        </div>
      )}

      <Separator />

      <div>
        <Label className="text-sm font-medium">Campos Obrigatórios</Label>
        <div className="mt-2 space-y-2">
          {REQUIRED_FIELDS.map((field) => (
            <div key={field.value} className="flex items-center gap-2">
              <Checkbox
                checked={(config.requiredFields as string[]).includes(field.value)}
                onCheckedChange={(checked) => {
                  const newFields = checked
                    ? [...(config.requiredFields as string[]), field.value]
                    : (config.requiredFields as string[]).filter((f: string) => f !== field.value)
                  updateConfig("requiredFields", newFields)
                }}
              />
              <Label
                className="text-sm cursor-pointer"
                onClick={() => {
                  const newFields = (config.requiredFields as string[]).includes(field.value)
                    ? (config.requiredFields as string[]).filter((f: string) => f !== field.value)
                    : [...(config.requiredFields as string[]), field.value]
                  updateConfig("requiredFields", newFields)
                }}
              >
                {field.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

