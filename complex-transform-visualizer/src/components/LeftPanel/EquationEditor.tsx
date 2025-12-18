import { Equation, EquationType } from '../../types';
import { formatDomain } from '../../math/parser';

interface EquationEditorProps {
  equation: Equation;
  index: number;
  onUpdate: (equation: Equation) => void;
  onDelete: (id: number) => void;
  canDelete: boolean;
}

export const EquationEditor: React.FC<EquationEditorProps> = ({
  equation,
  index,
  onUpdate,
  onDelete,
  canDelete,
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as EquationType;
    // Al cambiar el tipo, ajustar el dominio
    const newDomain = {
      ...equation.domain,
      variable: newType === 'y=f(x)' ? 'x' as const : 'y' as const,
    };
    onUpdate({
      ...equation,
      type: newType,
      domain: newDomain,
    });
  };

  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...equation,
      expression: e.target.value,
    });
  };

  const handleDomainFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onUpdate({
        ...equation,
        domain: { ...equation.domain, from: value },
      });
    }
  };

  const handleDomainToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onUpdate({
        ...equation,
        domain: { ...equation.domain, to: value },
      });
    }
  };

  const toggleDirection = () => {
    // Intercambiar from y to para cambiar la dirección
    onUpdate({
      ...equation,
      domain: {
        ...equation.domain,
        from: equation.domain.to,
        to: equation.domain.from,
      },
    });
  };

  const directionSymbol = equation.domain.from <= equation.domain.to ? '→' : '←';
  const domainVariable = equation.domain.variable;

  return (
    <div className="equation-container slide-in">
      <div className="equation-number">{index}</div>
      
      <div className="equation-input-wrapper">
        {/* Selector de tipo y expresión */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            className="select"
            value={equation.type}
            onChange={handleTypeChange}
            style={{ width: '90px', padding: '6px 8px', fontSize: '0.9rem' }}
          >
            <option value="y=f(x)">y =</option>
            <option value="x=f(y)">x =</option>
          </select>
          
          <input
            type="text"
            className="input"
            value={equation.expression}
            onChange={handleExpressionChange}
            placeholder="Ej: 0, 2, x+1"
            style={{ 
              flex: 1,
              borderLeft: `3px solid ${equation.color}`,
            }}
          />
        </div>
        
        {/* Dominio con dirección */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          marginTop: '8px',
          padding: '8px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>
            Dominio:
          </span>
          
          <input
            type="number"
            className="input input-small"
            value={equation.domain.from}
            onChange={handleDomainFromChange}
            step="0.5"
            style={{ width: '60px' }}
          />
          
          <button
            className="btn-icon"
            onClick={toggleDirection}
            title="Cambiar dirección"
            style={{ 
              fontSize: '1.1rem',
              color: equation.domain.from <= equation.domain.to 
                ? 'var(--accent-primary)' 
                : 'var(--accent-tertiary)',
            }}
          >
            {equation.domain.from <= equation.domain.to ? '< ' + domainVariable + ' <' : '> ' + domainVariable + ' >'}
          </button>
          
          <input
            type="number"
            className="input input-small"
            value={equation.domain.to}
            onChange={handleDomainToChange}
            step="0.5"
            style={{ width: '60px' }}
          />
          
          <span 
            className="domain-badge" 
            style={{ marginLeft: '8px' }}
            title="Dirección del recorrido"
          >
            {directionSymbol}
          </span>
        </div>
        
        {/* Mostrar dominio formateado */}
        <span className="domain-badge" style={{ marginTop: '4px' }}>
          {formatDomain(equation.domain)}
        </span>
      </div>
      
      <div className="equation-actions">
        {canDelete && (
          <button
            className="btn-icon btn-icon-danger"
            title="Eliminar ecuación"
            onClick={() => onDelete(equation.id)}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
