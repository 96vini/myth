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
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  Plus,
  Trash2,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toolbar } from "@/components/workflow/toolbar"
import { nodeTypes } from "@/components/workflow/node-type-submenu"
import { edgeTypes } from "@/components/workflow/edge-type-submenu"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
// Marker type options
const markerTypes = {
  [MarkerType.ArrowClosed]: "Fechada",
  [MarkerType.Arrow]: "Aberta",
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

function FlowContent({
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  edgeType,
  setEdgeType,
  markerType,
  setMarkerType,
  isAddNodeDialogOpen,
  setIsAddNodeDialogOpen,
  newNodeLabel,
  setNewNodeLabel,
  nodeCounter,
  setNodeCounter,
  handleDeleteSelected,
  contextMenu,
  setContextMenu,
  handleNodeContextMenu,
  handlePaneContextMenu,
  handleContextMenuAction,
  selectedTool,
  setSelectedTool,
}: any) {
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow()

  const handleZoomIn = useCallback(() => {
    zoomIn()
  }, [zoomIn])

  const handleZoomOut = useCallback(() => {
    zoomOut()
  }, [zoomOut])

  const handleFitView = useCallback(() => {
    fitView()
  }, [fitView])

  const handleAddNodeByType = useCallback(
    (nodeType: keyof typeof nodeTypes) => {
      const viewport = getViewport()
      const centerX = -viewport.x / viewport.zoom + window.innerWidth / 2 / viewport.zoom
      const centerY = -viewport.y / viewport.zoom + window.innerHeight / 2 / viewport.zoom

      const newNode: Node = {
        id: `node-${nodeCounter}`,
        type: nodeType,
        position: {
          x: centerX - 75,
          y: centerY - 40,
        },
        data: { 
          label: nodeTypes[nodeType].label,
          nodeType: nodeType,
        },
      }

      setNodes((nds: Node[]) => [...nds, newNode])
      setNodeCounter((prev: number) => prev + 1)
      setSelectedTool("select")
    },
    [nodeCounter, setNodes, getViewport, setNodeCounter, setSelectedTool]
  )

  const nodeColor = (node: Node) => {
    return node.selected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
  }

  return (
    <>
      <Toolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onAddNode={handleAddNodeByType}
        onEdgeTypeChange={(edgeType) => setEdgeType(edgeType as keyof typeof edgeTypes)}
        currentEdgeType={edgeType}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        onDeleteSelected={handleDeleteSelected}
        hasSelectedNodes={nodes.some((n: Node) => n.selected)}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneContextMenu={handlePaneContextMenu}
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
      </ReactFlow>
    </>
  )
}

export default function PlansPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [edgeType, setEdgeType] = useState<keyof typeof edgeTypes>("smoothstep")
  const [markerType, setMarkerType] = useState<MarkerType>(MarkerType.ArrowClosed)
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false)
  const [newNodeLabel, setNewNodeLabel] = useState("")
  const [nodeCounter, setNodeCounter] = useState(1)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    nodeId?: string
  } | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>("select")

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

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault()
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
      })
    },
    []
  )

  const handlePaneContextMenu = useCallback((event: MouseEvent | React.MouseEvent) => {
    event.preventDefault()
    const clientX = 'clientX' in event ? event.clientX : (event as MouseEvent).clientX
    const clientY = 'clientY' in event ? event.clientY : (event as MouseEvent).clientY
    setContextMenu({
      x: clientX,
      y: clientY,
    })
  }, [])

  const handleContextMenuAction = useCallback(
    (action: string) => {
      if (contextMenu?.nodeId) {
        const node = nodes.find((n) => n.id === contextMenu.nodeId)
        if (node) {
          switch (action) {
            case "copy":
              // Implementar cópia
              break
            case "delete":
              setNodes((nds) => nds.filter((n) => n.id !== contextMenu.nodeId))
              setEdges((eds) =>
                eds.filter(
                  (edge) =>
                    edge.source !== contextMenu.nodeId &&
                    edge.target !== contextMenu.nodeId
                )
              )
              break
            case "duplicate":
              const newNode: Node = {
                ...node,
                id: `node-${nodeCounter}`,
                position: {
                  x: node.position.x + 50,
                  y: node.position.y + 50,
                },
                selected: false,
              }
              setNodes((nds) => [...nds, newNode])
              setNodeCounter((prev) => prev + 1)
              break
          }
        }
      } else {
        switch (action) {
          case "addNode":
            setIsAddNodeDialogOpen(true)
            break
          case "paste":
            // Implementar colar
            break
        }
      }
      setContextMenu(null)
    },
    [contextMenu, nodes, setNodes, setEdges, nodeCounter]
  )

  return (
    <ReactFlowProvider>
      <div className="w-full h-[calc(100vh-4rem)] relative">
        <FlowContent
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          edgeType={edgeType}
          setEdgeType={setEdgeType}
          markerType={markerType}
          setMarkerType={setMarkerType}
          isAddNodeDialogOpen={isAddNodeDialogOpen}
          setIsAddNodeDialogOpen={setIsAddNodeDialogOpen}
          newNodeLabel={newNodeLabel}
          setNewNodeLabel={setNewNodeLabel}
          nodeCounter={nodeCounter}
          setNodeCounter={setNodeCounter}
          handleDeleteSelected={handleDeleteSelected}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          handleNodeContextMenu={handleNodeContextMenu}
          handlePaneContextMenu={handlePaneContextMenu}
          handleContextMenuAction={handleContextMenuAction}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />

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
              style={{ backgroundColor: "#23b559", color: "white" }}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setContextMenu(null)}
          />
          <DropdownMenu open={!!contextMenu} onOpenChange={() => setContextMenu(null)}>
            <DropdownMenuContent
              style={{
                position: "fixed",
                left: contextMenu.x,
                top: contextMenu.y,
              }}
              className="w-48"
            >
              {contextMenu.nodeId ? (
                <>
                  <DropdownMenuLabel>Ações do Nó</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleContextMenuAction("duplicate")}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContextMenuAction("copy")}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleContextMenuAction("delete")}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Ações do Canvas</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleContextMenuAction("addNode")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Nó
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContextMenuAction("paste")}>
                    <Copy className="h-4 w-4 mr-2" />
                    Colar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      </div>
    </ReactFlowProvider>
  )
}
