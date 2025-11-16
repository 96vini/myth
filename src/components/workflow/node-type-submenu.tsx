"use client"

import { Button } from "@/components/ui/button"
import { Submenu } from "./submenu"
import { NODE_TYPES } from "./constants/node-types"

const nodeTypes = NODE_TYPES

interface NodeTypeSubmenuProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (nodeType: keyof typeof nodeTypes) => void
}

export function NodeTypeSubmenu({ isOpen, onClose, onSelect }: NodeTypeSubmenuProps) {
  return (
    <Submenu isOpen={isOpen} onClose={onClose} title="Elementos do Fluxo">
      {Object.entries(nodeTypes).map(([key, { label, icon: Icon, description }]) => (
        <Button
          key={key}
          variant="ghost"
          size="sm"
          className="justify-start h-auto py-2 px-2 flex-col items-start"
          onClick={() => {
            onSelect(key as keyof typeof nodeTypes)
            onClose()
          }}
        >
          <div className="flex items-center w-full">
            <Icon className="h-4 w-4 mr-2" />
            <span className="font-medium">{label}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-0.5 ml-6">{description}</span>
        </Button>
      ))}
    </Submenu>
  )
}

export { nodeTypes }

