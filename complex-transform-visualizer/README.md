# Visualizador de Transformadas Complejas

Aplicación de escritorio para visualizar transformaciones en el plano complejo, pasando de ecuaciones en el plano Z(x,y) al plano W(u,v).

## Características

- **Transformaciones soportadas:**
  - Lineal: `w = az + b`
  - Cuadrática: `w = z²`
  - Inversión: `w = 1/z`
  - Bilineal (Möbius): `w = (az + b)/(cz + d)`

- **Editor de ecuaciones** con soporte para:
  - Raíces cuadradas: `sqrt(x)`
  - Potencias: `x^2`, `x^n`
  - Funciones trigonométricas: `sin(t)`, `cos(t)`, `tan(t)`
  - Números complejos: `i`
  - Constantes: `pi`, `e`

- **Definición de dominios** para funciones paramétricas
- **Panel de puntos** para ver transformaciones de puntos específicos
- **Gráficos interactivos** con zoom y pan

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (solo web)
npm run dev

# Ejecutar como aplicación Electron
npm run electron:dev

# Construir para producción
npm run build
```

## Uso

### Panel de Ecuaciones
1. Selecciona el tipo de transformación en el dropdown superior
2. Escribe tu ecuación paramétrica (ej: `cos(t) + i*sin(t)` para un círculo)
3. Presiona el botón **R** para definir el dominio (rango de t)
4. Presiona **+** para añadir ecuaciones adicionales (funciones por partes)

### Panel de Puntos
1. Presiona **+ Añadir punto** para crear un nuevo punto
2. Asigna un nombre al punto (A, B, C...)
3. Selecciona a qué ecuación pertenece
4. Define el valor del parámetro (t)
5. El valor calculado z y su transformación w' se muestran automáticamente

### Gráficos
- **Plano Z**: Muestra las curvas originales y los puntos definidos
- **Plano W**: Muestra las curvas transformadas y los puntos transformados (con ')
- Usa el scroll del mouse para hacer zoom
- Arrastra para mover la vista

## Ejemplos de Ecuaciones

| Forma | Ecuación |
|-------|----------|
| Círculo unitario | `cos(t) + i*sin(t)` |
| Línea horizontal | `t + 0*i` |
| Línea vertical | `0 + i*t` |
| Espiral | `t*cos(t) + i*t*sin(t)` |
| Elipse | `2*cos(t) + i*sin(t)` |

## Tecnologías

- Electron
- React + TypeScript
- Plotly.js (gráficos interactivos)
- Math.js (evaluación de expresiones)
- Vite (bundler)

