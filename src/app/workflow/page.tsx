"use client"

import { useState, useCallback } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  Plus,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
// Edge type options
const edgeTypes = {
  straight: "Reta",
  smoothstep: "Suave",
  step: "Degrau",
  bezier: "Curva",
}

// Marker type options
const markerTypes = {
  [MarkerType.ArrowClosed]: "Fechada",
  [MarkerType.Arrow]: "Aberta",
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function PlansPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [edgeType, setEdgeType] = useState<keyof typeof edgeTypes>("smoothstep")
  const [markerType, setMarkerType] = useState<MarkerType>(MarkerType.ArrowClosed)
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false)
  const [newNodeLabel, setNewNodeLabel] = useState("")
  const [nodeCounter, setNodeCounter] = useState(1)

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`,
        type: edgeType,
        animated: true,
        style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        markerEnd: { type: markerType, color: "hsl(var(--primary))" },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [edgeType, markerType, setEdges]
  )

  const handleAddNode = useCallback(() => {
    if (!newNodeLabel.trim()) return

    const newNode: Node = {
      id: `node-${nodeCounter}`,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: newNodeLabel },
    }

    setNodes((nds) => [...nds, newNode])
    setNodeCounter((prev) => prev + 1)
    setNewNodeLabel("")
    setIsAddNodeDialogOpen(false)
  }, [newNodeLabel, nodeCounter, setNodes])

  const handleDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected))
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !nodes.find((n) => n.selected && (n.id === edge.source || n.id === edge.target))
      )
    )
  }, [nodes, setNodes, setEdges])

  const nodeColor = (node: Node) => {
    return node.selected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-gradient-to-br from-background via-background to-muted/20"
        connectionLineStyle={{ stroke: "hsl(var(--primary))", strokeWidth: 2 }}
        defaultEdgeOptions={{
          type: edgeType,
          animated: true,
          style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
          markerEnd: { type: markerType, color: "hsl(var(--primary))" },
        }}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background
          color="hsl(var(--muted-foreground) / 0.1)"
          gap={20}
          size={1}
        />
        <Controls
          className="bg-background/80 backdrop-blur-sm border-border/50 rounded-xl shadow-lg"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          className="bg-background/80 backdrop-blur-sm border-border/50 rounded-xl shadow-lg"
          maskColor="hsl(var(--background) / 0.3)"
        />

        {/* Top Panel */}
        <Panel position="top-center" className="mt-4">
          <Card className="px-6 py-4 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Editor de Fluxo
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione nós e conecte-os com diferentes tipos de setas
                </p>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  onClick={() => setIsAddNodeDialogOpen(true)}
                  className="rounded-xl"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nó
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="rounded-xl"
                  disabled={!nodes.some((n) => n.selected)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar Selecionado
                </Button>
              </div>
            </div>
          </Card>
        </Panel>

        {/* Edge Type Selector Panel */}
        <Panel position="top-left" className="mt-24 ml-4">
          <Card className="p-4 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl min-w-[250px]">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Tipo de Linha</Label>
                <Select
                  value={edgeType}
                  onValueChange={(value) => setEdgeType(value as keyof typeof edgeTypes)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(edgeTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Tipo de Seta</Label>
                <Select
                  value={markerType.toString()}
                  onValueChange={(value) => setMarkerType(Number(value) as unknown as MarkerType)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(markerTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Nós</span>
                  <Badge variant="secondary" className="rounded-full">
                    {nodes.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-muted-foreground">Conexões</span>
                  <Badge variant="secondary" className="rounded-full">
                    {edges.length}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </Panel>
      </ReactFlow>

      {/* Add Node Dialog */}
      <Dialog open={isAddNodeDialogOpen} onOpenChange={setIsAddNodeDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl border-border/50">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold">Adicionar Novo Nó</DialogTitle>
            <DialogDescription className="text-base">
              Digite o nome do nó que deseja adicionar ao fluxo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nodeLabel" className="text-sm font-semibold">
                Nome do Nó
              </Label>
              <Input
                id="nodeLabel"
                placeholder="Ex: Estratégia de Marketing"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddNode()
                  }
                }}
                className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddNodeDialogOpen(false)
                setNewNodeLabel("")
              }}
              className="h-11 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddNode}
              disabled={!newNodeLabel.trim()}
              className="h-11 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
