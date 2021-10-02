import { CitiesDataWithCoords, TooltipData } from "./../../../types";
import {
  select,
  geoAlbersUsa,
  geoPath,
  GeoProjection,
  scaleLinear,
  extent,
  Selection,
  BaseType,
  zoom,
  GeoPath,
  GeoPermissibleObjects,
  ScaleLinear,
} from "d3";
import { cities } from "./data/citiesFinal";
import { DebouncedFunc } from "lodash";

const padding = 50;
const mapGrey = '#D1D5DB'//"#1F2937";
const backgroundColor = "#94a2a9";

const getMapSelections = () => {
  return {
    svg: select("#map-svg"),
    mapGroup: select("#map-group"),
    pointsGroup: select("#point-group"),
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

const getCitiesDataWithCoords = (projection: GeoProjection) => {
  return cities.map((city, i) => ({
    ...city,
    coords: projection([city.longitude, city.latitude]),
  }));
};

const getMaxRadiusFromWindowWidth = (width: number) => {
  if (width > 769) return 100;
  return 50;
};

const getRadiusScaleBasedOnWindowWidth = (width: number) => {
  return scaleLinear()
    .domain(
      extent(cities.map((city) => Number(city.population))) as [number, number]
    )
    .range([3, getMaxRadiusFromWindowWidth(width)]);
};

const getMapZoom = (
  parentGroup: Selection<BaseType, unknown, HTMLElement, any>
) => {
  return zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      parentGroup.selectAll("path").attr("transform", event.transform);
      parentGroup.selectAll("circle").attr("transform", event.transform);
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

const plotMapPoints = (
  pointsGroup: Selection<BaseType, unknown, HTMLElement, any>,
  cityData: CitiesDataWithCoords[],
  radiusScale: ScaleLinear<number, number, never>,
  debounceSetMouse: DebouncedFunc<
    React.Dispatch<React.SetStateAction<TooltipData>>
  >,
  setPointIsHovered: (value: React.SetStateAction<boolean>) => void
) => {
  return requestAnimationFrame(() => {
    pointsGroup
      .selectAll("circle")
      .data(cityData)
      .join("circle")
      .attr("cx", (d: any) => (d.coords === null ? null : d.coords[0]))
      .attr("cy", (d: any) => (d.coords === null ? null : d.coords[1]))
      .attr("r", (d) => radiusScale(Number(d.population)))
      .attr("fill", (d, i) => d.color)
      .attr("fill-opacity", 0.7)
      .attr("stroke-width", 0.5)
      .on("mouseenter", (event, d) => {
        debounceSetMouse({
          mouseCoords: [event.pageX, event.pageY],
          data: d,
        });
        setPointIsHovered(true);
      })
      .on("mousemove", (event, d) => {
        debounceSetMouse({
          mouseCoords: [event.pageX, event.pageY],
          data: d,
        });
      })
      .on("mouseleave", () => {
        setPointIsHovered(false);
      });
  });
};

export const drawMap = (
  width: number,
  height: number,
  statePolygons: any,
  debounceSetMouse: DebouncedFunc<
    React.Dispatch<React.SetStateAction<TooltipData>>
  >,
  setPointIsHovered: (value: React.SetStateAction<boolean>) => void
) => {
  const { svg, mapGroup, parentGroup, pointsGroup } = getMapSelections();

  const projection = getMapProjection(width, height, statePolygons);
  const pathGenerator = geoPath().projection(projection);

  const cityData = getCitiesDataWithCoords(projection);

  const radiusScale = getRadiusScaleBasedOnWindowWidth(width);

  const mapZoom = getMapZoom(parentGroup);

  plotUsBasemap(mapGroup, statePolygons, pathGenerator);

  plotMapPoints(
    pointsGroup,
    cityData,
    radiusScale,
    debounceSetMouse,
    setPointIsHovered
  );

  svg.call(mapZoom as any);
};
