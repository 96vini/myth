import type { Node } from "@xyflow/react"
import { OriginNodeConfig } from "./origin-node-config"
import { TeamNodeConfig } from "./team-node-config"
import { LeadNodeConfig } from "./lead-node-config"
import { MessageNodeConfig } from "./message-node-config"
import { BotNodeConfig } from "./bot-node-config"
import { FilterNodeConfig } from "./filter-node-config"
import { ActionNodeConfig } from "./action-node-config"

interface ConfigComponentProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
}

type ConfigComponent = React.ComponentType<ConfigComponentProps>

export const CONFIG_REGISTRY: Record<string, ConfigComponent> = {
  origin: OriginNodeConfig,
  team: TeamNodeConfig,
  lead: LeadNodeConfig,
  message: MessageNodeConfig,
  bot: BotNodeConfig,
  filter: FilterNodeConfig,
  action: ActionNodeConfig,
}

export function getConfigComponent(nodeType: string): ConfigComponent | null {
  return CONFIG_REGISTRY[nodeType] || null
}

