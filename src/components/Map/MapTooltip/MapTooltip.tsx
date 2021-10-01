import classNames from "classnames";
import { TooltipData } from "../../../types";
import { TooltipHeader } from "./TooltipHeader/TooltipHeader";
import { TooltipText } from "./TooltipText/TooltipText";
import { TooltipTriangles } from "./TooltipTriangles/TooltipTriangles";

interface Props {
  pointIsHovered: boolean;
  tooltipData: TooltipData;
  width: number;
  height: number;
}

const tooltipYOffset = 20;
const yAxisTransformThreshold = 1 / 4;

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
        "absolute transform flex pointer-events-none bg-gray-900 p-4 font-tt-interfaces-regular border border-gray-500 text-gray-100",
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
        boxShadow: "0px 9px 23px -12px rgba(253,253,253,0.24)",
      }}
    >
      <div>
        <TooltipHeader tooltipData={tooltipData} />
        <TooltipText tooltipData={tooltipData} />
      </div>
      <TooltipTriangles inYAxisTransformThreshold={inYAxisTransformThreshold} />
    </div>
  );
};
