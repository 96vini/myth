"use client"

import { Button } from "@/components/ui/button"
import { Submenu } from "./submenu"

const edgeTypes = {
  straight: "Reta",
  smoothstep: "Suave",
  step: "Degrau",
  bezier: "Curva",
}

interface EdgeTypeSubmenuProps {
  isOpen: boolean
  onClose: () => void
  currentType: keyof typeof edgeTypes
  onSelect: (edgeType: keyof typeof edgeTypes) => void
}

export function EdgeTypeSubmenu({
  isOpen,
  onClose,
  currentType,
  onSelect,
}: EdgeTypeSubmenuProps) {
  return (
    <Submenu isOpen={isOpen} onClose={onClose} title="Tipo de Linha">
      {Object.entries(edgeTypes).map(([key, label]) => (
        <Button
          key={key}
          variant={currentType === key ? "default" : "ghost"}
          size="sm"
          className="justify-start h-9 px-2"
          onClick={() => {
            onSelect(key as keyof typeof edgeTypes)
            onClose()
          }}
          style={
            currentType === key
              ? { backgroundColor: "#23b559", color: "white" }
              : {}
          }
        >
          {label}
        </Button>
      ))}
    </Submenu>
  )
}

export { edgeTypes }

