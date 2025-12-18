declare module 'plotly.js-dist-min' {
  export * from 'plotly.js';
}

// Extend global namespace with Plotly types for convenience
import * as PlotlyTypes from 'plotly.js';

declare global {
  namespace Plotly {
    type Data = PlotlyTypes.Data;
    type Layout = PlotlyTypes.Layout;
    type Config = PlotlyTypes.Config;
    type PlotData = PlotlyTypes.PlotData;
    type ModeBarDefaultButtons = PlotlyTypes.ModeBarDefaultButtons;
  }
}

export {};
