import { TooltipData } from "../../Map";

interface Props {
  tooltipData: TooltipData;
}

export const TooltipText = ({ tooltipData }: Props) => {
  return (
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
  );
};
