import * as React from "react";
import classNames from "classnames";

interface Props {
  sliderMin: number;
  sliderMax: number;
  activeYear: number;
  handleYearChange: (newYear: number) => void;
}

export const TimeRadio = ({
  sliderMin,
  sliderMax,
  activeYear,
  handleYearChange,
}: Props) => {
  return (
    <div className="flex absolute bottom-2 left-1/2 transform -translate-x-1/2 font-tt-interfaces-regular">
      {[sliderMin, sliderMax].map((option) => (
        <div
          className={classNames(
            "rounded-sm w-min px-2 bg-gray-200 transition-all",
            {
              " text-gray-900 pointer-events-none": option === activeYear,
              "text-white cursor-pointer bg-opacity-0 hover:bg-opacity-20":
                option !== activeYear,
            }
          )}
          onClick={() => handleYearChange(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};
