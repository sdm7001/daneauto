import { Link } from "react-router-dom";
import { useTopProductLines } from "@/hooks/useVehicles";
import { Skeleton } from "./ui/skeleton";

// Map product line names to emojis for visual appeal
function lineIcon(line: string): string {
  const l = line.toLowerCase();
  if (l.includes("lamp") || l.includes("light") || l.includes("head")) return "💡";
  if (l.includes("fender")) return "🚗";
  if (l.includes("bumper")) return "🛡️";
  if (l.includes("hood")) return "🔧";
  if (l.includes("door")) return "🚪";
  if (l.includes("mirror")) return "🪞";
  if (l.includes("grille") || l.includes("grill")) return "⚙️";
  if (l.includes("fog")) return "🌫️";
  if (l.includes("radiator")) return "🌡️";
  if (l.includes("quarter")) return "🔩";
  if (l.includes("tail")) return "🔴";
  if (l.includes("spoiler") || l.includes("wing")) return "🏎️";
  if (l.includes("valance") || l.includes("apron")) return "📦";
  if (l.includes("panel")) return "🖼️";
  if (l.includes("signal") || l.includes("turn")) return "↩️";
  if (l.includes("roof")) return "🏠";
  if (l.includes("wheel") || l.includes("rim")) return "⭕";
  if (l.includes("air")) return "💨";
  if (l.includes("engine")) return "⚙️";
  if (l.includes("brake")) return "🛑";
  return "🔧";
}

const CategoryGrid = () => {
  const { data: lines = [], isLoading } = useTopProductLines(8);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-56 mx-auto mb-4" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (lines.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our top part categories — select a vehicle first to filter results
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {lines.map((line, index) => (
            <Link
              key={line.product_line}
              to={`/shop?line=${encodeURIComponent(line.product_line)}`}
              className="group relative bg-gradient-card rounded-xl border border-border p-6 text-center hover:border-primary transition-all duration-500 hover:-translate-y-1 shadow-card hover:shadow-glow animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="text-4xl md:text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                {lineIcon(line.product_line)}
              </span>
              <h3 className="font-display text-base font-semibold mb-1 group-hover:text-primary transition-colors leading-tight">
                {line.product_line}
              </h3>
              <p className="text-sm text-muted-foreground">
                {line.count.toLocaleString()} parts
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
