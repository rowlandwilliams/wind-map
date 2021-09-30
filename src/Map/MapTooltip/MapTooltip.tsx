import classNames from "classnames";
import { TooltipData } from "../Map";
import { TooltipGrid } from "./TooltipGrid/TooltipGrid";

interface Props {
  pointIsHovered: boolean;
  tooltipData: TooltipData;
  width: number;
  height: number;
}

const tooltipYOffset = 20;
const yAxisTransformThreshold = 1 / 4;
const xAxisTrasformThreshold = 1 / 8;

export const MapTooltip = ({
  pointIsHovered,
  tooltipData,
  width,
  height,
}: Props) => {
  const inYAxisTransformThreshold =
    tooltipData.mouseCoords[1] / height < yAxisTransformThreshold;

  const inLeftXAxisTrasformThreshold =
    tooltipData.mouseCoords[0] / width < yAxisTransformThreshold;
  const inRightXAxisTrasformThreshold =
    tooltipData.mouseCoords[0] / width > 1 - yAxisTransformThreshold;

  return (
    <div
      className={classNames(
        "absolute transform flex pointer-events-none bg-white p-4 border border-gray-200 shadow-lg font-tt-interfaces-regular",
        {
          hidden: !pointIsHovered,
          "-translate-x-1/2": inYAxisTransformThreshold,
          "-translate-x-1/2 -translate-y-full": !inYAxisTransformThreshold,
        }
      )}
      style={{
        left: tooltipData.mouseCoords[0],
        top:
          tooltipData.mouseCoords[1] +
          (inYAxisTransformThreshold ? tooltipYOffset : -tooltipYOffset),
      }}
    >
      <div>
        <div className="flex items-center">
          <TooltipGrid
            cityRank={Number(tooltipData.data?.rank) - 1}
            cityColor={tooltipData.data?.color}
          />
          <div className="font-tt-interfaces-bold text-6xl pl-4">
            {tooltipData.data?.rank}.{" "}
          </div>
        </div>

        <div className="whitespace-nowrap pt-4">
          <div className="font-tt-interfaces-demi">
            {tooltipData.data?.city}, {tooltipData.data?.state}
          </div>
          <div className="text-xs">
            <span className="font-semibold">Population: </span>
            {tooltipData.data?.population}
          </div>
          <div className="text-xs">
            <span className="font-semibold">Change from 2000 to 2013: </span>
            {tooltipData.data?.growth_from_2000_to_2013}
          </div>
        </div>
      </div>
      <div
        className={classNames(
          "absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-3 h-3",
          {
            hidden: inYAxisTransformThreshold,
          }
        )}
        style={{
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "12px solid #FFFFFF",
        }}
      ></div>
      <div
        className={classNames(
          "absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full w-3 h-3",
          {
            hidden: !inYAxisTransformThreshold,
          }
        )}
        style={{
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: "12px solid #FFFFFF",
        }}
      ></div>
    </div>
  );
};
