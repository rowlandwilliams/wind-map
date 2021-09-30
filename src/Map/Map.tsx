import {
  geoAlbersUsa,
  geoPath,
  select,
  scaleLinear,
  extent,
  interpolateSinebow,
} from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { debounce, throttle } from "lodash";
import { usOutline } from "./data/usOutline";
import { statePolygons } from "./data/statePolygons";
import { usCities } from "./data/usCities";
import randomColor from "randomcolor";
import { MapTooltip } from "./MapTooltip/MapTooltip";

export interface TooltipData {
  mouseCoords: [] | number[];
  data: string | null;
}

const initialState = {
  mouseCoords: [],
  data: null,
};

const padding = 50;

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
      const mapGroup = select("#map-group");
      const outline = select("#outline");
      const pointsGroup = select("#point-group");

      const projection = geoAlbersUsa().fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding],
        ],
        statePolygons as any
      );

      const pathGenerator = geoPath().projection(projection);
      const suh = pathGenerator(usOutline as any);

      const cities = usCities
        .map((city) => ({
          ...city,
          coords: projection([city.longitude, city.latitude]),
          color: randomColor({ luminosity: "dark" }),
        }))
        .slice(0, 500);

      const radiusScale = scaleLinear()
        .domain(
          extent(cities.map((city) => Number(city.population))) as [
            number,
            number
          ]
        )
        .range([3, 150]);

      requestAnimationFrame(() => {
        outline
          .join("path")
          .attr("class", "outlien")
          .attr("stroke", "#f1f1f1")
          .attr("fill", "none")
          .attr("stroke-width", 15)
          .attr("d", suh);
      });

      requestAnimationFrame(() => {
        mapGroup
          .selectAll("path")
          .data((statePolygons as any).features)
          .join("path")
          .attr("stroke", "grey")
          .attr("stroke-opacity", 0.4)
          .attr("fill", "white")
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
          .attr("fill", (d, i) => interpolateSinebow(i / 100))
          .attr("fill-opacity", 0.7)
          .attr("stroke", "white")
          .on("mouseenter", (event, d) => {
            debounceSetMouse({
              mouseCoords: [event.pageX, event.pageY],
              data: d.city,
            });
            setPointIsHovered(true);
          })
          .on("mousemove", (event, d) => {
            debounceSetMouse({
              mouseCoords: [event.pageX, event.pageY],
              data: d.city,
            });
          })
          .on("mouseleave", () => {
            setPointIsHovered(false);
          });
      });
    };

    drawMap();
    setIsLoaded(true);
  }, [width, height, debounceSetMouse]);

  return (
    <>
      <div
        className={classNames(
          "relative w-screen h-screen transition-all duration-1000 bg-blue-100",
          { "opacity-0": !isLoaded }
        )}
        ref={parentRef}
      >
        <svg width={width} height={height} id="map-svg">
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="5"></feGaussianBlur>
            </filter>
          </defs>

          <g id="shadow" width="100%" height="1000px">
            <path id="outline"></path>
          </g>
          <g id="map-group"></g>
          <g id="plot-group"></g>
          <g id="point-group"></g>
        </svg>
      </div>
      <MapTooltip pointIsHovered={pointIsHovered} tooltipData={tooltipData} />
    </>
  );
};
