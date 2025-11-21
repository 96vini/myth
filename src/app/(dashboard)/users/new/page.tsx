"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus } from "lucide-react"

type UserFormState = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const DEFAULT_FORM: UserFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export default function NewUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<UserFormState>(DEFAULT_FORM)
  const [isSaving, setIsSaving] = useState(false)

  const handleCreateUser = async () => {
    if (!formData.fullName.trim()) {
      toast.error("Nome completo é obrigatório")
      return
    }

    if (!formData.email.trim()) {
      toast.error("Email é obrigatório")
      return
    }

    if (!formData.password.trim()) {
      toast.error("Senha é obrigatória")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.fullName,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Erro ao criar usuário")
      }

      toast.success("Usuário criado com sucesso!")
      router.push("/users")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar usuário")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
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
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Novo usuário</h1>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do usuário</CardTitle>
            <CardDescription>
              Preencha os dados para criar um novo usuário no sistema.
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
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Digite a senha novamente"
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={isSaving || !formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()}
              >
                {isSaving ? (
                  "Criando..."
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar usuário
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

