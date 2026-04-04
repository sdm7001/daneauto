import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubcategories } from "@/hooks/useVehicles";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  getCategoryIcon,
  getParentCategory,
  parentCategoryIcons,
  HIDDEN_SUBCATEGORIES,
} from "@/lib/categoryIcons";
import { Wrench as WrenchIcon } from "lucide-react";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const Categories = () => {
  usePageTitle("Parts Categories", "Browse auto body and collision parts by category. Bumpers, fenders, head lamps, tail lamps, hoods, doors, mirrors, radiators and more.");
  const { data: subcategories = [], isLoading } = useSubcategories();

  const grouped = subcategories.reduce<
    Record<string, { subcategory: string; count: number }[]>
  >((acc, sc) => {
    if (HIDDEN_SUBCATEGORIES.has(sc.subcategory)) return acc;
    const cat = getParentCategory(sc.subcategory);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sc);
    return acc;
  }, {});

  const sortedCategories = Object.entries(grouped).sort(
    (a, b) => b[1].reduce((s, x) => s + x.count, 0) - a[1].reduce((s, x) => s + x.count, 0)
  );

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <PageBreadcrumb segments={[{ label: "Categories" }]} className="mb-6" />
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            All <span className="text-primary">Categories</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our complete selection of collision and auto body parts by category and subcategory.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="bg-gradient-card rounded-xl border border-border p-8 text-center">
                      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
                      <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                      <Skeleton className="h-3 w-1/2 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {sortedCategories.map(([category, subs]) => {
              const CatIcon = parentCategoryIcons[category] || WrenchIcon;
              const totalCount = subs.reduce((s, x) => s + x.count, 0);

              return (
                <section key={category}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CatIcon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold">{category}</h2>
                      <p className="text-sm text-muted-foreground">
                        {totalCount.toLocaleString()} parts
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subs.map((sc, index) => {
                      const Icon = getCategoryIcon(sc.subcategory);
                      return (
                        <Link
                          key={sc.subcategory}
                          to={`/shop?subcategory=${encodeURIComponent(sc.subcategory)}`}
                          className="group bg-gradient-card rounded-xl border border-border p-8 text-center hover:border-primary transition-all duration-500 hover:-translate-y-2 shadow-card hover:shadow-glow animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                            <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                          </div>
                          <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {sc.subcategory}
                          </h3>
                          <p className="text-muted-foreground">
                            {sc.count.toLocaleString()} parts
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Categories;
