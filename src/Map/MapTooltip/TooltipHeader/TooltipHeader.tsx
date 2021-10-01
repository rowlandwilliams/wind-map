import { TooltipData } from "../../Map";
import { TooltipGrid } from "./TooltipGrid/TooltipGrid";

interface Props {
  tooltipData: TooltipData;
}

export const TooltipHeader = ({ tooltipData }: Props) => {
  return (
    <div className="flex items-center">
      <TooltipGrid
        cityRank={Number(tooltipData.data?.rank) - 1}
        cityColor={tooltipData.data?.color}
      />
      <div className="font-tt-interfaces-bold text-6xl pl-4">
        {tooltipData.data?.rank}.{" "}
      </div>
    </div>
  );
};
