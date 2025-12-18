import { Point, Equation } from '../../types';
import { formatPoint2D } from '../../math/complex';

interface PointsPanelProps {
  points: Point[];
  equations: Equation[];
  onAddPoint: () => void;
  onUpdatePoint: (point: Point) => void;
  onDeletePoint: (id: string) => void;
}

export const PointsPanel: React.FC<PointsPanelProps> = ({
  points,
  equations,
  onAddPoint,
  onUpdatePoint,
  onDeletePoint,
}) => {
  return (
    <div>
      <h3 className="panel-title" style={{ marginBottom: '12px' }}>
        <span className="panel-title-icon">•</span>
        Panel de Puntos
      </h3>

      {points.length === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}>
          No hay puntos definidos. Añade un punto para ver su transformación.
        </div>
      ) : (
        <div>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '50px 50px 80px 1fr auto',
            gap: '8px',
            padding: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            <span>Punto</span>
            <span>Ec.</span>
            <span>Param.</span>
            <span>(x, y)</span>
            <span></span>
          </div>

          {/* Points list */}
          {points.map(point => (
            <PointRow
              key={point.id}
              point={point}
              equations={equations}
              onUpdate={onUpdatePoint}
              onDelete={onDeletePoint}
            />
          ))}
        </div>
      )}

      <button 
        className="btn btn-add" 
        onClick={onAddPoint}
        disabled={equations.length === 0}
        style={{ 
          marginTop: '12px',
          opacity: equations.length === 0 ? 0.5 : 1,
        }}
      >
        + Añadir punto
      </button>
    </div>
  );
};

const PointRow: React.FC<{
  point: Point;
  equations: Equation[];
  onUpdate: (point: Point) => void;
  onDelete: (id: string) => void;
}> = ({ point, equations, onUpdate, onDelete }) => {
  const equation = equations.find(eq => eq.id === point.equationId);
  const paramName = equation?.type === 'y=f(x)' ? 'x' : 'y';

  return (
    <div className="point-row slide-in">
      {/* Nombre del punto */}
      <input
        type="text"
        className="input"
        value={point.name}
        onChange={(e) => onUpdate({ ...point, name: e.target.value.toUpperCase() })}
        style={{
          width: '50px',
          textAlign: 'center',
          fontWeight: 600,
          color: 'var(--accent-warning)',
          padding: '4px',
        }}
        maxLength={3}
      />

      {/* Ecuación asociada */}
      <select
        className="select"
        value={point.equationId}
        onChange={(e) => onUpdate({ ...point, equationId: parseInt(e.target.value) })}
        style={{ 
          padding: '4px 8px',
          fontSize: '0.85rem',
          width: '50px',
        }}
      >
        {equations.map((eq, index) => (
          <option key={eq.id} value={eq.id}>
            {index}
          </option>
        ))}
      </select>

      {/* Valor de entrada */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          {paramName}=
        </span>
        <input
          type="number"
          className="input input-small"
          value={point.inputValue}
          onChange={(e) => onUpdate({ ...point, inputValue: parseFloat(e.target.value) || 0 })}
          step="0.1"
          style={{ width: '50px' }}
        />
      </div>

      {/* Valor calculado */}
      <div className="point-value">
        {point.calculatedValue 
          ? formatPoint2D(point.calculatedValue) 
          : '—'
        }
      </div>

      {/* Botón eliminar */}
      <button
        className="btn-icon btn-icon-danger"
        onClick={() => onDelete(point.id)}
        title="Eliminar punto"
      >
        ×
      </button>
    </div>
  );
};
