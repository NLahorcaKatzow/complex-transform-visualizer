import { Point2D, Equation, Point, TransformType, Curve, LinearParams, BilinearParams } from '../types';
import { generateCurvePoints, evaluatePointOnEquation } from './parser';
import { applyTransform } from './transforms';

// Evaluar un punto usando su ecuación asociada
export function evaluatePoint(
  point: Point,
  equations: Equation[]
): Point2D | null {
  const equation = equations.find(eq => eq.id === point.equationId);
  if (!equation) return null;
  
  return evaluatePointOnEquation(equation.type, equation.expression, point.inputValue);
}

// Evaluar todos los puntos y calcular sus valores originales y transformados
export function evaluateAllPoints(
  points: Point[],
  equations: Equation[],
  transformType: TransformType,
  transformParams: LinearParams | BilinearParams | null
): Point[] {
  return points.map(point => {
    const calculatedValue = evaluatePoint(point, equations);
    let transformedValue: Point2D | null = null;
    
    if (calculatedValue) {
      const transformed = applyTransform(calculatedValue, transformType, transformParams);
      if (isFinite(transformed.x) && isFinite(transformed.y)) {
        transformedValue = transformed;
      }
    }
    
    return {
      ...point,
      calculatedValue,
      transformedValue,
    };
  });
}

// Generar todas las curvas para el plano Z (original)
export function generateOriginalCurves(equations: Equation[]): Curve[] {
  return equations.map(equation => {
    const { points, direction } = generateCurvePoints(
      equation.type,
      equation.expression,
      equation.domain
    );
    
    return {
      equationId: equation.id,
      points,
      color: equation.color,
      direction,
    };
  });
}

// Generar todas las curvas para el plano W (transformado)
export function generateTransformedCurves(
  equations: Equation[],
  transformType: TransformType,
  transformParams: LinearParams | BilinearParams | null
): Curve[] {
  return equations.map(equation => {
    const { points: originalPoints, direction } = generateCurvePoints(
      equation.type,
      equation.expression,
      equation.domain
    );
    
    const transformedPoints = originalPoints
      .map(point => applyTransform(point, transformType, transformParams))
      .filter(p => isFinite(p.x) && isFinite(p.y));
    
    return {
      equationId: equation.id,
      points: transformedPoints,
      color: equation.color,
      direction,
    };
  });
}

// Colores predefinidos para las ecuaciones
export const EQUATION_COLORS = [
  '#00f5d4', // Cyan
  '#f72585', // Magenta
  '#7b2cbf', // Purple
  '#4cc9f0', // Light blue
  '#ffc857', // Yellow
  '#ff6b6b', // Red
  '#4ecdc4', // Teal
  '#95e1d3', // Mint
];

// Obtener el siguiente color disponible para una nueva ecuación
export function getNextColor(usedColors: string[]): string {
  for (const color of EQUATION_COLORS) {
    if (!usedColors.includes(color)) {
      return color;
    }
  }
  return EQUATION_COLORS[usedColors.length % EQUATION_COLORS.length];
}

// Generar un ID único para puntos
export function generatePointId(): string {
  return `point_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Obtener el siguiente nombre de punto disponible (A, B, C, ...)
export function getNextPointName(existingPoints: Point[]): string {
  const usedNames = new Set(existingPoints.map(p => p.name));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (const letter of alphabet) {
    if (!usedNames.has(letter)) {
      return letter;
    }
  }
  
  let suffix = 1;
  while (true) {
    for (const letter of alphabet) {
      const name = `${letter}${suffix}`;
      if (!usedNames.has(name)) {
        return name;
      }
    }
    suffix++;
  }
}
