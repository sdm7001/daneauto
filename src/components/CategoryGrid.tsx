import { Link } from "react-router-dom";
import { useSubcategories } from "@/hooks/useVehicles";
import { Skeleton } from "./ui/skeleton";
import {
  getCategoryIcon,
  getParentCategory,
  parentCategoryIcons,
  HIDDEN_SUBCATEGORIES,
} from "@/lib/categoryIcons";
import { Wrench as WrenchIcon } from "lucide-react";

const CategoryGrid = () => {
  const { data: subcategories = [], isLoading } = useSubcategories();

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

  if (subcategories.length === 0) return null;

  const grouped = subcategories.reduce<
    Record<string, { subcategory: string; count: number }[]>
  >((acc, sc) => {
    const category = getParentCategory(sc.subcategory);
    if (!acc[category]) acc[category] = [];
    acc[category].push(sc);
    return acc;
  }, {});

  const sortedCategories = Object.entries(grouped).sort(
    (a, b) =>
      b[1].reduce((s, x) => s + x.count, 0) -
      a[1].reduce((s, x) => s + x.count, 0)
  );

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse parts across all categories — or select a vehicle first to narrow results
          </p>
        </div>

        <div className="space-y-10">
          {sortedCategories.map(([category, subs]) => {
            const CatIcon = parentCategoryIcons[category] || WrenchIcon;
            const totalCount = subs.reduce((s, x) => s + x.count, 0);

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CatIcon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{category}</h3>
                    <p className="text-xs text-muted-foreground">
                      {totalCount.toLocaleString()} parts
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {subs
                    .filter((s) => !HIDDEN_SUBCATEGORIES.has(s.subcategory))
                    .map((sc, index) => {
                      const Icon = getCategoryIcon(sc.subcategory);
                      return (
                        <Link
                          key={sc.subcategory}
                          to={`/shop?subcategory=${encodeURIComponent(sc.subcategory)}`}
                          className="group relative bg-gradient-card rounded-xl border border-border p-5 text-center hover:border-primary transition-all duration-500 hover:-translate-y-1 shadow-card hover:shadow-glow animate-fade-in"
                          style={{ animationDelay: `${index * 60}ms` }}
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" strokeWidth={1.5} />
                          </div>
                          <h4 className="font-display text-sm font-semibold mb-0.5 group-hover:text-primary transition-colors leading-tight">
                            {sc.subcategory}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {sc.count.toLocaleString()} parts
                          </p>
                        </Link>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
