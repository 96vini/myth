import {
  PlayCircle,
  Users,
  UserCheck,
  MessageSquare,
  Bot,
  Filter,
  Send,
  GitBranch,
  MessageCircle,
  Globe,
  Facebook,
  Instagram,
  Music,
  Mail,
  UserPlus,
} from "lucide-react"

export const ORIGIN_TYPES = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366" },
  { value: "landing_page", label: "Landing Page", icon: Globe, color: "#3b82f6" },
  { value: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { value: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F" },
  { value: "tiktok", label: "TikTok", icon: Music, color: "#000000" },
  { value: "email_campaign", label: "Email Campaign", icon: Mail, color: "#6366f1" },
  { value: "manual_entry", label: "Entrada Manual", icon: UserPlus, color: "#64748b" },
] as const

export const CAPTURE_METHODS = [
  { value: "form", label: "Formulário" },
  { value: "chat", label: "Chat" },
  { value: "api", label: "API" },
  { value: "manual", label: "Manual" },
] as const

export const REQUIRED_FIELDS = [
  { value: "name", label: "Nome" },
  { value: "phone", label: "Telefone" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
] as const

export const NODE_TYPES = {
  origin: { label: "Origem", icon: PlayCircle, description: "Ponto de início do fluxo" },
  team: { label: "Equipe", icon: Users, description: "Atribuir para membro da equipe" },
  lead: { label: "Lead", icon: UserCheck, description: "Gerenciar lead" },
  message: { label: "Mensagem", icon: MessageSquare, description: "Enviar mensagem" },
  bot: { label: "Bot", icon: Bot, description: "Resposta automática" },
  filter: { label: "Filtro", icon: Filter, description: "Filtrar por condição" },
  action: { label: "Ação", icon: Send, description: "Executar ação" },
  if: { label: "Se", icon: GitBranch, description: "Decisão condicional (Sim/Não)" },
} as const

export const ORIGIN_ICONS: Record<string, any> = {
  whatsapp: MessageCircle,
  landing_page: Globe,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music,
  email_campaign: Mail,
  manual_entry: UserPlus,
}

export const ORIGIN_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  landing_page: "Landing Page",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  email_campaign: "Email",
  manual_entry: "Manual",
}

