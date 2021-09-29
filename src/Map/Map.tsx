import { geoAlbersUsa, geoPath, select } from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { debounce, throttle } from "lodash";
import { usOutline } from "./usOutline";
import { statePolygons } from "./statePolygons";
import { GeoProjection } from "d3-geo";
import { usCities } from "./usCities";
import randomColor from "randomcolor";

interface MouseData {
  mouseCoords: [] | number[];
  data: string | null;
}

interface CitiesData {
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string;
  state: string;
}

interface CitiesDataFinal {
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string;
  state: string;
  coords: [number, number];
}

const initialState = {
  mouseCoords: [],
  data: null,
};

export const Map = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pointIsHovered, setPointIsHovered] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<MouseData>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  const debounceSetMouse = useMemo(
    () => throttle(setMouseCoords, 10),
    [setMouseCoords]
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

      const padding = 50;

      const projection = geoAlbersUsa().fitExtent(
        [
          [padding / 2, 50],
          [width - padding, height],
        ],
        statePolygons as any
      );

      const pathGenerator = geoPath().projection(projection);
      const suh = pathGenerator(usOutline as any);

      // const coords = usCities.map((city) => {
      //   const temp= {}
      //   temp.city:
      // }
      const cities = usCities.map((city) => ({
        ...city,
        coords: projection([city.longitude, city.latitude]),
        color: randomColor({ luminosity: "light" }),
      }));

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
          .attr("r", (d) => 100 / Number(d.rank))
          .attr("fill", (d) => randomColor({ luminosity: "light" }))
          .attr("fill-opacity", 0.9)
          .attr("stroke", "yellow")
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
          "relative w-screen h-screen m-2 transition-all duration-1000",
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
      <div
        className={classNames("absolute bg-red-400 pointer-events-none", {
          hidden: pointIsHovered === false,
        })}
        style={{
          left: mouseCoords.mouseCoords[0],
          top: mouseCoords.mouseCoords[1],
        }}
      >
        {mouseCoords.data}
      </div>
    </>
  );
};
