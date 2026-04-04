import { Link } from "react-router-dom";
import { useTopProductLines } from "@/hooks/useVehicles";
import { Skeleton } from "./ui/skeleton";
import { getCategoryIcon } from "@/lib/categoryIcons";

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
              {(() => { const Icon = getCategoryIcon(line.product_line); return (
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" strokeWidth={1.5} />
                </div>
              ); })()}
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
