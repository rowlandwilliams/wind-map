import { cityColors } from "../../../utils/cityColors";

interface Props {
  cityRank: number;
  cityColor: string;
}

export const TooltipGrid = ({ cityRank, cityColor }: Props) => {
  const nCities = 400;
  const gridLength = Math.sqrt(nCities);
  const svgWidth = 84;
  const circleRadius = svgWidth / gridLength / 2;
  return (
    <svg width={svgWidth} height={svgWidth}>
      {[...Array(gridLength)].map((x, i) =>
        [...Array(gridLength)].map((x, j) => (
          <circle
            r={circleRadius}
            fill={
              i * gridLength + j === cityRank
                ? cityColor
                : cityColors[i * gridLength + j]
            }
            fillOpacity={i * gridLength + j === cityRank ? 1 : 0.4}
            cx={j * circleRadius * 2 + circleRadius}
            cy={i * circleRadius * 2 + circleRadius}
            strokeWidth="0.25"
          ></circle>
        ))
      )}
    </svg>
  );
};
