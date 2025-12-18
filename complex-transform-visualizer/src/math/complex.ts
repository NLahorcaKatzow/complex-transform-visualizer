import { Complex, Point2D } from '../types';

// Crear un número complejo
export function complex(re: number, im: number = 0): Complex {
  return { re, im };
}

// Convertir Point2D a Complex (x -> re, y -> im)
export function point2DToComplex(p: Point2D): Complex {
  return { re: p.x, im: p.y };
}

// Convertir Complex a Point2D (re -> x, im -> y)
export function complexToPoint2D(c: Complex): Point2D {
  return { x: c.re, y: c.im };
}

// Suma de números complejos
export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

// Resta de números complejos
export function subtract(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

// Multiplicación de números complejos
export function multiply(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

// División de números complejos
export function divide(a: Complex, b: Complex): Complex {
  const denominator = b.re * b.re + b.im * b.im;
  if (denominator === 0) {
    return { re: Infinity, im: Infinity };
  }
  return {
    re: (a.re * b.re + a.im * b.im) / denominator,
    im: (a.im * b.re - a.re * b.im) / denominator,
  };
}

// Módulo (valor absoluto) de un número complejo
export function abs(z: Complex): number {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

// Argumento (ángulo) de un número complejo
export function arg(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

// Conjugado de un número complejo
export function conjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}

// Potencia de un número complejo (z^n donde n es entero)
export function pow(z: Complex, n: number): Complex {
  if (n === 0) return { re: 1, im: 0 };
  if (n === 1) return z;
  if (n < 0) return divide({ re: 1, im: 0 }, pow(z, -n));
  
  const r = abs(z);
  const theta = arg(z);
  const rn = Math.pow(r, n);
  
  return {
    re: rn * Math.cos(n * theta),
    im: rn * Math.sin(n * theta),
  };
}

// Raíz cuadrada de un número complejo
export function sqrt(z: Complex): Complex {
  const r = abs(z);
  const theta = arg(z);
  const sqrtR = Math.sqrt(r);
  
  return {
    re: sqrtR * Math.cos(theta / 2),
    im: sqrtR * Math.sin(theta / 2),
  };
}

// Exponencial e^z
export function exp(z: Complex): Complex {
  const expRe = Math.exp(z.re);
  return {
    re: expRe * Math.cos(z.im),
    im: expRe * Math.sin(z.im),
  };
}

// Logaritmo natural ln(z)
export function ln(z: Complex): Complex {
  return {
    re: Math.log(abs(z)),
    im: arg(z),
  };
}

// Seno complejo
export function sin(z: Complex): Complex {
  return {
    re: Math.sin(z.re) * Math.cosh(z.im),
    im: Math.cos(z.re) * Math.sinh(z.im),
  };
}

// Coseno complejo
export function cos(z: Complex): Complex {
  return {
    re: Math.cos(z.re) * Math.cosh(z.im),
    im: -Math.sin(z.re) * Math.sinh(z.im),
  };
}

// Tangente compleja
export function tan(z: Complex): Complex {
  return divide(sin(z), cos(z));
}

// Formatear un punto 2D como string
export function formatPoint2D(p: Point2D, decimals: number = 2): string {
  if (!isFinite(p.x) || !isFinite(p.y)) {
    return '∞';
  }
  return `(${p.x.toFixed(decimals)}, ${p.y.toFixed(decimals)})`;
}

// Formatear un número complejo como string
export function formatComplex(z: Complex, decimals: number = 2): string {
  if (!isFinite(z.re) || !isFinite(z.im)) {
    return '∞';
  }
  
  const re = z.re.toFixed(decimals);
  const im = Math.abs(z.im).toFixed(decimals);
  
  if (Math.abs(z.im) < 0.0001) {
    return re;
  }
  if (Math.abs(z.re) < 0.0001) {
    return z.im >= 0 ? `${im}i` : `-${im}i`;
  }
  
  const sign = z.im >= 0 ? '+' : '-';
  return `${re} ${sign} ${im}i`;
}

// Verificar si dos números complejos son iguales (con tolerancia)
export function equals(a: Complex, b: Complex, tolerance: number = 1e-10): boolean {
  return Math.abs(a.re - b.re) < tolerance && Math.abs(a.im - b.im) < tolerance;
}
