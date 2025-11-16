"use client"

import { getBezierPath, EdgeLabelRenderer, BaseEdge, type EdgeProps } from "@xyflow/react"

export function EdgeLabel({
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const label = data?.label || data?.condition || ""

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
            <div className="px-2 py-0.5 rounded bg-[#23b559] text-white text-xs font-medium shadow-sm">
              {label}
            </div>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

