import { scaleLinear } from "d3-scale";

const scaleColors = ["#8000ff", "#c603fc", "#00fbff", "#005eff"];

export const colorScale = scaleLinear()
  .domain([0, 100, 200, 300, 400].reverse())
  .range(scaleColors as any);
