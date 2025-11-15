"use client"

import { Button } from "@/components/ui/button"
import { Submenu } from "./submenu"
import { Square, Circle, Hexagon, Diamond, LucideIcon } from "lucide-react"

const nodeTypes = {
  rectangle: { label: "Retângulo", icon: Square },
  circle: { label: "Círculo", icon: Circle },
  diamond: { label: "Losango", icon: Diamond },
  hexagon: { label: "Hexágono", icon: Hexagon },
}

interface NodeTypeSubmenuProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (nodeType: keyof typeof nodeTypes) => void
}

export function NodeTypeSubmenu({ isOpen, onClose, onSelect }: NodeTypeSubmenuProps) {
  return (
    <Submenu isOpen={isOpen} onClose={onClose} title="Tipos de Nós">
      {Object.entries(nodeTypes).map(([key, { label, icon: Icon }]) => (
        <Button
          key={key}
          variant="ghost"
          size="sm"
          className="justify-start h-9 px-2"
          onClick={() => {
            onSelect(key as keyof typeof nodeTypes)
            onClose()
          }}
        >
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </Button>
      ))}
    </Submenu>
  )
}

export { nodeTypes }

