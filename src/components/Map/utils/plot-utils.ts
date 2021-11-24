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
const mapGrey = "#D1D5DB"; //"#1F2937";
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

export const drawMap = (width: number, height: number, statePolygons: any) => {
  const { svg, mapGroup, parentGroup, pointsGroup } = getMapSelections();

  const nCellsAcross = 100;
  const cellWidth = width / nCellsAcross;
  const nCellsDown = Math.floor(height / cellWidth);

  const coords: number[][] = [];

  for (var i = 0; i < nCellsAcross; i++) {
    for (var j = 0; j < nCellsDown; j++) {
      coords.push([cellWidth * i, cellWidth * j]);
    }
  }

  const lineLength = cellWidth / 2;

  pointsGroup
    .selectAll("line")
    .data(coords)
    .join("line")
    .attr("stroke", "red")
    .attr("x1", (d) => d[0])
    .attr("x2", (d) => d[0] + lineLength)
    .attr("y1", (d) => d[1])
    .attr("y2", (d) => d[1] + Math.random() * 5);

  const projection = getMapProjection(width, height, statePolygons);
  const pathGenerator = geoPath().projection(projection);

  const mapZoom = getMapZoom(parentGroup);

  plotUsBasemap(mapGroup, statePolygons, pathGenerator);

  svg.call(mapZoom as any);
};
