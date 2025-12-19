interface RadarDataPoint {
  attribute: string;
  value: number;
  fullMark: number;
}

interface SimpleRadarChartProps {
  data: RadarDataPoint[];
  width?: number;
  height?: number;
}

export function SimpleRadarChart({ data, width = 400, height = 400 }: SimpleRadarChartProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;
  const levels = 5;

  // Calculate points for the data polygon
  const dataPoints = data.map((item, index) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const value = (item.value / item.fullMark) * radius;
    return {
      x: centerX + Math.cos(angle) * value,
      y: centerY + Math.sin(angle) * value,
    };
  });

  // Calculate points for the axis lines
  const axisPoints = data.map((item, index) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      labelX: centerX + Math.cos(angle) * (radius + 25),
      labelY: centerY + Math.sin(angle) * (radius + 25),
      attribute: item.attribute,
    };
  });

  // Generate concentric circles/polygons for grid
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const levelRadius = (radius * (i + 1)) / levels;
    const points = data.map((_, index) => {
      const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
      return `${centerX + Math.cos(angle) * levelRadius},${centerY + Math.sin(angle) * levelRadius}`;
    }).join(' ');
    return points;
  });

  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Grid levels */}
      {gridLevels.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {axisPoints.map((point, i) => (
        <line
          key={i}
          x1={centerX}
          y1={centerY}
          x2={point.x}
          y2={point.y}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill="rgba(59, 130, 246, 0.3)"
        stroke="rgba(59, 130, 246, 1)"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="rgb(59, 130, 246)"
          stroke="white"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {axisPoints.map((point, i) => (
        <text
          key={i}
          x={point.labelX}
          y={point.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-gray-300"
        >
          {point.attribute}
        </text>
      ))}
    </svg>
  );
}
