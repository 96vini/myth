"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
  CheckCircle2,
  XCircle,
  Save,
  Link2,
  List,
  FileText,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
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

interface Workflow {
  id: string
  name: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "workflows"

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
  edgeContextMenu,
  setEdgeContextMenu,
  handleNodeContextMenu,
  handleEdgeContextMenu,
  handlePaneContextMenu,
  handleContextMenuAction,
  handleToggleEdgeCondition,
  handleAddNode: handleAddNodeProp,
  selectedTool,
  setSelectedTool,
}: any) {
  const { zoomIn, zoomOut, fitView, getViewport } = useReactFlow()
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null)
  const contextMenuInitialPosRef = useRef<{ x: number; y: number; viewport: { x: number; y: number; zoom: number } } | null>(null)
  const edgeContextMenuInitialPosRef = useRef<{ x: number; y: number; viewport: { x: number; y: number; zoom: number } } | null>(null)

  // Salvar posição inicial e viewport quando o menu abre
  useEffect(() => {
    if (contextMenu) {
      const viewport = getViewport()
      contextMenuInitialPosRef.current = { 
        x: contextMenu.x, 
        y: contextMenu.y,
        viewport: { x: viewport.x, y: viewport.y, zoom: viewport.zoom }
      }
    } else {
      contextMenuInitialPosRef.current = null
    }
  }, [contextMenu, getViewport])

  useEffect(() => {
    if (edgeContextMenu) {
      const viewport = getViewport()
      edgeContextMenuInitialPosRef.current = { 
        x: edgeContextMenu.x, 
        y: edgeContextMenu.y,
        viewport: { x: viewport.x, y: viewport.y, zoom: viewport.zoom }
      }
    } else {
      edgeContextMenuInitialPosRef.current = null
    }
  }, [edgeContextMenu, getViewport])

  // Atualizar posição do context menu durante pan/zoom do React Flow
  useEffect(() => {
    if (!contextMenu && !edgeContextMenu) return

    let animationFrameId: number | null = null
    let lastViewport = getViewport()

    const updateMenuPosition = () => {
      const currentViewport = getViewport()
      
      // Verificar se houve mudança no viewport
      const viewportChanged = 
        lastViewport.x !== currentViewport.x ||
        lastViewport.y !== currentViewport.y ||
        lastViewport.zoom !== currentViewport.zoom

      if (viewportChanged) {
        if (contextMenu && contextMenuInitialPosRef.current) {
          const initial = contextMenuInitialPosRef.current
          const deltaX = currentViewport.x - initial.viewport.x
          const deltaY = currentViewport.y - initial.viewport.y
          
          setContextMenu((prev: typeof contextMenu) => {
            if (!prev) return prev
            return {
              ...prev,
              x: initial.x - deltaX * currentViewport.zoom,
              y: initial.y - deltaY * currentViewport.zoom,
            }
          })
        }

        if (edgeContextMenu && edgeContextMenuInitialPosRef.current) {
          const initial = edgeContextMenuInitialPosRef.current
          const deltaX = currentViewport.x - initial.viewport.x
          const deltaY = currentViewport.y - initial.viewport.y
          
          setEdgeContextMenu((prev: typeof edgeContextMenu) => {
            if (!prev) return prev
            return {
              ...prev,
              x: initial.x - deltaX * currentViewport.zoom,
              y: initial.y - deltaY * currentViewport.zoom,
            }
          })
        }

        lastViewport = currentViewport
      }

      animationFrameId = requestAnimationFrame(updateMenuPosition)
    }

    animationFrameId = requestAnimationFrame(updateMenuPosition)

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [contextMenu, edgeContextMenu, getViewport, setContextMenu, setEdgeContextMenu])

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

      <div ref={reactFlowWrapperRef} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
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
          panOnScroll={true}
          panOnScrollSpeed={1}
          zoomOnScroll={false}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          style={{ width: "100%", height: "100%" }}
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
      </div>

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

      {/* Edge Context Menu */}
      {edgeContextMenu && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setEdgeContextMenu(null)}
          />
          <DropdownMenu
            open={!!edgeContextMenu}
            onOpenChange={(open) => !open && setEdgeContextMenu(null)}
          >
            <DropdownMenuContent
              style={{
                position: "fixed",
                left: `${edgeContextMenu.x}px`,
                top: `${edgeContextMenu.y}px`,
              }}
            >
              <DropdownMenuLabel>Condição da Linha</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  const edge = edges.find((e: Edge) => e.id === edgeContextMenu.edgeId)
                  if (edge) {
                    const currentIsNegation = edge.data?.isNegation || edge.data?.label === "Não"
                    if (currentIsNegation) {
                      handleToggleEdgeCondition(edgeContextMenu.edgeId)
                    }
                  }
                  setEdgeContextMenu(null)
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                Definir como Positivo (Sim)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const edge = edges.find((e: Edge) => e.id === edgeContextMenu.edgeId)
                  if (edge) {
                    const currentIsNegation = edge.data?.isNegation || edge.data?.label === "Não"
                    if (!currentIsNegation) {
                      handleToggleEdgeCondition(edgeContextMenu.edgeId)
                    }
                  }
                  setEdgeContextMenu(null)
                }}
              >
                <XCircle className="h-4 w-4 mr-2" style={{ color: "#ED333E" }} />
                Definir como Negativo (Não)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </>
  )
}

export default function PlansPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return []
        }
      }
    }
    return []
  })
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)
  const [showWorkflowList, setShowWorkflowList] = useState(false)
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
  const [edgeContextMenu, setEdgeContextMenu] = useState<{
    x: number
    y: number
    edgeId: string
  } | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>("select")
  const [workflowName, setWorkflowName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

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

      const isNegation = label === "Não" || params.sourceHandle === "false" || params.sourceHandle === "no"
      const edgeColor = isNegation ? "#ED333E" : "hsl(var(--primary))"
      
      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`,
        type: edgeType,
        animated: true,
        style: { stroke: edgeColor, strokeWidth: 2 },
        markerEnd: { type: markerType, color: edgeColor },
        data: {
          label: label,
          condition: label,
          isNegation: isNegation,
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

  const handleEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault()
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const isDecisionEdge = sourceNode?.type === "if" || sourceNode?.type === "switch" || sourceNode?.type === "rule_engine"
      
      if (isDecisionEdge) {
        setEdgeContextMenu({
          x: event.clientX,
          y: event.clientY,
          edgeId: edge.id,
        })
      }
    },
    [nodes]
  )

  const handleToggleEdgeCondition = useCallback(
    (edgeId: string) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            const currentIsNegation = edge.data?.isNegation || edge.data?.label === "Não"
            const newIsNegation = !currentIsNegation
            const newLabel = newIsNegation ? "Não" : "Sim"
            const newColor = newIsNegation ? "#ED333E" : "hsl(var(--primary))"

            return {
              ...edge,
              style: { ...edge.style, stroke: newColor },
              markerEnd: edge.markerEnd ? { ...(edge.markerEnd as any), color: newColor } : { type: markerType, color: newColor },
              data: {
                ...edge.data,
                label: newLabel,
                condition: newLabel,
                isNegation: newIsNegation,
              },
            }
          }
          return edge
        })
      )
      setEdgeContextMenu(null)
    },
    [setEdges, markerType]
  )

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

  const handleSaveWorkflow = useCallback(() => {
    if (!workflowName.trim()) {
      toast.error("Por favor, informe um nome para o workflow")
      return
    }

    setIsSaving(true)
    const workflow: Workflow = {
      id: currentWorkflowId || `workflow-${Date.now()}`,
      name: workflowName,
      nodes: nodes,
      edges: edges,
      createdAt: currentWorkflowId
        ? workflows.find((w) => w.id === currentWorkflowId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedWorkflows = currentWorkflowId
      ? workflows.map((w) => (w.id === currentWorkflowId ? workflow : w))
      : [...workflows, workflow]

    setWorkflows(updatedWorkflows)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorkflows))
    setCurrentWorkflowId(workflow.id)
    setIsSaving(false)
    toast.success("Workflow salvo com sucesso!")
  }, [workflowName, nodes, edges, currentWorkflowId, workflows])

  const handleCopyLink = useCallback(() => {
    if (!currentWorkflowId) {
      toast.error("Salve o workflow antes de copiar o link")
      return
    }

    const link = `${window.location.origin}/workflow/${currentWorkflowId}`
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link copiado para a área de transferência!")
    }).catch(() => {
      toast.error("Erro ao copiar o link")
    })
  }, [currentWorkflowId])

  const handleLoadWorkflow = useCallback((workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId)
    if (workflow) {
      setNodes(workflow.nodes)
      setEdges(workflow.edges)
      setCurrentWorkflowId(workflow.id)
      setWorkflowName(workflow.name)
      setShowWorkflowList(false)
      toast.success(`Workflow "${workflow.name}" carregado!`)
    }
  }, [workflows, setNodes, setEdges])

  const handleNewWorkflow = useCallback(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
    setCurrentWorkflowId(null)
    setWorkflowName("")
    setShowWorkflowList(false)
    toast.success("Novo workflow criado!")
  }, [setNodes, setEdges])

  const handleDeleteWorkflow = useCallback((workflowId: string) => {
    if (confirm("Tem certeza que deseja excluir este workflow?")) {
      const updatedWorkflows = workflows.filter((w) => w.id !== workflowId)
      setWorkflows(updatedWorkflows)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorkflows))
      
      if (currentWorkflowId === workflowId) {
        handleNewWorkflow()
      }
      
      toast.success("Workflow excluído com sucesso!")
    }
  }, [workflows, currentWorkflowId, handleNewWorkflow])

  // Refs para detectar cliques fora dos menus
  const workflowListRef = useRef<HTMLDivElement>(null)

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fechar lista de workflows se clicar fora
      if (
        showWorkflowList &&
        workflowListRef.current &&
        event.target
      ) {
        const target = event.target as HTMLElement
        if (!workflowListRef.current.contains(target)) {
          const button = target.closest('button')
          // Não fechar se clicar no botão "Workflows"
          if (!button || !button.textContent?.includes('Workflows')) {
            setShowWorkflowList(false)
          }
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showWorkflowList])

  return (
    <ReactFlowProvider>
      <div className="w-full h-[calc(100vh-4rem)] relative flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWorkflowList(!showWorkflowList)}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Workflows
            </Button>
            {workflows.length > 0 && (
              <Select
                value={currentWorkflowId || ""}
                onValueChange={handleLoadWorkflow}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Selecione um workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Input
              placeholder="Nome do workflow"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="max-w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewWorkflow}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Novo
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveWorkflow}
              disabled={isSaving || !workflowName.trim()}
              className="gap-2 bg-[#23b559] hover:bg-[#23b559]/90"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              disabled={!currentWorkflowId}
              className="gap-2"
            >
              <Link2 className="h-4 w-4" />
              Copiar Link
            </Button>
          </div>
        </div>

        {/* Workflow List */}
        {showWorkflowList && (
          <div 
            ref={workflowListRef}
            className="absolute top-16 left-4 z-50 w-96 max-h-[calc(100vh-12rem)] overflow-y-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle>Meus Workflows</CardTitle>
                <CardDescription>Gerencie seus fluxos de trabalho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {workflows.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum workflow salvo ainda
                  </p>
                ) : (
                  workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{workflow.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(workflow.updatedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadWorkflow(workflow.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Flow Content */}
        <div className="flex-1 relative overflow-hidden">
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
          edgeContextMenu={edgeContextMenu}
          setEdgeContextMenu={setEdgeContextMenu}
          handleNodeContextMenu={handleNodeContextMenu}
          handleEdgeContextMenu={handleEdgeContextMenu}
          handlePaneContextMenu={handlePaneContextMenu}
          handleContextMenuAction={handleContextMenuAction}
          handleToggleEdgeCondition={handleToggleEdgeCondition}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
