import { Complex, Point2D, TransformType, LinearParams, BilinearParams } from '../types';
import { add, multiply, divide, pow, point2DToComplex, complexToPoint2D } from './complex';

// Transformación lineal: w = az + b
export function linearTransform(z: Complex, params: LinearParams): Complex {
  const az = multiply(params.a, z);
  return add(az, params.b);
}

// Transformación cuadrática: w = z²
export function quadraticTransform(z: Complex): Complex {
  return pow(z, 2);
}

// Transformación de inversión: w = 1/z
export function inversionTransform(z: Complex): Complex {
  return divide({ re: 1, im: 0 }, z);
}

// Transformación bilineal (Möbius): w = (az + b) / (cz + d)
export function bilinearTransform(z: Complex, params: BilinearParams): Complex {
  const numerator = add(multiply(params.a, z), params.b);
  const denominator = add(multiply(params.c, z), params.d);
  return divide(numerator, denominator);
}

// Aplicar la transformación seleccionada a un número complejo
export function applyTransformComplex(
  z: Complex,
  transformType: TransformType,
  params: LinearParams | BilinearParams | null
): Complex {
  switch (transformType) {
    case 'linear':
      if (params && 'a' in params && 'b' in params && !('c' in params)) {
        return linearTransform(z, params as LinearParams);
      }
      return linearTransform(z, { a: { re: 1, im: 0 }, b: { re: 0, im: 0 } });
      
    case 'quadratic':
      return quadraticTransform(z);
      
    case 'inversion':
      return inversionTransform(z);
      
    case 'bilinear':
      if (params && 'c' in params && 'd' in params) {
        return bilinearTransform(z, params as BilinearParams);
      }
      return bilinearTransform(z, {
        a: { re: 1, im: 0 },
        b: { re: 0, im: 0 },
        c: { re: 0, im: 0 },
        d: { re: 1, im: 0 },
      });
      
    default:
      return z;
  }
}

// Aplicar la transformación a un punto 2D (convierte a complejo, transforma, y vuelve a 2D)
export function applyTransform(
  point: Point2D,
  transformType: TransformType,
  params: LinearParams | BilinearParams | null
): Point2D {
  const z = point2DToComplex(point);
  const w = applyTransformComplex(z, transformType, params);
  return complexToPoint2D(w);
}

// Obtener nombre legible de la transformación
export function getTransformName(type: TransformType): string {
  const names: Record<TransformType, string> = {
    linear: 'Lineal',
    quadratic: 'Cuadrática',
    inversion: 'Inversión',
    bilinear: 'Bilineal (Möbius)',
  };
  return names[type];
}

// Obtener la fórmula de la transformación
export function getTransformFormula(type: TransformType): string {
  const formulas: Record<TransformType, string> = {
    linear: 'w = az + b',
    quadratic: 'w = z²',
    inversion: 'w = 1/z',
    bilinear: 'w = (az + b) / (cz + d)',
  };
  return formulas[type];
}

// Verificar si la transformación requiere parámetros
export function requiresParams(type: TransformType): boolean {
  return type === 'linear' || type === 'bilinear';
}
