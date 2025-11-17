"use client"

import { memo, useMemo } from "react"
import { getBezierPath, EdgeLabelRenderer, BaseEdge, type EdgeProps } from "@xyflow/react"

function EdgeLabelComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = useMemo(
    () => getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    }),
    [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition]
  )

  const label = useMemo(() => (data?.label as string) || (data?.condition as string) || "", [data?.label, data?.condition])
  const isNegation = useMemo(() => (data?.isNegation as boolean) || label === "Não", [data?.isNegation, label])
  const labelColor = useMemo(() => isNegation ? "#ED333E" : "#23b559", [isNegation])

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        {label && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div 
              className="px-2 py-0.5 rounded text-white text-xs font-medium shadow-sm"
              style={{ backgroundColor: labelColor }}
            >
              {label}
            </div>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export const EdgeLabel = memo(EdgeLabelComponent)

