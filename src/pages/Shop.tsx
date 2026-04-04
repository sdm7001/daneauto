import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import PageBreadcrumb, { type BreadcrumbSegment } from "@/components/PageBreadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import PopularForVehicle from "@/components/PopularForVehicle";
import VehicleSearch from "@/components/VehicleSearch";
import { useProducts, type ProductSort } from "@/hooks/useProducts";
import { useProductLines, useSubcategories } from "@/hooks/useVehicles";

const PAGE_SIZE = 24;

const Shop = () => {
  usePageTitle("Shop Auto Parts", "Search 319,910 collision and body parts by year, make, and model. Bumpers, fenders, head lamps, hoods, doors, mirrors and more. Ships Canada, USA, Mexico.");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [showFilters, setShowFilters] = useState(false);

  const year       = searchParams.get("year") ?? "";
  const make       = searchParams.get("make") ?? "";
  const model      = searchParams.get("model") ?? "";
  const productLine = searchParams.get("line") ?? "";
  const subcategory = searchParams.get("subcategory") ?? "";
  const search     = searchParams.get("search") ?? "";
  const sort       = (searchParams.get("sort") ?? "sku") as ProductSort;
  const page       = parseInt(searchParams.get("page") ?? "1");

  // Auto-search after 400 ms of inactivity (skip on initial render)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (searchInput.trim() === search) return;
    const timer = setTimeout(() => {
      setParam("search", searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const { data, isLoading, isPlaceholderData } = useProducts({
    year, make, model, productLine, subcategory, search, sort, page, pageSize: PAGE_SIZE,
  });

  const { data: lines = [] } = useProductLines(year, make, model);
  const { data: subcategories = [] } = useSubcategories(year || undefined, make || undefined, model || undefined);

  const products = data?.products ?? [];
  const total    = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasFilter = !!(year || make || model || productLine || subcategory || search);

  const setParam = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    setSearchParams(p);
  }, [searchParams, setSearchParams]);

  const setPage = (n: number) => {
    const p = new URLSearchParams(searchParams);
    if (n > 1) p.set("page", String(n)); else p.delete("page");
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const handleSearch = () => setParam("search", searchInput.trim());

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-card border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-4 flex-wrap">
            <Link to="/" className="flex items-center gap-0.5 hover:text-primary transition-colors">
              <Home className="w-3 h-3" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            {hasFilter ? (
              <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            ) : (
              <span className="text-foreground">Shop</span>
            )}
            {(year || make || model) && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium">
                  {[year, make, model].filter(Boolean).join(" ")}
                </span>
              </>
            )}
            {productLine && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium">{productLine}</span>
              </>
            )}
            {subcategory && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium">{subcategory}</span>
              </>
            )}
            {search && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-medium">"{search}"</span>
              </>
            )}
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Shop <span className="text-primary">Auto Parts</span>
          </h1>

          {(year || make || model) && (
            <div className="flex items-center gap-2 text-muted-foreground mb-4 flex-wrap">
              <span>Parts for:</span>
              <span className="text-primary font-semibold">
                {[year, make, model].filter(Boolean).join(" ")}
              </span>
              {total > 0 && (
                <span className="text-sm">— {total.toLocaleString()} parts found</span>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <SearchAutocomplete
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="default">Search</Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            {hasFilter && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          {(lines.length > 0 || subcategories.length > 0) && (
            <aside className={`lg:w-56 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-gradient-card rounded-xl border border-border p-5 sticky top-24 space-y-6">
                {/* Subcategory filter */}
                {subcategories.length > 0 && (
                  <div>
                    <h3 className="font-display text-base font-semibold mb-4 uppercase tracking-wider">
                      Subcategory
                    </h3>
                    <ul className="space-y-1">
                      <li>
                        <button
                          onClick={() => setParam("subcategory", "")}
                          className={`w-full text-left py-1.5 px-3 rounded-md text-sm transition-colors ${
                            !subcategory ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          All Subcategories
                        </button>
                      </li>
                      {subcategories.map((sc) => (
                        <li key={sc.subcategory}>
                          <button
                            onClick={() => setParam("subcategory", sc.subcategory)}
                            className={`w-full text-left py-1.5 px-3 rounded-md text-sm transition-colors ${
                              subcategory === sc.subcategory ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            {sc.subcategory}
                            <span className="text-xs opacity-70 ml-1">({sc.count.toLocaleString()})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Product Line filter */}
                {lines.length > 0 && (
                  <div>
                    <h3 className="font-display text-base font-semibold mb-4 uppercase tracking-wider">
                      Product Line
                    </h3>
                    <ul className="space-y-1">
                      <li>
                        <button
                          onClick={() => setParam("line", "")}
                          className={`w-full text-left py-1.5 px-3 rounded-md text-sm transition-colors ${
                            !productLine ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          All Lines
                        </button>
                      </li>
                      {lines.map((line) => (
                        <li key={line}>
                          <button
                            onClick={() => setParam("line", line)}
                            className={`w-full text-left py-1.5 px-3 rounded-md text-sm transition-colors ${
                              productLine === line ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            {line}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Products */}
          <div className="flex-1">
            {productLine && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setParam("line", "")}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to all parts
                  <span className="text-muted-foreground font-normal">
                    ({productLine})
                  </span>
                </Button>
              </div>
            )}

            {(year && make && model && !isLoading) && (
              <PopularForVehicle
                year={year}
                make={make}
                model={model}
                activeLine={productLine}
                onSelectLine={(line) => setParam("line", line)}
              />
            )}

            {!hasFilter ? (
              <div className="py-8 max-w-xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl font-bold mb-2">Find Parts for Your Vehicle</h2>
                  <p className="text-muted-foreground text-sm">
                    Select your year, make, and model — or search by SKU / OEM number above.
                  </p>
                </div>
                <VehicleSearch />
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                      <div className="flex items-center justify-between mt-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  No products found matching your criteria.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <p className="text-muted-foreground text-sm">
                    Showing{" "}
                    <span className="text-foreground font-semibold">
                      {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
                    </span>{" "}
                    of{" "}
                    <span className="text-foreground font-semibold">{total.toLocaleString()}</span>{" "}
                    parts
                  </p>
                  <select
                    value={sort}
                    onChange={(e) => setParam("sort", e.target.value === "sku" ? "" : e.target.value)}
                    className="text-sm bg-secondary border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label="Sort products"
                  >
                    <option value="sku">Sort: Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity ${
                    isPlaceholderData ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard key={`${product.sku}-${product.id}`} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      Page {page} of {totalPages.toLocaleString()}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Shop;
