import { 
  TransformType, 
  LinearParams, 
  BilinearParams, 
  Complex 
} from '../../types';
import { getTransformFormula, requiresParams } from '../../math/transforms';

interface TransformSelectorProps {
  transformType: TransformType;
  transformParams: LinearParams | BilinearParams | null;
  onTransformTypeChange: (type: TransformType) => void;
  onTransformParamsChange: (params: LinearParams | BilinearParams | null) => void;
}

const ComplexInput: React.FC<{
  value: Complex;
  onChange: (value: Complex) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  return (
    <div className="param-group">
      <label className="param-label">{label}</label>
      <div className="complex-input">
        <input
          type="number"
          className="input input-small"
          value={value.re}
          onChange={(e) => onChange({ ...value, re: parseFloat(e.target.value) || 0 })}
          step="0.1"
          placeholder="Re"
        />
        <span>+</span>
        <input
          type="number"
          className="input input-small"
          value={value.im}
          onChange={(e) => onChange({ ...value, im: parseFloat(e.target.value) || 0 })}
          step="0.1"
          placeholder="Im"
        />
        <span>i</span>
      </div>
    </div>
  );
};

export const TransformSelector: React.FC<TransformSelectorProps> = ({
  transformType,
  transformParams,
  onTransformTypeChange,
  onTransformParamsChange,
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as TransformType;
    onTransformTypeChange(newType);
    
    // Inicializar parámetros según el tipo
    if (newType === 'linear') {
      onTransformParamsChange({
        a: { re: 1, im: 0 },
        b: { re: 0, im: 0 },
      });
    } else if (newType === 'bilinear') {
      onTransformParamsChange({
        a: { re: 1, im: 0 },
        b: { re: 0, im: 0 },
        c: { re: 0, im: 0 },
        d: { re: 1, im: 0 },
      });
    } else {
      onTransformParamsChange(null);
    }
  };

  const updateLinearParam = (key: 'a' | 'b', value: Complex) => {
    const current = transformParams as LinearParams;
    onTransformParamsChange({ ...current, [key]: value });
  };

  const updateBilinearParam = (key: 'a' | 'b' | 'c' | 'd', value: Complex) => {
    const current = transformParams as BilinearParams;
    onTransformParamsChange({ ...current, [key]: value });
  };

  return (
    <div className="card slide-in" style={{ margin: '16px', marginBottom: 0 }}>
      <div className="card-header">
        <h3 className="card-title">Transformación</h3>
        <span style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.85rem',
          color: 'var(--accent-quaternary)',
          background: 'rgba(76, 201, 240, 0.15)',
          padding: '2px 8px',
          borderRadius: '4px',
        }}>
          {getTransformFormula(transformType)}
        </span>
      </div>
      
      <div className="select-wrapper">
        <select 
          className="select"
          value={transformType}
          onChange={handleTypeChange}
        >
          <option value="linear">Lineal (w = az + b)</option>
          <option value="quadratic">Cuadrática (w = z²)</option>
          <option value="inversion">Inversión (w = 1/z)</option>
          <option value="bilinear">Bilineal / Möbius (w = (az + b)/(cz + d))</option>
        </select>
      </div>

      {requiresParams(transformType) && transformParams && (
        <div className="params-grid">
          {transformType === 'linear' && (
            <>
              <ComplexInput
                label="a ="
                value={(transformParams as LinearParams).a}
                onChange={(v) => updateLinearParam('a', v)}
              />
              <ComplexInput
                label="b ="
                value={(transformParams as LinearParams).b}
                onChange={(v) => updateLinearParam('b', v)}
              />
            </>
          )}
          
          {transformType === 'bilinear' && (
            <>
              <ComplexInput
                label="a ="
                value={(transformParams as BilinearParams).a}
                onChange={(v) => updateBilinearParam('a', v)}
              />
              <ComplexInput
                label="b ="
                value={(transformParams as BilinearParams).b}
                onChange={(v) => updateBilinearParam('b', v)}
              />
              <ComplexInput
                label="c ="
                value={(transformParams as BilinearParams).c}
                onChange={(v) => updateBilinearParam('c', v)}
              />
              <ComplexInput
                label="d ="
                value={(transformParams as BilinearParams).d}
                onChange={(v) => updateBilinearParam('d', v)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

