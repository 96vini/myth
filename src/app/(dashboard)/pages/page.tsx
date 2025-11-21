/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Upload } from "lucide-react"

export default function PagesBuilder() {
  const [formData, setFormData] = useState({
    companyName: "",
    slogan: "",
  })
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false)
  const [isGeneratingSlogan, setIsGeneratingSlogan] = useState(false)

  const handleGenerateLogo = async () => {
    setIsGeneratingLogo(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLogoPreview("https://placehold.co/160x160/23b559/FFFFFF?text=Logo")
    setIsGeneratingLogo(false)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
  }

  const handleGenerateSlogan = async () => {
    if (!formData.companyName.trim()) {
      alert("Informe o nome da empresa antes de gerar um slogan.")
      return
    }
    setIsGeneratingSlogan(true)
    await new Promise((resolve) => setTimeout(resolve, 1400))
    setFormData((prev) => ({
      ...prev,
      slogan: `Construindo o futuro de ${formData.companyName}`,
    }))
    setIsGeneratingSlogan(false)
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <div className="flex flex-col gap-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Builder</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Construa sua página</h1>
            <p className="text-muted-foreground text-sm">
              Defina os elementos principais e utilize nossa IA para acelerar o processo.
            </p>
          </div>
        </div>

        <Card className="max-w-7xl">
          <CardHeader>
            <CardTitle>Informações da página</CardTitle>
            <CardDescription>
              Configure a identidade da sua página antes de iniciar a construção visual.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">Logo</Label>
              <div className="space-y-3">
                <div className="flex flex-col justify-center items-center gap-3 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-24 w-24 rounded-xl border object-cover shadow-sm"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-xl border border-dashed border-muted-foreground/40 flex items-center justify-center text-xs text-muted-foreground">
                      Miniatura
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Faça upload do logo da sua empresa ou deixe nossa IA gerar um automaticamente.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={handleGenerateLogo}
                      disabled={isGeneratingLogo}
                    >
                      {isGeneratingLogo ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Gerar com IA
                        </>
                      )}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => document.getElementById("logo-upload")?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="companyName" className="text-sm font-medium text-muted-foreground">
                Nome da empresa *
              </Label>
              <Input
                id="companyName"
                placeholder="Ex: Thunder Labs"
                value={formData.companyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="slogan" className="text-sm font-medium text-muted-foreground">
                Slogan
              </Label>
              <div className="flex flex-col gap-3">
                <Textarea
                  id="slogan"
                  rows={3}
                  placeholder="Escreva um slogan impactante..."
                  value={formData.slogan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slogan: e.target.value }))}
                  disabled={isGeneratingSlogan}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 self-start"
                  onClick={handleGenerateSlogan}
                  disabled={isGeneratingSlogan}
                >
                  {isGeneratingSlogan ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando slogan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Gerar slogan com IA
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline">Cancelar</Button>
              <Button className="bg-[#23b559] hover:bg-[#23b559]/90">Continuar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

