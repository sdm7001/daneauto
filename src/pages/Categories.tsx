import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTopProductLines } from "@/hooks/useVehicles";
import { usePageTitle } from "@/hooks/usePageTitle";

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

const Categories = () => {
  usePageTitle("Parts Categories");
  const { data: lines = [], isLoading } = useTopProductLines(32);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            All <span className="text-primary">Categories</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our complete selection of collision and auto body parts by product line.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lines.map((line, index) => (
              <Link
                key={line.product_line}
                to={`/shop?line=${encodeURIComponent(line.product_line)}`}
                className="group bg-gradient-card rounded-xl border border-border p-8 text-center hover:border-primary transition-all duration-500 hover:-translate-y-2 shadow-card hover:shadow-glow animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-6xl block mb-6 group-hover:scale-110 transition-transform duration-300">
                  {lineIcon(line.product_line)}
                </span>
                <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {line.product_line}
                </h2>
                <p className="text-muted-foreground">
                  {line.count.toLocaleString()} parts available
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Categories;
