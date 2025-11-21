/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Upload, X, Plus, Palette, Eye, Image as ImageIcon, CreditCard, Grid3x3, Type } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ColorPalette = {
  primary: string
  secondary: string
  accent: string
  background: string
}

type ColorType = "solid" | "gradient"

type ColorConfig = {
  type: ColorType
  value: string
  gradient?: {
    from: string
    to: string
    direction: number
  }
}

type ColorPaletteConfig = {
  primary: ColorConfig
  secondary: ColorConfig
  accent: ColorConfig
  background: ColorConfig
}

type Plan = {
  id: string
  name: string
  price: string
  description: string
  features: string[]
}

type GridSettings = {
  columns: number
  gap: number
  padding: number
}

// Helper para converter cor em CSS
const getColorCSS = (config: ColorConfig): string => {
  if (config.type === "gradient" && config.gradient) {
    return `linear-gradient(${config.gradient.direction}deg, ${config.gradient.from}, ${config.gradient.to})`
  }
  return config.value
}

// Componente memoizado para Logo
const LogoSection = memo(({ logoPreview, onUpload, onGenerate, onRemove, isGenerating }: {
  logoPreview: string
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onGenerate: () => void
  onRemove: () => void
  isGenerating: boolean
}) => (
  <div className="space-y-2">
    <Label className="text-xs">Logo</Label>
    <div className="flex flex-col gap-2">
      {logoPreview ? (
        <div className="relative">
          <img
            src={logoPreview}
            alt="Logo"
            className="h-16 w-16 rounded-lg border object-cover"
            loading="lazy"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="h-16 w-16 rounded-lg border border-dashed flex items-center justify-center text-xs text-muted-foreground">
          Logo
        </div>
      )}
      <div className="flex gap-2">
        <Input
          id="logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 flex-1"
          onClick={() => document.getElementById("logo-upload")?.click()}
        >
          <Upload className="h-3 w-3" />
          Upload
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 flex-1"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          IA
        </Button>
      </div>
    </div>
  </div>
))
LogoSection.displayName = "LogoSection"

// Componente memoizado para Color Picker com Gradiente
const ColorPicker = memo(({ label, config, onChange }: {
  label: string
  config: ColorConfig
  onChange: (config: ColorConfig) => void
}) => {
  const handleTypeChange = useCallback((type: ColorType) => {
    if (type === "gradient" && !config.gradient) {
      onChange({
        type: "gradient",
        value: config.value,
        gradient: {
          from: config.value,
          to: config.value,
          direction: 90,
        },
      })
    } else {
      onChange({ ...config, type })
    }
  }, [config, onChange])

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <Select value={config.type} onValueChange={handleTypeChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="solid">Cor Sólida</SelectItem>
          <SelectItem value="gradient">Gradiente</SelectItem>
        </SelectContent>
      </Select>
      
      {config.type === "solid" ? (
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={config.value}
            onChange={(e) => onChange({ ...config, value: e.target.value })}
            className="h-9 w-16 cursor-pointer"
          />
          <Input
            type="text"
            value={config.value}
            onChange={(e) => onChange({ ...config, value: e.target.value })}
            className="h-9 flex-1 text-xs"
            placeholder="#000000"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs w-12">De:</Label>
            <Input
              type="color"
              value={config.gradient?.from || config.value}
              onChange={(e) => onChange({
                ...config,
                gradient: { ...config.gradient!, from: e.target.value },
              })}
              className="h-9 w-16 cursor-pointer"
            />
            <Input
              type="text"
              value={config.gradient?.from || config.value}
              onChange={(e) => onChange({
                ...config,
                gradient: { ...config.gradient!, from: e.target.value },
              })}
              className="h-9 flex-1 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs w-12">Para:</Label>
            <Input
              type="color"
              value={config.gradient?.to || config.value}
              onChange={(e) => onChange({
                ...config,
                gradient: { ...config.gradient!, to: e.target.value },
              })}
              className="h-9 w-16 cursor-pointer"
            />
            <Input
              type="text"
              value={config.gradient?.to || config.value}
              onChange={(e) => onChange({
                ...config,
                gradient: { ...config.gradient!, to: e.target.value },
              })}
              className="h-9 flex-1 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs w-12">Direção:</Label>
            <Input
              type="number"
              min="0"
              max="360"
              value={config.gradient?.direction || 90}
              onChange={(e) => onChange({
                ...config,
                gradient: { ...config.gradient!, direction: parseInt(e.target.value) || 90 },
              })}
              className="h-9 flex-1 text-xs"
            />
          </div>
          <div
            className="h-12 w-full rounded border"
            style={{ background: getColorCSS(config) }}
          />
        </div>
      )}
    </div>
  )
})
ColorPicker.displayName = "ColorPicker"

// Componente memoizado para Preview
const PagePreview = memo(({
  formData,
  logoPreview,
  colorPalette,
  gridSettings,
  workPhotos,
  plans,
  selectedColorElement,
  onElementClick,
}: {
  formData: { companyName: string; slogan: string }
  logoPreview: string
  colorPalette: ColorPaletteConfig
  gridSettings: GridSettings
  workPhotos: string[]
  plans: Plan[]
  selectedColorElement: string | null
  onElementClick: (element: string) => void
}) => {
  const backgroundStyle = useMemo(() => ({
    background: getColorCSS(colorPalette.background),
  }), [colorPalette.background])

  const primaryStyle = useMemo(() => ({
    color: getColorCSS(colorPalette.primary),
  }), [colorPalette.primary])

  const secondaryStyle = useMemo(() => ({
    color: getColorCSS(colorPalette.secondary),
  }), [colorPalette.secondary])

  const buttonStyle = useMemo(() => ({
    background: getColorCSS(colorPalette.primary),
    color: "#fff",
  }), [colorPalette.primary])

  return (
    <div className="w-full min-h-full" style={backgroundStyle} onClick={() => onElementClick("background")}>
      {/* Header */}
      <header
        className="px-6 py-4 border-b relative cursor-pointer"
        style={{ borderColor: getColorCSS(colorPalette.secondary) + "20" }}
        onClick={(e) => {
          e.stopPropagation()
          onElementClick("primary")
        }}
      >
        {selectedColorElement === "primary" && (
          <div className="absolute inset-0 border-2 border-dashed border-primary z-10 pointer-events-none" />
        )}
        <div className="flex items-center gap-4">
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo"
              className="h-10 w-10 rounded-lg object-cover"
              loading="lazy"
            />
          )}
          <h2 className="text-xl font-bold" style={primaryStyle}>
            {formData.companyName || "Nome da Empresa"}
          </h2>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 text-center">
        {formData.slogan && (
          <p
            className="text-2xl font-semibold mb-4 cursor-pointer inline-block relative"
            style={secondaryStyle}
            onClick={(e) => {
              e.stopPropagation()
              onElementClick("secondary")
            }}
          >
            {formData.slogan}
            {selectedColorElement === "secondary" && (
              <div className="absolute inset-0 border-2 border-dashed border-primary -m-2 rounded pointer-events-none" />
            )}
          </p>
        )}
        <Button
          style={buttonStyle}
          className="hover:opacity-90 cursor-pointer relative"
          onClick={(e) => {
            e.stopPropagation()
            onElementClick("primary")
          }}
        >
          Entre em Contato
          {selectedColorElement === "primary" && (
            <span className="absolute -top-1 -right-6 text-xs">🎨</span>
          )}
        </Button>
      </section>

      {/* Galeria de Fotos */}
      {workPhotos.length > 0 && (
        <section
          className="px-6 py-8 border-t"
          style={{
            borderColor: getColorCSS(colorPalette.secondary) + "20",
            padding: `${gridSettings.padding * 4}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3
            className="text-2xl font-semibold mb-6 cursor-pointer inline-block relative"
            style={primaryStyle}
            onClick={(e) => {
              e.stopPropagation()
              onElementClick("primary")
            }}
          >
            Nossos Trabalhos
            {selectedColorElement === "primary" && (
              <div className="absolute inset-0 border-2 border-dashed border-primary -m-2 rounded pointer-events-none" />
            )}
          </h3>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${gridSettings.columns}, minmax(0, 1fr))`,
              gap: `${gridSettings.gap * 4}px`,
            }}
          >
            {workPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={photo}
                  alt={`Trabalho ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Planos */}
      {plans.length > 0 && (
        <section
          className="px-6 py-8 border-t"
          style={{
            borderColor: getColorCSS(colorPalette.secondary) + "20",
            padding: `${gridSettings.padding * 4}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3
            className="text-2xl font-semibold mb-6 text-center cursor-pointer inline-block relative"
            style={primaryStyle}
            onClick={(e) => {
              e.stopPropagation()
              onElementClick("primary")
            }}
          >
            Nossos Planos
            {selectedColorElement === "primary" && (
              <div className="absolute inset-0 border-2 border-dashed border-primary -m-2 rounded pointer-events-none" />
            )}
          </h3>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${Math.min(gridSettings.columns, 3)}, minmax(0, 1fr))`,
            }}
          >
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="border-2"
                style={{
                  borderColor: plan.id === plans[0]?.id
                    ? getColorCSS(colorPalette.accent)
                    : getColorCSS(colorPalette.secondary) + "40",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name || "Nome do Plano"}</CardTitle>
                  <div
                    className="text-3xl font-bold mt-2 cursor-pointer relative inline-block"
                    style={primaryStyle}
                    onClick={(e) => {
                      e.stopPropagation()
                      onElementClick("primary")
                    }}
                  >
                    {plan.price || "R$ 0"}
                    {selectedColorElement === "primary" && (
                      <span className="absolute -top-1 -right-6 text-xs">🎨</span>
                    )}
                  </div>
                  {plan.description && (
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {plan.features.length > 0 && (
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div
                            className="h-1.5 w-1.5 rounded-full cursor-pointer relative"
                            style={{ backgroundColor: getColorCSS(colorPalette.accent) }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onElementClick("accent")
                            }}
                          >
                            {selectedColorElement === "accent" && (
                              <span className="absolute -top-1 -right-2 text-xs">🎨</span>
                            )}
                          </div>
                          {feature || "Feature"}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    className="w-full mt-4 relative cursor-pointer"
                    style={buttonStyle}
                    onClick={(e) => {
                      e.stopPropagation()
                      onElementClick("primary")
                    }}
                  >
                    Escolher Plano
                    {selectedColorElement === "primary" && (
                      <span className="absolute -top-1 -right-2 text-xs">🎨</span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className="px-6 py-6 border-t text-center text-sm relative cursor-pointer"
        style={{
          background: getColorCSS(colorPalette.secondary) + "10",
          borderColor: getColorCSS(colorPalette.secondary) + "20",
          color: getColorCSS(colorPalette.secondary),
        }}
        onClick={(e) => {
          e.stopPropagation()
          onElementClick("secondary")
        }}
      >
        {selectedColorElement === "secondary" && (
          <div className="absolute inset-0 border-2 border-dashed border-primary z-10 pointer-events-none" />
        )}
        <p>© {new Date().getFullYear()} {formData.companyName || "Sua Empresa"}. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
})
PagePreview.displayName = "PagePreview"

export default function PagesBuilder() {
  const [formData, setFormData] = useState({
    companyName: "",
    slogan: "",
  })
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false)
  const [isGeneratingSlogan, setIsGeneratingSlogan] = useState(false)
  const [selectedColorElement, setSelectedColorElement] = useState<string | null>(null)
  
  // Paleta de cores com suporte a gradiente
  const [colorPalette, setColorPalette] = useState<ColorPaletteConfig>({
    primary: { type: "solid", value: "#23b559" },
    secondary: { type: "solid", value: "#64748b" },
    accent: { type: "solid", value: "#f59e0b" },
    background: { type: "solid", value: "#ffffff" },
  })

  // Grid settings
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    columns: 3,
    gap: 4,
    padding: 6,
  })

  // Fotos de trabalhos/produtos
  const [workPhotos, setWorkPhotos] = useState<string[]>([])

  // Planos
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Plano Básico",
      price: "R$ 99",
      description: "Ideal para começar",
      features: ["Feature 1", "Feature 2"],
    },
  ])

  // Handlers memoizados
  const handleGenerateLogo = useCallback(async () => {
    setIsGeneratingLogo(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLogoPreview("https://placehold.co/160x160/23b559/FFFFFF?text=Logo")
    setIsGeneratingLogo(false)
  }, [])

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
  }, [])

  const handleGenerateSlogan = useCallback(async () => {
    if (!formData.companyName.trim()) {
      alert("Informe o nome da empresa antes de gerar um slogan.")
      return
    }
    setIsGeneratingSlogan(true)
    await new Promise((resolve) => setTimeout(resolve, 1400))
    setFormData((prev) => ({
      ...prev,
      slogan: `Construindo o futuro de ${prev.companyName}`,
    }))
    setIsGeneratingSlogan(false)
  }, [formData.companyName])

  const handleWorkPhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const previewUrl = URL.createObjectURL(file)
      setWorkPhotos((prev) => [...prev, previewUrl])
    })
  }, [])

  const removeWorkPhoto = useCallback((index: number) => {
    setWorkPhotos((prev) => {
      const newPhotos = [...prev]
      URL.revokeObjectURL(newPhotos[index])
      newPhotos.splice(index, 1)
      return newPhotos
    })
  }, [])

  const addNewPlan = useCallback(() => {
    setPlans((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "Novo Plano",
        price: "R$ 0",
        description: "",
        features: [],
      },
    ])
  }, [])

  const updatePlan = useCallback((id: string, field: keyof Plan, value: any) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, [field]: value } : plan))
    )
  }, [])

  const removePlan = useCallback((id: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id))
  }, [])

  const addFeatureToPlan = useCallback((planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, features: [...plan.features, "Nova feature"] }
          : plan
      )
    )
  }, [])

  const updatePlanFeature = useCallback((planId: string, featureIndex: number, value: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: plan.features.map((f, i) => (i === featureIndex ? value : f)),
            }
          : plan
      )
    )
  }, [])

  const removePlanFeature = useCallback((planId: string, featureIndex: number) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: plan.features.filter((_, i) => i !== featureIndex),
            }
          : plan
      )
    )
  }, [])

  const handleColorChange = useCallback((element: keyof ColorPaletteConfig, config: ColorConfig) => {
    setColorPalette((prev) => ({ ...prev, [element]: config }))
  }, [])

  const handleElementClick = useCallback((element: string) => {
    setSelectedColorElement(element)
  }, [])

  const selectedColorConfig = useMemo(() => {
    if (!selectedColorElement) return null
    return colorPalette[selectedColorElement as keyof ColorPaletteConfig]
  }, [selectedColorElement, colorPalette])

  const handleSelectedColorChange = useCallback((config: ColorConfig) => {
    if (!selectedColorElement) return
    handleColorChange(selectedColorElement as keyof ColorPaletteConfig, config)
  }, [selectedColorElement, handleColorChange])

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Menu Lateral Esquerdo */}
      <div className="w-80 border-r bg-background overflow-y-auto">
        <div className="p-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Configurações</h2>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="basic" className="gap-2 text-xs">
                  <Type className="h-3 w-3" /> Básico
                </TabsTrigger>
                <TabsTrigger value="design" className="gap-2 text-xs">
                  <Palette className="h-3 w-3" /> Design
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-4">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Type className="h-4 w-4" />
                    Informações Básicas
                  </div>
                  
                  <div className="space-y-3">
                    <LogoSection
                      logoPreview={logoPreview}
                      onUpload={handleLogoUpload}
                      onGenerate={handleGenerateLogo}
                      onRemove={() => setLogoPreview("")}
                      isGenerating={isGeneratingLogo}
                    />

                    <div className="space-y-2">
                      <Label className="text-xs">Nome da Empresa *</Label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Ex: Thunder Labs"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Slogan</Label>
                      <div className="space-y-2">
                        <Textarea
                          value={formData.slogan}
                          onChange={(e) => setFormData((prev) => ({ ...prev, slogan: e.target.value }))}
                          placeholder="Escreva um slogan..."
                          rows={2}
                          className="text-sm"
                          disabled={isGeneratingSlogan}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2 w-full"
                          onClick={handleGenerateSlogan}
                          disabled={isGeneratingSlogan}
                        >
                          {isGeneratingSlogan ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3" />
                              Gerar com IA
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Grid */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Grid3x3 className="h-4 w-4" />
                    Configurações de Grid
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Colunas</Label>
                      <Select
                        value={gridSettings.columns.toString()}
                        onValueChange={(value) =>
                          setGridSettings((prev) => ({ ...prev, columns: parseInt(value) }))
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Coluna{num > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Espaçamento (gap)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={gridSettings.gap}
                        onChange={(e) =>
                          setGridSettings((prev) => ({ ...prev, gap: parseInt(e.target.value) || 0 }))
                        }
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Padding</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={gridSettings.padding}
                        onChange={(e) =>
                          setGridSettings((prev) => ({ ...prev, padding: parseInt(e.target.value) || 0 }))
                        }
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Fotos */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    Fotos de Trabalhos
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      id="work-photos-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleWorkPhotoUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full"
                      onClick={() => document.getElementById("work-photos-upload")?.click()}
                    >
                      <Upload className="h-3 w-3" />
                      Adicionar Fotos
                    </Button>

                    {workPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {workPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                              loading="lazy"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeWorkPhoto(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Planos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Planos
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={addNewPlan}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {plans.map((plan) => (
                      <Card key={plan.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Input
                              value={plan.name}
                              onChange={(e) => updatePlan(plan.id, "name", e.target.value)}
                              placeholder="Nome do plano"
                              className="h-8 text-xs"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removePlan(plan.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <Input
                            value={plan.price}
                            onChange={(e) => updatePlan(plan.id, "price", e.target.value)}
                            placeholder="R$ 0"
                            className="h-8 text-xs"
                          />
                          <Textarea
                            value={plan.description}
                            onChange={(e) => updatePlan(plan.id, "description", e.target.value)}
                            placeholder="Descrição"
                            rows={2}
                            className="text-xs"
                          />
                          <div className="space-y-1">
                            {plan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <Input
                                  value={feature}
                                  onChange={(e) => updatePlanFeature(plan.id, idx, e.target.value)}
                                  placeholder="Feature"
                                  className="h-7 text-xs"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => removePlanFeature(plan.id, idx)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-full text-xs"
                              onClick={() => addFeatureToPlan(plan.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Adicionar Feature
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-6 mt-4">
                {/* Paleta de Cores */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Palette className="h-4 w-4" />
                    Paleta de Cores
                  </div>
                  
                  <div className="space-y-4">
                    <ColorPicker
                      label="Cor Primária"
                      config={colorPalette.primary}
                      onChange={(config) => handleColorChange("primary", config)}
                    />
                    <ColorPicker
                      label="Cor Secundária"
                      config={colorPalette.secondary}
                      onChange={(config) => handleColorChange("secondary", config)}
                    />
                    <ColorPicker
                      label="Cor de Destaque"
                      config={colorPalette.accent}
                      onChange={(config) => handleColorChange("accent", config)}
                    />
                    <ColorPicker
                      label="Cor de Fundo"
                      config={colorPalette.background}
                      onChange={(config) => handleColorChange("background", config)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Área Principal - Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header do Preview */}
        <div className="border-b bg-background px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Preview
            </Badge>
            {selectedColorElement && selectedColorConfig && (
              <Badge variant="default" className="text-xs">
                Editando: {selectedColorElement === "primary" ? "Cor Primária" : selectedColorElement === "secondary" ? "Cor Secundária" : selectedColorElement === "accent" ? "Cor de Destaque" : "Cor de Fundo"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedColorElement && selectedColorConfig && (
              <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
                <Select
                  value={selectedColorConfig.type}
                  onValueChange={(type) =>
                    handleSelectedColorChange({
                      ...selectedColorConfig,
                      type: type as ColorType,
                      gradient: type === "gradient" && !selectedColorConfig.gradient
                        ? { from: selectedColorConfig.value, to: selectedColorConfig.value, direction: 90 }
                        : selectedColorConfig.gradient,
                    })
                  }
                >
                  <SelectTrigger className="h-7 w-24 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Sólida</SelectItem>
                    <SelectItem value="gradient">Gradiente</SelectItem>
                  </SelectContent>
                </Select>
                {selectedColorConfig.type === "solid" ? (
                  <>
                    <Input
                      type="color"
                      value={selectedColorConfig.value}
                      onChange={(e) => handleSelectedColorChange({ ...selectedColorConfig, value: e.target.value })}
                      className="h-7 w-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedColorConfig.value}
                      onChange={(e) => handleSelectedColorChange({ ...selectedColorConfig, value: e.target.value })}
                      className="h-7 w-20 text-xs"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      type="color"
                      value={selectedColorConfig.gradient?.from || selectedColorConfig.value}
                      onChange={(e) =>
                        handleSelectedColorChange({
                          ...selectedColorConfig,
                          gradient: { ...selectedColorConfig.gradient!, from: e.target.value },
                        })
                      }
                      className="h-7 w-10 cursor-pointer"
                    />
                    <Input
                      type="color"
                      value={selectedColorConfig.gradient?.to || selectedColorConfig.value}
                      onChange={(e) =>
                        handleSelectedColorChange({
                          ...selectedColorConfig,
                          gradient: { ...selectedColorConfig.gradient!, to: e.target.value },
                        })
                      }
                      className="h-7 w-10 cursor-pointer"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="360"
                      value={selectedColorConfig.gradient?.direction || 90}
                      onChange={(e) =>
                        handleSelectedColorChange({
                          ...selectedColorConfig,
                          gradient: { ...selectedColorConfig.gradient!, direction: parseInt(e.target.value) || 90 },
                        })
                      }
                      className="h-7 w-16 text-xs"
                      placeholder="Direção"
                    />
                  </>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setSelectedColorElement(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Visualizar
            </Button>
          </div>
        </div>

        {/* Preview Full Width */}
        <div className="flex-1 overflow-auto bg-muted/20">
          <PagePreview
            formData={formData}
            logoPreview={logoPreview}
            colorPalette={colorPalette}
            gridSettings={gridSettings}
            workPhotos={workPhotos}
            plans={plans}
            selectedColorElement={selectedColorElement}
            onElementClick={handleElementClick}
          />
        </div>

        {/* Footer com Botões de Ação */}
        <div className="border-t bg-background px-4 py-3 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm">Cancelar</Button>
          <Button size="sm" className="bg-[#23b559] hover:bg-[#23b559]/90">Salvar Portfólio</Button>
        </div>
      </div>
    </div>
  )
}
