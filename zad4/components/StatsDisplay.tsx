import React from "react";
import { PokemonStat } from "@/types";

interface StatsDisplayProps {
  stats: PokemonStat[];
  sumOfStats: number;
}

// Komponent serwerowy (RSC)
export function StatsDisplay({ stats, sumOfStats }: StatsDisplayProps) {
  return (
    <dl className="stats bg-linear-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/20 grid grid-cols-2 gap-x-5 gap-y-3 p-4 rounded-lg my-4">
      <h2 className="col-span-2 text-center text-xl font-bold text-orange-400 mb-2">
        Base Stats
      </h2>

      {stats.map((stat) => (
        <React.Fragment key={stat.stat.name}>
          <dt className="font-bold text-orange-400 uppercase text-right border-r-2 border-orange-400/30 text-sm">
            {stat.stat.name.replace("-", " ")}:
          </dt>
          <dd className="text-white text-left">
            <ProgressBar value={stat.base_stat} />
          </dd>
        </React.Fragment>
      ))}

      <dt className="font-bold text-orange-400 uppercase text-right border-r-2 border-orange-400/30 col-span-1 mt-3 pt-3 border-t">
        Sum of all stats:
      </dt>
      <dd className="text-white text-left col-span-1 mt-3 pt-3 border-t border-orange-400/30">
        {sumOfStats}
      </dd>
    </dl>
  );
}

// --- Komponent paska postępu (Wewnętrzny) ---

interface ProgressBarProps {
  value: number;
}

function ProgressBar({ value }: ProgressBarProps) {
  let barColor: string;
  if (value < 50) barColor = "bg-red-500";
  else if (value < 75) barColor = "bg-yellow-500";
  else barColor = "bg-green-500";

  const percentage = Math.min(value, 200) / 2;
  const barWidth = `${percentage}%`;

  return (
    <div className="w-full h-4 bg-[#e0e0e0] rounded-full overflow-hidden relative">
      <div
        className={`h-full ${barColor} transition-all duration-500 flex items-center`}
        style={{ width: barWidth }}
      ></div>
      <span className="absolute top-0 left-1 text-xs font-bold text-white bg-black bg-opacity-40 px-1 rounded">
        {value}
      </span>
    </div>
  );
}
