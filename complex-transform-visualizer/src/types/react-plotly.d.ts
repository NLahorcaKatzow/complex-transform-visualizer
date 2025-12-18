declare module 'react-plotly.js' {
  import { Component } from 'react';
  import * as Plotly from 'plotly.js';

  interface PlotParams {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    frames?: Plotly.Frame[];
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    debug?: boolean;
    divId?: string;
    revision?: number;
    onInitialized?: (figure: Readonly<{ data: Plotly.Data[]; layout: Plotly.Layout }>, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: Readonly<{ data: Plotly.Data[]; layout: Plotly.Layout }>, graphDiv: HTMLElement) => void;
    onPurge?: (figure: Readonly<{ data: Plotly.Data[]; layout: Plotly.Layout }>, graphDiv: HTMLElement) => void;
    onError?: (error: Error) => void;
    onHover?: (event: Readonly<Plotly.PlotHoverEvent>) => void;
    onUnhover?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
    onClick?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
    onSelected?: (event: Readonly<Plotly.PlotSelectionEvent>) => void;
    onRelayout?: (event: Readonly<Plotly.PlotRelayoutEvent>) => void;
    onRestyle?: (event: Readonly<Plotly.PlotRestyleEvent>) => void;
    onRedraw?: () => void;
    onAfterPlot?: () => void;
  }

  class Plot extends Component<PlotParams> {}
  export default Plot;
}

