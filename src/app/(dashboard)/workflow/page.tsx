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
  Settings,
  Play,
  Pause,
  Edit,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toolbar } from "@/components/workflow/toolbar"
import { nodeTypes } from "@/components/workflow/node-type-submenu"
import { edgeTypes } from "@/components/workflow/edge-type-submenu"
import { CustomNode } from "@/components/workflow/custom-node"
import { NodeConfigPanel } from "@/components/workflow/node-config-panel"
import { EdgeLabel } from "@/components/workflow/components/edge-label"
import { DecisionNode } from "@/components/workflow/nodes/decision-node"
import { OriginNode } from "@/components/workflow/nodes/source/origin-node"
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
  nodeCounter,
  setNodeCounter,
  handleDeleteSelected,
  contextMenu,
  setContextMenu,
  handleNodeContextMenu,
  handlePaneContextMenu,
  handleContextMenuAction,
  handleAddNode: handleAddNodeProp,
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
          description: nodeTypes[nodeType].description,
          isEditing: true, // Entra em modo de edição automaticamente
        },
      }

      setNodes((nds: Node[]) => [...nds, newNode])
      setNodeCounter((prev: number) => prev + 1)
      setSelectedTool("select")
    },
    [nodeCounter, setNodes, getViewport, setNodeCounter, setSelectedTool]
  )

  const handleAddNode = useCallback(() => {
    const viewport = getViewport()
    const centerX = -viewport.x / viewport.zoom + window.innerWidth / 2 / viewport.zoom
    const centerY = -viewport.y / viewport.zoom + window.innerHeight / 2 / viewport.zoom

    const newNode: Node = {
      id: `node-${nodeCounter}`,
      type: "default",
      position: {
        x: centerX - 75,
        y: centerY - 40,
      },
      data: { 
        label: "",
        isEditing: true, // Entra em modo de edição automaticamente
      },
    }

    setNodes((nds: Node[]) => [...nds, newNode])
    setNodeCounter((prev: number) => prev + 1)
  }, [nodeCounter, setNodes, getViewport, setNodeCounter])

  const nodeColor = (node: Node) => {
    return node.selected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
  }

  // Encontrar nó selecionado
  const selectedNode = nodes.find((n: Node) => n.selected) || null

  // Handler para atualizar dados do nó
  const handleUpdateNode = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds: Node[]) =>
        nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node))
      )
    },
    [setNodes]
  )

  // Wrapper para handleContextMenuAction que inclui handleAddNode
  const handleContextMenuActionWithAdd = useCallback(
    (action: string) => {
      handleContextMenuAction(action, handleAddNode)
    },
    [handleContextMenuAction, handleAddNode]
  )

  return (
    <>
      <Toolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onAddNode={handleAddNodeByType}
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
        nodeTypes={{
          default: CustomNode,
          team: CustomNode,
          lead: CustomNode,
          message: CustomNode,
          bot: CustomNode,
          filter: CustomNode,
          action: CustomNode,
          origin: OriginNode,
          if: DecisionNode,
        }}
        edgeTypes={{
          default: EdgeLabel,
        }}
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
          color="hsl(var(--black) / 0.1)"
          gap={20}
          size={1}
        />
        <Controls
          showInteractive={false}
        />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          className="bg-background/80 backdrop-blur-sm border-border/50 rounded-xl shadow-lg"
          maskColor="hsl(var(--black) / 0.3)"
        />
      </ReactFlow>

      {/* Node Configuration Panel */}
      {selectedNode && (
        <NodeConfigPanel
          selectedNode={selectedNode}
          onClose={() => {
            setNodes((nds: Node[]) =>
              nds.map((node) => ({ ...node, selected: false }))
            )
          }}
          onUpdateNode={handleUpdateNode}
        />
      )}

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
                  <DropdownMenuLabel>Ações do Elemento</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleContextMenuActionWithAdd("edit")}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Configuração
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContextMenuActionWithAdd("duplicate")}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar Elemento
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleContextMenuActionWithAdd("test")}>
                    <Play className="h-4 w-4 mr-2" />
                    Testar Elemento
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContextMenuActionWithAdd("pause")}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar Elemento
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleContextMenuActionWithAdd("delete")}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Ações do Fluxo</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => {
                    handleAddNode()
                    setContextMenu(null)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Elemento
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleContextMenuActionWithAdd("testFlow")}>
                    <Play className="h-4 w-4 mr-2" />
                    Testar Fluxo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContextMenuActionWithAdd("settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações do Fluxo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContextMenuActionWithAdd("share")}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar Fluxo
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </>
  )
}

export default function PlansPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [edgeType, setEdgeType] = useState<keyof typeof edgeTypes>("smoothstep")
  const [markerType, setMarkerType] = useState<MarkerType>(MarkerType.ArrowClosed)
  const [nodeCounter, setNodeCounter] = useState(1)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    nodeId?: string
  } | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>("select")

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source)
      const isDecisionNode = sourceNode?.type === "if" || sourceNode?.type === "switch" || sourceNode?.type === "rule_engine"
      
      let label = ""
      if (isDecisionNode && params.sourceHandle) {
        if (params.sourceHandle === "true" || params.sourceHandle === "yes") {
          label = "Sim"
        } else if (params.sourceHandle === "false" || params.sourceHandle === "no") {
          label = "Não"
        } else {
          label = params.sourceHandle
        }
      }

      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`,
        type: edgeType,
        animated: true,
        style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        markerEnd: { type: markerType, color: "hsl(var(--primary))" },
        data: {
          label: label,
          condition: label,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [edgeType, markerType, setEdges, nodes]
  )



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
    (action: string, handleAddNodeFn?: () => void) => {
      if (contextMenu?.nodeId) {
        const node = nodes.find((n) => n.id === contextMenu.nodeId)
        if (node) {
          switch (action) {
            case "edit":
              // TODO: Abrir modal de edição do elemento
              console.log("Editar elemento:", node)
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
            case "test":
              // TODO: Testar elemento individual
              console.log("Testar elemento:", node)
              break
            case "pause":
              // TODO: Pausar elemento
              console.log("Pausar elemento:", node)
              break
          }
        }
      } else {
        switch (action) {
          case "addNode":
            if (handleAddNodeFn) {
              handleAddNodeFn()
            }
            break
          case "testFlow":
            // TODO: Testar fluxo completo
            console.log("Testar fluxo")
            break
          case "settings":
            // TODO: Abrir configurações do fluxo
            console.log("Configurações do fluxo")
            break
          case "share":
            // TODO: Compartilhar fluxo
            console.log("Compartilhar fluxo")
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
      </div>
    </ReactFlowProvider>
  )
}
