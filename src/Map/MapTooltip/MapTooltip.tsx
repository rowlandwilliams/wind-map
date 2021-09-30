import classNames from "classnames";
import { TooltipData } from "../Map";
import { TooltipGrid } from "./TooltipGrid/TooltipGrid";

interface Props {
  pointIsHovered: boolean;
  tooltipData: TooltipData;
}

const tooltipYOffset = 20;

export const MapTooltip = ({ pointIsHovered, tooltipData }: Props) => {
  return (
    <div
      className={classNames(
        "absolute transform -translate-x-1/2 -translate-y-full flex pointer-events-none bg-white p-4 rounded-md border border-gray-200 shadow-2xl",
        {
          hidden: pointIsHovered === false,
        }
      )}
      style={{
        left: tooltipData.mouseCoords[0],
        top: tooltipData.mouseCoords[1] - tooltipYOffset,
      }}
    >
      <TooltipGrid />
      <div> {tooltipData.data}</div>
      <div
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-5 h-5"
        style={{
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "12px solid grey",
        }}
      ></div>
      <div
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-3 h-3"
        style={{
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "12px solid #FFFFFF",
        }}
      ></div>
    </div>
  );
};
