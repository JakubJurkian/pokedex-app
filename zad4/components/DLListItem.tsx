export default function CreateDLListItem({
  property,
  value,
  isBar,
}: {
  property: string;
  value: number | string;
  isBar?: boolean;
}) {
  let backgroundColor: string = "";
  const numericValue = typeof value === "number" ? value : NaN;

  if (isBar && !isNaN(numericValue)) {
    if (numericValue < 50) backgroundColor = "bg-red-500";
    else if (numericValue < 75) backgroundColor = "bg-yellow-400";
    else backgroundColor = "bg-green-500";
  }

  return (
    <>
      <dt className="font-bold text-yellow-400 uppercase text-right border-r-2 border-yellow-400/30 pr-2">
        {property}
      </dt>

      {isBar && !isNaN(numericValue) ? (
        <dd className="text-white pl-2">
          <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden relative">
            <div
              className={`h-full ${backgroundColor}`}
              style={{
                width: `${Math.min(Math.max(numericValue, 0), 100) / 2}%`,
                transition: "width 300ms ease",
              }}
            />
            <span className="absolute top-0 left-1/2 px-2 -translate-x-1/2 text-[0.75rem] text-white/90 bg-gray-400">
              {numericValue}
            </span>
          </div>
        </dd>
      ) : (
        <dd className="text-white pl-2">{value}</dd>
      )}
    </>
  );
}
