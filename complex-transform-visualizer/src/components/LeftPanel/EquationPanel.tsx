import { Equation } from '../../types';
import { EquationEditor } from './EquationEditor';

interface EquationPanelProps {
  equations: Equation[];
  onAddEquation: () => void;
  onUpdateEquation: (equation: Equation) => void;
  onDeleteEquation: (id: number) => void;
}

export const EquationPanel: React.FC<EquationPanelProps> = ({
  equations,
  onAddEquation,
  onUpdateEquation,
  onDeleteEquation,
}) => {
  return (
    <>
      <div className="math-toolbar">
        <MathButton symbol="+" tooltip="Suma" />
        <MathButton symbol="-" tooltip="Resta" />
        <MathButton symbol="×" tooltip="Multiplicación" />
        <MathButton symbol="÷" tooltip="División" />
        <MathButton symbol="√" tooltip="Raíz cuadrada: sqrt(x)" />
        <MathButton symbol="x²" tooltip="Potencia: x^2" />
        <MathButton symbol="xⁿ" tooltip="Potencia n: x^n" />
        <MathButton symbol="sin" tooltip="Seno: sin(x)" isText />
        <MathButton symbol="cos" tooltip="Coseno: cos(x)" isText />
        <MathButton symbol="tan" tooltip="Tangente: tan(x)" isText />
        <MathButton symbol="π" tooltip="Pi: pi" />
        <MathButton symbol="e" tooltip="Euler: e" />
      </div>

      <div style={{ 
        padding: '12px', 
        background: 'var(--bg-input)', 
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}>
        <strong style={{ color: 'var(--accent-primary)' }}>Formato:</strong> Escribe ecuaciones como <code style={{ color: 'var(--accent-quaternary)' }}>y = 0</code> o <code style={{ color: 'var(--accent-quaternary)' }}>x = 2</code>
        <br />
        <strong style={{ color: 'var(--accent-primary)' }}>Dominio:</strong> Define el rango y dirección. Ej: <code style={{ color: 'var(--accent-quaternary)' }}>0 {'<'} x {'<'} 2</code> (izq→der) o <code style={{ color: 'var(--accent-quaternary)' }}>2 {'>'} x {'>'} 0</code> (der→izq)
      </div>

      {equations.map((equation, index) => (
        <EquationEditor
          key={equation.id}
          equation={equation}
          index={index}
          onUpdate={onUpdateEquation}
          onDelete={onDeleteEquation}
          canDelete={equations.length > 1}
        />
      ))}

      <button className="btn btn-add" onClick={onAddEquation}>
        + Añadir ecuación (lado del cuadrado)
      </button>
    </>
  );
};

// Componente auxiliar para botones matemáticos
const MathButton: React.FC<{
  symbol: string;
  tooltip: string;
  isText?: boolean;
}> = ({ symbol, tooltip, isText }) => (
  <button 
    className={`math-btn ${isText ? 'math-btn-text' : ''}`}
    title={tooltip}
  >
    {symbol}
  </button>
);
