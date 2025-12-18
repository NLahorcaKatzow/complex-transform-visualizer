// Tipos para números complejos (usado internamente)
export interface Complex {
  re: number;
  im: number;
}

// Punto en coordenadas cartesianas XY
export interface Point2D {
  x: number;
  y: number;
}

// Tipos de transformaciones disponibles
export type TransformType = 'linear' | 'quadratic' | 'inversion' | 'bilinear';

// Parámetros para cada transformación
export interface LinearParams {
  a: Complex;
  b: Complex;
}

export interface BilinearParams {
  a: Complex;
  b: Complex;
  c: Complex;
  d: Complex;
}

export type TransformParams = LinearParams | BilinearParams | null;

// Tipo de ecuación: y en función de x, o x en función de y
export type EquationType = 'y=f(x)' | 'x=f(y)';

// Dominio de una ecuación con dirección
export interface Domain {
  variable: 'x' | 'y';       // Variable independiente
  from: number;              // Valor inicial
  to: number;                // Valor final
  // La dirección se infiere: si from < to, va en sentido positivo; si from > to, va en sentido negativo
}

// Ecuación individual
export interface Equation {
  id: number;
  type: EquationType;           // Tipo de ecuación
  expression: string;           // La expresión (ej: "0" para y=0, o "2" para x=2)
  domain: Domain;               // Dominio con dirección
  color: string;
}

// Punto definido por el usuario
export interface Point {
  id: string;
  name: string;
  equationId: number;
  inputValue: number;           // Valor del parámetro (x o y según el tipo de ecuación)
  calculatedValue: Point2D | null;
  transformedValue: Point2D | null;
}

// Curva para graficar
export interface Curve {
  equationId: number;
  points: Point2D[];
  color: string;
  direction: 'positive' | 'negative';  // Dirección del recorrido
}

// Estado global de la aplicación
export interface AppState {
  transformType: TransformType;
  transformParams: TransformParams;
  equations: Equation[];
  points: Point[];
}

// Props para el editor de ecuaciones
export interface EquationEditorProps {
  equation: Equation;
  onUpdate: (equation: Equation) => void;
  onDelete: (id: number) => void;
}

// Props para el panel de puntos
export interface PointsPanelProps {
  points: Point[];
  equations: Equation[];
  onAddPoint: () => void;
  onUpdatePoint: (point: Point) => void;
  onDeletePoint: (id: string) => void;
}

// Props para los gráficos
export interface GraphProps {
  curves: Curve[];
  points: Point[];
  title: string;
  isTransformed?: boolean;
}
