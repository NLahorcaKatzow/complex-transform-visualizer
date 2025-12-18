import { useState, useCallback, useMemo } from 'react';
import { 
  TransformType, 
  Equation, 
  Point, 
  LinearParams, 
  BilinearParams,
  Curve 
} from './types';
import { TransformSelector } from './components/LeftPanel/TransformSelector';
import { EquationPanel } from './components/LeftPanel/EquationPanel';
import { PointsPanel } from './components/LeftPanel/PointsPanel';
import { GraphZ } from './components/RightPanel/GraphZ';
import { GraphW } from './components/RightPanel/GraphW';
import { 
  evaluateAllPoints, 
  generateOriginalCurves, 
  generateTransformedCurves,
  getNextColor,
  generatePointId,
  getNextPointName,
} from './math/evaluator';

function App() {
  // Estado de la transformación
  const [transformType, setTransformType] = useState<TransformType>('quadratic');
  const [transformParams, setTransformParams] = useState<LinearParams | BilinearParams | null>({
    a: { re: 1, im: 0 },
    b: { re: 0, im: 0 },
  });

  // Estado de las ecuaciones - Ejemplo inicial: un cuadrado
  const [equations, setEquations] = useState<Equation[]>([
    {
      id: 0,
      type: 'y=f(x)',
      expression: '0',
      domain: { variable: 'x', from: 0, to: 2 },
      color: '#00f5d4',
    },
    {
      id: 1,
      type: 'x=f(y)',
      expression: '2',
      domain: { variable: 'y', from: 0, to: 1 },
      color: '#f72585',
    },
    {
      id: 2,
      type: 'y=f(x)',
      expression: '1',
      domain: { variable: 'x', from: 2, to: 0 },  // Dirección inversa
      color: '#7b2cbf',
    },
    {
      id: 3,
      type: 'x=f(y)',
      expression: '0',
      domain: { variable: 'y', from: 1, to: 0 },  // Dirección inversa
      color: '#4cc9f0',
    },
  ]);

  // Estado de los puntos
  const [points, setPoints] = useState<Point[]>([]);

  // Handlers para ecuaciones
  const handleAddEquation = useCallback(() => {
    const usedColors = equations.map(eq => eq.color);
    const newId = Math.max(...equations.map(eq => eq.id), -1) + 1;
    
    setEquations(prev => [...prev, {
      id: newId,
      type: 'y=f(x)',
      expression: '0',
      domain: { variable: 'x', from: 0, to: 1 },
      color: getNextColor(usedColors),
    }]);
  }, [equations]);

  const handleUpdateEquation = useCallback((updated: Equation) => {
    setEquations(prev => prev.map(eq => eq.id === updated.id ? updated : eq));
  }, []);

  const handleDeleteEquation = useCallback((id: number) => {
    setEquations(prev => prev.filter(eq => eq.id !== id));
    // También eliminar los puntos asociados a esta ecuación
    setPoints(prev => prev.filter(p => p.equationId !== id));
  }, []);

  // Handlers para puntos
  const handleAddPoint = useCallback(() => {
    if (equations.length === 0) return;
    
    const newPoint: Point = {
      id: generatePointId(),
      name: getNextPointName(points),
      equationId: equations[0].id,
      inputValue: 0,
      calculatedValue: null,
      transformedValue: null,
    };
    
    setPoints(prev => [...prev, newPoint]);
  }, [equations, points]);

  const handleUpdatePoint = useCallback((updated: Point) => {
    setPoints(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  const handleDeletePoint = useCallback((id: string) => {
    setPoints(prev => prev.filter(p => p.id !== id));
  }, []);

  // Calcular curvas y puntos evaluados
  const originalCurves: Curve[] = useMemo(() => {
    return generateOriginalCurves(equations.filter(eq => eq.expression.trim() !== ''));
  }, [equations]);

  const transformedCurves: Curve[] = useMemo(() => {
    return generateTransformedCurves(
      equations.filter(eq => eq.expression.trim() !== ''),
      transformType,
      transformParams
    );
  }, [equations, transformType, transformParams]);

  const evaluatedPoints = useMemo(() => {
    return evaluateAllPoints(points, equations, transformType, transformParams);
  }, [points, equations, transformType, transformParams]);

  return (
    <div className="app-container">
      {/* Panel izquierdo */}
      <div className="left-panel">
        {/* Selector de transformación */}
        <TransformSelector
          transformType={transformType}
          transformParams={transformParams}
          onTransformTypeChange={setTransformType}
          onTransformParamsChange={setTransformParams}
        />
        
        {/* Panel de ecuaciones */}
        <div className="panel-header">
          <h2 className="panel-title">
            <span className="panel-title-icon">ƒ</span>
            Panel de Ecuaciones
          </h2>
        </div>
        <div className="panel-content">
          <EquationPanel
            equations={equations}
            onAddEquation={handleAddEquation}
            onUpdateEquation={handleUpdateEquation}
            onDeleteEquation={handleDeleteEquation}
          />
          
          <div className="section-divider" />
          
          {/* Panel de puntos */}
          <PointsPanel
            points={evaluatedPoints}
            equations={equations}
            onAddPoint={handleAddPoint}
            onUpdatePoint={handleUpdatePoint}
            onDeletePoint={handleDeletePoint}
          />
        </div>
      </div>

      {/* Panel derecho - Gráficos */}
      <div className="right-panel">
        <GraphZ
          curves={originalCurves}
          points={evaluatedPoints}
        />
        <GraphW
          curves={transformedCurves}
          points={evaluatedPoints}
          transformType={transformType}
        />
      </div>
    </div>
  );
}

export default App;
