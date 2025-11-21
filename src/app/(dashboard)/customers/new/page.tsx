"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus } from "lucide-react"

const ORIGIN_OPTIONS = [
  { value: "Website", label: "Website" },
  { value: "Indicação", label: "Indicação" },
  { value: "Redes Sociais", label: "Redes Sociais" },
  { value: "Google Ads", label: "Google Ads" },
  { value: "Facebook Ads", label: "Facebook Ads" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Evento", label: "Evento" },
  { value: "Outro", label: "Outro" },
]

type ClientFormState = {
  fullName: string
  email: string
  phone: string
  origin: string
}

const DEFAULT_FORM: ClientFormState = {
  fullName: "",
  email: "",
  phone: "",
  origin: "",
}

export default function NewClientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ClientFormState>(DEFAULT_FORM)
  const [isSaving, setIsSaving] = useState(false)

  const handleCreateClient = async () => {
    if (!formData.fullName.trim()) {
      toast.error("Nome completo é obrigatório")
      return
    }

    if (!formData.email.trim()) {
      toast.error("Email é obrigatório")
      return
    }

    if (!formData.origin.trim()) {
      toast.error("Origem é obrigatória")
      return
    }

    setIsSaving(true)

    try {
      // TODO: Integrar com a API
      const newClient = {
        id: `client-${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        origin: formData.origin,
        active: true,
      }

      // Salvar no localStorage temporariamente
      const existingClients = JSON.parse(localStorage.getItem("clients") || "[]")
      const updatedClients = [newClient, ...existingClients]
      localStorage.setItem("clients", JSON.stringify(updatedClients))

      toast.success("Cliente criado com sucesso!")
      router.push("/customers")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar cliente")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Novo cliente</h1>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do cliente</CardTitle>
            <CardDescription>
              Preencha os dados para criar um novo cliente no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="João Silva"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="joao@exemplo.com"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Origem *</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, origin: value }))}
                  disabled={isSaving}
                >
                  <SelectTrigger id="origin">
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORIGIN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateClient}
                disabled={isSaving || !formData.fullName.trim() || !formData.email.trim() || !formData.origin.trim()}
              >
                {isSaving ? (
                  "Criando..."
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar cliente
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
