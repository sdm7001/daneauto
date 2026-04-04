import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopProductLines } from "@/hooks/useVehicles";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getCategoryIcon } from "@/lib/categoryIcons";

const Categories = () => {
  usePageTitle("Parts Categories", "Browse auto body and collision parts by category. Bumpers, fenders, head lamps, tail lamps, hoods, doors, mirrors, radiators and more.");
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="bg-gradient-card rounded-xl border border-border p-8 text-center">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
                <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
              </div>
            ))}
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
