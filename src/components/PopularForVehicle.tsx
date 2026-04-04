import { useVehicleProductLines } from "@/hooks/useVehicles";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Skeleton } from "./ui/skeleton";
import { TrendingUp } from "lucide-react";

interface Props {
  year: string;
  make: string;
  model: string;
  onSelectLine: (line: string) => void;
  activeLine?: string;
}

const PopularForVehicle = ({ year, make, model, onSelectLine, activeLine }: Props) => {
  const { data: lines = [], isLoading } = useVehicleProductLines(year, make, model, 8);

  if (!year || !make || !model) return null;
  if (!isLoading && lines.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="font-display text-lg font-semibold">
          Popular for {year} {make} {model}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-32 rounded-xl shrink-0" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {lines.map((line) => {
            const Icon = getCategoryIcon(line.product_line);
            const isActive = activeLine === line.product_line;
            return (
              <button
                key={line.product_line}
                onClick={() => onSelectLine(isActive ? "" : line.product_line)}
                className={`shrink-0 flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 min-w-[7rem] ${
                  isActive
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border bg-gradient-card hover:border-primary/50 shadow-card"
                }`}
              >
                {line.sample_image ? (
                  <div className={`w-12 h-12 rounded-lg overflow-hidden border ${
                    isActive ? "border-primary/40" : "border-border"
                  }`}>
                    <img
                      src={line.sample_image}
                      alt={line.product_line}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? "bg-primary/20" : "bg-primary/10"
                  }`}>
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                )}
                <span className={`text-xs font-medium leading-tight max-w-[5.5rem] ${
                  isActive ? "text-primary" : "text-foreground"
                }`}>
                  {line.product_line}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {line.count.toLocaleString()} parts
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PopularForVehicle;
