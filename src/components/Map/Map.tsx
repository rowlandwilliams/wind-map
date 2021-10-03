import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { debounce, throttle } from "lodash";
import { statePolygons } from "./utils/data/statePolygons";
import { MapTooltip } from "./MapTooltip/MapTooltip";
import { TooltipData } from "../../types";
import { drawMap } from "./utils/plot-utils";
import { TimeRadio } from "./TimeSlider/TimeSlider";
import { citiesTimeSeries } from "./utils/data/citiesTimeSeries";

const initialState = {
  mouseCoords: [],
  data: null,
};

export const Map = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pointIsHovered, setPointIsHovered] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeYear, setActiveYear] = useState(2000);

  const debounceSetMouse = useMemo(
    () => throttle(setTooltipData, 10),
    [setTooltipData]
  );

  const handleYearChange = (newYear: number) => {
    setActiveYear(newYear);
  };

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
    drawMap(
      width,
      height,
      statePolygons,
      debounceSetMouse,
      setPointIsHovered,
      citiesTimeSeries.filter((point) => point.year === activeYear)
    );
    setIsLoaded(true);
  }, [width, height, debounceSetMouse, activeYear]);

  return (
    <>
      <div
        className={classNames(
          "relative w-screen h-96 md:h-screen transition-all duration-1000 bg-gray-900",
          { "opacity-0": !isLoaded }
        )}
        ref={parentRef}
      >
        <svg width={width} height={height} id="map-svg">
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
        Population of the 400 Largest US cities in {activeYear}
      </div>
      <TimeRadio
        sliderMin={2000}
        sliderMax={2013}
        activeYear={activeYear}
        handleYearChange={handleYearChange}
      />
      <MapTooltip
        pointIsHovered={pointIsHovered}
        tooltipData={tooltipData}
        width={width}
        height={height}
      />
    </>
  );
};
