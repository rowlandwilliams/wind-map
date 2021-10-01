import classNames from "classnames";

interface Props {
  inYAxisTransformThreshold: boolean;
}

export const TooltipTriangles = ({ inYAxisTransformThreshold }: Props) => {
  return (
    <>
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
          borderTop: "12px solid #18181b",
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
          borderBottom: "12px solid #18181b",
        }}
      ></div>
    </>
  );
};
