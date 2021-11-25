import {
  select,
  geoAlbersUsa,
  geoPath,
  Selection,
  BaseType,
  zoom,
  GeoPath,
  GeoPermissibleObjects,
  easeLinear,
  easeCubic,
} from "d3";

const padding = 50;
const mapGrey = "#4B5563"; //"#1F2937";
const backgroundColor = "#94a2a9";
const windColor = "#c9c9c9";

const getMapSelections = () => {
  return {
    svg: select("#map-svg"),
    mapGroup: select("#map-group"),
    pointsGroup: select<SVGSVGElement, unknown>("#point-group"),
    parentGroup: select("#map-parent"),
  };
};

const getMapProjection = (width: number, height: number, polygons: any) => {
  return geoAlbersUsa().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    polygons
  );
};

const getMapZoom = (
  parentGroup: Selection<BaseType, unknown, HTMLElement, any>
) => {
  return zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      parentGroup.selectAll("path").attr("transform", event.transform);
      parentGroup.selectAll("line").attr("transform", event.transform);
    });
};

const plotUsBasemap = (
  mapGroup: Selection<BaseType, unknown, HTMLElement, any>,
  statePolygons: any,
  pathGenerator: GeoPath<any, GeoPermissibleObjects>
) => {
  return requestAnimationFrame(() => {
    mapGroup
      .selectAll("path")
      .data((statePolygons as any).features)
      .join("path")
      .attr("stroke", backgroundColor)
      .attr("stroke-width", 0.5)
      .attr("fill", mapGrey)
      .attr("d", pathGenerator as any);
  });
};

function lineAnimate(
  selection: Selection<SVGSVGElement, unknown, HTMLElement, any>
) {
  selection
    .attr("x1", (d: any) => d[0][0])
    .attr("x2", (d: any) => d[0][0])
    .attr("y1", (d: any) => d[1][0])
    .attr("y2", (d: any) => d[1][0])
    .style("opacity", 0.5)
    .transition()
    .ease(easeCubic)
    .duration((d) => Math.random() * 10000)
    .delay((d) => Math.random() * 10)
    .attr("x2", (d: any) => d[0][1])
    .transition()
    .duration(1000)
    .style("opacity", 0)
    .on("end", function (this: any) {
      select(this).call(lineAnimate as any);
    });
}

export const drawMap = (width: number, height: number, statePolygons: any) => {
  const { svg, mapGroup, parentGroup, pointsGroup } = getMapSelections();

  const nCellsAcross = 100;
  const cellWidth = width / nCellsAcross;
  const nCellsDown = 100;
  const lineLength = cellWidth / 2;

  const coords: [number[], number[]][] = [];

  for (var i = 0; i < nCellsAcross; i++) {
    for (var j = 0; j < nCellsDown; j++) {
      coords.push([
        [cellWidth * i, cellWidth * i + lineLength * 10],
        [
          cellWidth * j + Math.random() * lineLength,
          cellWidth * j + Math.random() * lineLength,
        ],
      ]);
    }
  }

  const projection = getMapProjection(width, height, statePolygons);
  const pathGenerator = geoPath().projection(projection);

  const mapZoom = getMapZoom(parentGroup);

  plotUsBasemap(mapGroup, statePolygons, pathGenerator);

  svg.call(mapZoom as any);

  pointsGroup
    .selectAll("line")
    .data(coords)
    .join("line")
    .attr("stroke", windColor)
    .call(lineAnimate as any);
};
