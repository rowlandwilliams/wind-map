import {
  geoAlbersUsa,
  geoPath,
  select,
  scaleLinear,
  scaleSequential,
  extent,
  interpolateReds,
  interpolateRgb,
  zoom,
} from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { debounce, throttle } from "lodash";
import { statePolygons } from "./data/statePolygons";
import { CitiesData, usCities } from "./data/usCities";
import { MapTooltip } from "./MapTooltip/MapTooltip";
import { usOutline } from "./data/usOutline";
import { colorScale } from "./utils/utils";

export interface TooltipData {
  mouseCoords: [] | number[];
  data: CitiesData | null;
}

const initialState = {
  mouseCoords: [],
  data: null,
};

const padding = 50;
const mapGrey = "#1F2937";
//"#f1f1f1";
const backgroundColor = "#94a2a9";

export const Map = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pointIsHovered, setPointIsHovered] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  const debounceSetMouse = useMemo(
    () => throttle(setTooltipData, 10),
    [setTooltipData]
  );

  const handleWindowResize = debounce((current: HTMLDivElement) => {
    setWidth(current.offsetWidth);
    setHeight(current.offsetHeight);
  }, 100);

  useEffect(() => {
    const { current } = parentRef;
    if (current) {
      handleWindowResize(current);
      const setResize = () => handleWindowResize(current);
      window.addEventListener("resize", setResize);
      return () => window.removeEventListener("resize", setResize);
    }
  }, [parentRef, handleWindowResize]);

  useEffect(() => {
    const drawMap = () => {
      const svg = select("#map-svg");
      const mapGroup = select("#map-group");
      const pointsGroup = select("#point-group");
      const parentGroup = select("#map-parent");

      const projection = geoAlbersUsa().fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding],
        ],
        statePolygons as any
      );

      const pathGenerator = geoPath().projection(projection);

      const cities = usCities.slice(0, 400).map((city, i) => ({
        ...city,
        coords: projection([city.longitude, city.latitude]),
        color: colorScale(i),
      }));

      const radiusScale = scaleLinear()
        .domain(
          extent(cities.map((city) => Number(city.population))) as [
            number,
            number
          ]
        )
        .range([3, 100]);

      const mapZoom = zoom()
        .scaleExtent([1, 8])
        .on("zoom", function (event) {
          parentGroup.selectAll("path").attr("transform", event.transform);
          parentGroup.selectAll("circle").attr("transform", event.transform);
        });

      requestAnimationFrame(() => {
        mapGroup
          .selectAll("path")
          .data((statePolygons as any).features)
          .join("path")
          .attr("stroke", backgroundColor)
          .attr("stroke-width", 0.5)
          .attr("fill", mapGrey)
          .attr("d", pathGenerator as any);
      });

      requestAnimationFrame(() => {
        pointsGroup
          .selectAll("circle")
          .data(cities)
          .join("circle")
          .attr("cx", (d: any) => (d.coords === null ? null : d.coords[0]))
          .attr("cy", (d: any) => (d.coords === null ? null : d.coords[1]))
          .attr("r", (d) => radiusScale(Number(d.population)))
          .attr("fill", (d, i) => d.color)
          .attr("fill-opacity", 0.7)
          // .attr("stroke", "white")
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

      svg.call(mapZoom as any);
    };

    drawMap();
    setIsLoaded(true);
  }, [width, height, debounceSetMouse]);

  return (
    <>
      <div
        className={classNames(
          "relative w-screen h-screen transition-all duration-1000 bg-gray-900",
          { "opacity-0": !isLoaded }
        )}
        // style={{ backgroundColor: backgroundColor }}
        ref={parentRef}
      >
        <svg width={width} height={height} id="map-svg">
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="5"></feGaussianBlur>
            </filter>
          </defs>
          <g id="map-parent">
            <g id="shadow" width="100%" height="1000px">
              <path id="outline"></path>
            </g>
            <g id="map-group"></g>
            <g id="plot-group"></g>
            <g id="point-group"></g>
          </g>
        </svg>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 font-semibold p-4 font-tt-interfaces-bold text-gray-100">
        Population of the 400 Largest US cities in 2013
      </div>
      <MapTooltip
        pointIsHovered={pointIsHovered}
        tooltipData={tooltipData}
        width={width}
        height={height}
      />
    </>
  );
};
