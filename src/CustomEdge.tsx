import React from 'react';
import { EdgeProps, getSmoothStepPath, MarkerType } from '@xyflow/react'; // Ensure proper imports

const CustomSmoothStepEdge: React.FC<EdgeProps & { flow?: string }> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  flow, // EdgeProps includes data for custom properties
  label,
  labelStyle
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const dynamicLabel = label || 'No Label';
   

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath href={`#${id}`} style={labelStyle}>
          {dynamicLabel}
        </textPath>
      </text>
    </>
  );
};

export default CustomSmoothStepEdge;
