import * as math from 'mathjs';
import { Point2D, Domain, EquationType } from '../types';

// Configurar math.js
const mathParser = math.parser();

// Evaluar una expresión matemática para un valor dado de la variable
export function evaluateExpression(expression: string, variable: string, value: number): number {
  try {
    const scope: Record<string, number> = {
      [variable]: value,
      x: variable === 'x' ? value : 0,
      y: variable === 'y' ? value : 0,
      pi: Math.PI,
      e: Math.E,
    };
    
    // Limpiar la expresión
    let cleanExpr = expression
      .replace(/\^/g, '^')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'pi')
      .trim();
    
    // Si la expresión está vacía, devolver 0
    if (!cleanExpr) return 0;
    
    // Evaluar
    const result = math.evaluate(cleanExpr, scope);
    
    if (typeof result === 'number') {
      return result;
    }
    
    return NaN;
  } catch {
    console.error('Error evaluating expression:', expression);
    return NaN;
  }
}

// Generar puntos de una curva basada en el tipo de ecuación y dominio
export function generateCurvePoints(
  type: EquationType,
  expression: string,
  domain: Domain,
  numPoints: number = 200
): { points: Point2D[]; direction: 'positive' | 'negative' } {
  const points: Point2D[] = [];
  
  const { from, to } = domain;
  const direction: 'positive' | 'negative' = from <= to ? 'positive' : 'negative';
  
  // Calcular el paso (puede ser positivo o negativo según la dirección)
  const step = (to - from) / (numPoints - 1);
  
  for (let i = 0; i < numPoints; i++) {
    const paramValue = from + i * step;
    
    if (type === 'y=f(x)') {
      // y es función de x
      const x = paramValue;
      const y = evaluateExpression(expression, 'x', x);
      
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y });
      }
    } else {
      // x es función de y (type === 'x=f(y)')
      const y = paramValue;
      const x = evaluateExpression(expression, 'y', y);
      
      if (isFinite(x) && isFinite(y)) {
        points.push({ x, y });
      }
    }
  }
  
  return { points, direction };
}

// Evaluar un punto específico en una ecuación
export function evaluatePointOnEquation(
  type: EquationType,
  expression: string,
  paramValue: number
): Point2D | null {
  if (type === 'y=f(x)') {
    const x = paramValue;
    const y = evaluateExpression(expression, 'x', x);
    
    if (isFinite(x) && isFinite(y)) {
      return { x, y };
    }
  } else {
    const y = paramValue;
    const x = evaluateExpression(expression, 'y', y);
    
    if (isFinite(x) && isFinite(y)) {
      return { x, y };
    }
  }
  
  return null;
}

// Formatear un dominio como string
export function formatDomain(domain: Domain): string {
  const { variable, from, to } = domain;
  
  const formatValue = (val: number): string => {
    if (Math.abs(val - Math.PI) < 0.0001) return 'π';
    if (Math.abs(val - 2 * Math.PI) < 0.0001) return '2π';
    if (Math.abs(val + Math.PI) < 0.0001) return '-π';
    if (Math.abs(val) < 0.0001) return '0';
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(2);
  };
  
  if (from <= to) {
    return `${formatValue(from)} < ${variable} < ${formatValue(to)}`;
  } else {
    return `${formatValue(from)} > ${variable} > ${formatValue(to)}`;
  }
}

// Parsear un string de dominio (ej: "0 < x < 2" o "2 > x > 0")
export function parseDomainString(domainStr: string): Domain | null {
  try {
    // Patrones para diferentes formatos
    // Formato: "0 < x < 2" o "0<x<2"
    const ascendingMatch = domainStr.match(/([^<>]+)\s*<\s*([xy])\s*<\s*([^<>]+)/);
    if (ascendingMatch) {
      const from = math.evaluate(ascendingMatch[1].trim().replace(/π/g, 'pi')) as number;
      const variable = ascendingMatch[2] as 'x' | 'y';
      const to = math.evaluate(ascendingMatch[3].trim().replace(/π/g, 'pi')) as number;
      return { variable, from, to };
    }
    
    // Formato: "2 > x > 0" o "2>x>0"
    const descendingMatch = domainStr.match(/([^<>]+)\s*>\s*([xy])\s*>\s*([^<>]+)/);
    if (descendingMatch) {
      const from = math.evaluate(descendingMatch[1].trim().replace(/π/g, 'pi')) as number;
      const variable = descendingMatch[2] as 'x' | 'y';
      const to = math.evaluate(descendingMatch[3].trim().replace(/π/g, 'pi')) as number;
      return { variable, from, to };
    }
    
    return null;
  } catch {
    return null;
  }
}

// Exportar el parser para uso externo
export { mathParser };
