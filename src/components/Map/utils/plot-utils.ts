import {
  select,
  geoAlbersUsa,
  geoPath,
  Selection,
  BaseType,
  zoom,
  GeoPath,
  GeoPermissibleObjects,
} from "d3";

const padding = 50;
const mapGrey = "#4B5563"; //"#1F2937";
const backgroundColor = "#94a2a9";

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
    .attr("x2", (d: any) => d[0][0])
    .attr("y2", (d: any) => d[1][0])
    .style("opacity", 0.8)
    .transition()
    .duration((d) => Math.random() * 10000)
    .delay((d, i) => Math.random() * 10)
    .attr("x2", (d: any) => d[0][1])
    .attr("y2", (d: any) => d[1][1])
    .transition()
    .duration(1000)
    .style("opacity", 0.3)
    .on("end", function (this: any, event: any, d: any) {
      select(this).call(lineAnimate as any);
    });
}

export const drawMap = (width: number, height: number, statePolygons: any) => {
  const { svg, mapGroup, parentGroup, pointsGroup } = getMapSelections();

  const nCellsAcross = 50;
  const cellWidth = width / nCellsAcross;
  const nCellsDown = Math.ceil(height / cellWidth);
  const lineLength = cellWidth / 2;

  const coords: [number[], number[]][] = [];

  for (var i = 0; i < nCellsAcross; i++) {
    for (var j = 0; j < nCellsDown; j++) {
      coords.push([
        [cellWidth * i, cellWidth * i + lineLength],
        [
          cellWidth * j + Math.random() * lineLength,
          cellWidth * j + Math.random() * lineLength,
        ],
      ]);
    }
  }

  pointsGroup
    .selectAll("line")
    .data(coords)
    .join("line")
    .attr("x1", (d: any) => d[0][0])
    .attr("y1", (d: any) => d[1][0])

    .attr("stroke", "#8B5CF6")
    .call(lineAnimate as any);

  const projection = getMapProjection(width, height, statePolygons);
  const pathGenerator = geoPath().projection(projection);

  const mapZoom = getMapZoom(parentGroup);

  plotUsBasemap(mapGroup, statePolygons, pathGenerator);

  svg.call(mapZoom as any);
};
