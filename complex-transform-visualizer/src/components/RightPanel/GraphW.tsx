import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Curve, Point, TransformType } from '../../types';
import { getTransformFormula } from '../../math/transforms';

interface GraphWProps {
  curves: Curve[];
  points: Point[];
  transformType: TransformType;
}

// Función para calcular la posición y ángulo de las flechas
function calculateArrowAnnotations(curves: Curve[]): Plotly.Layout['annotations'] {
  const annotations: Plotly.Layout['annotations'] = [];
  
  curves.forEach((curve) => {
    if (curve.points.length < 2) return;
    
    // Colocar flechas en varios puntos a lo largo de la curva
    const numArrows = Math.min(3, Math.floor(curve.points.length / 10));
    
    for (let i = 0; i < numArrows; i++) {
      // Distribuir las flechas uniformemente
      const position = Math.floor((i + 1) * curve.points.length / (numArrows + 1));
      const prevPosition = Math.max(0, position - 1);
      
      const p1 = curve.points[prevPosition];
      const p2 = curve.points[position];
      
      if (!p1 || !p2) continue;
      
      // Calcular el ángulo de la flecha
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      
      annotations.push({
        x: p2.x,
        y: p2.y,
        ax: p2.x - dx * 0.3,
        ay: p2.y - dy * 0.3,
        xref: 'x',
        yref: 'y',
        axref: 'x',
        ayref: 'y',
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1.5,
        arrowwidth: 2,
        arrowcolor: curve.color,
        opacity: 0.9,
      });
    }
  });
  
  return annotations;
}

export const GraphW: React.FC<GraphWProps> = ({ curves, points, transformType }) => {
  const data = useMemo(() => {
    const traces: Plotly.Data[] = [];

    // Añadir curvas transformadas
    curves.forEach((curve) => {
      if (curve.points.length === 0) return;

      traces.push({
        x: curve.points.map(p => p.x),
        y: curve.points.map(p => p.y),
        type: 'scatter',
        mode: 'lines',
        line: {
          color: curve.color,
          width: 2.5,
        },
        name: `Ec. ${curve.equationId}'`,
        hovertemplate: '(%{x:.2f}, %{y:.2f})<extra></extra>',
      });
    });

    // Añadir puntos transformados
    const validPoints = points.filter(p => p.transformedValue !== null);
    if (validPoints.length > 0) {
      traces.push({
        x: validPoints.map(p => p.transformedValue!.x),
        y: validPoints.map(p => p.transformedValue!.y),
        type: 'scatter',
        mode: 'markers+text' as Plotly.PlotData['mode'],
        marker: {
          color: '#f72585',
          size: 12,
          symbol: 'diamond',
          line: {
            color: '#ffffff',
            width: 2,
          },
        },
        text: validPoints.map(p => `${p.name}'`),
        textposition: 'top center',
        textfont: {
          family: 'JetBrains Mono',
          size: 12,
          color: '#f72585',
        },
        name: "Puntos'",
        hovertemplate: "%{text}: (%{x:.2f}, %{y:.2f})<extra></extra>",
      });
    }

    return traces;
  }, [curves, points]);

  const arrowAnnotations = useMemo(() => calculateArrowAnnotations(curves), [curves]);

  const layout: Partial<Plotly.Layout> = useMemo(() => {
    const baseAnnotations = arrowAnnotations || [];
    
    return {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(22, 22, 42, 0.8)',
      font: {
        family: 'Outfit, sans-serif',
        color: '#a0a0b8',
      },
      margin: { l: 50, r: 20, t: 40, b: 50 },
      xaxis: {
        title: { text: 'u', font: { size: 14, color: '#a0a0b8' } },
        gridcolor: 'rgba(42, 42, 69, 0.8)',
        zerolinecolor: 'rgba(247, 37, 133, 0.3)',
        zerolinewidth: 1,
        tickfont: { family: 'JetBrains Mono', size: 10 },
        showgrid: true,
        dtick: 1,
      },
      yaxis: {
        title: { text: 'v', font: { size: 14, color: '#a0a0b8' } },
        gridcolor: 'rgba(42, 42, 69, 0.8)',
        zerolinecolor: 'rgba(247, 37, 133, 0.3)',
        zerolinewidth: 1,
        tickfont: { family: 'JetBrains Mono', size: 10 },
        showgrid: true,
        scaleanchor: 'x',
        scaleratio: 1,
        dtick: 1,
      },
      showlegend: true,
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1,
        bgcolor: 'rgba(22, 22, 42, 0.9)',
        bordercolor: 'rgba(42, 42, 69, 1)',
        borderwidth: 1,
        font: { size: 11 },
      },
      dragmode: 'pan',
      hovermode: 'closest',
      annotations: [
        ...baseAnnotations,
        {
          text: getTransformFormula(transformType),
          showarrow: false,
          x: 0.02,
          y: 0.98,
          xref: 'paper',
          yref: 'paper',
          xanchor: 'left',
          yanchor: 'top',
          font: {
            family: 'JetBrains Mono',
            size: 11,
            color: '#7b2cbf',
          },
          bgcolor: 'rgba(123, 44, 191, 0.15)',
          borderpad: 4,
        },
      ],
    };
  }, [transformType, arrowAnnotations]);

  const config: Partial<Plotly.Config> = useMemo(() => ({
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'select2d', 
      'lasso2d', 
      'autoScale2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines',
    ] as Plotly.ModeBarDefaultButtons[],
    displaylogo: false,
    scrollZoom: true,
  }), []);

  return (
    <div className="graph-container">
      <div className="graph-title" style={{ color: 'var(--accent-tertiary)' }}>
        Plano W (u, v)
      </div>
      <Plot
        data={data}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
      />
    </div>
  );
};
