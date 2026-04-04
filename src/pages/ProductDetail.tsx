import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart, ArrowLeft, ImageOff, Tag, Wrench, Car, Shield,
  CheckCircle, Package, Truck, RotateCcw, Info, ChevronRight, Copy, Share2, Star
} from "lucide-react";
import ProductReviews from "@/components/ProductReviews";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProduct, useRelatedProducts, useCompatibleVehicles } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import WishlistButton from "@/components/WishlistButton";
import StructuredData from "@/components/StructuredData";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const BASE_TITLE = "Dane Auto Parts Ltd";

const ProductDetail = () => {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const [shareCopied, setShareCopied] = useState(false);
  const { addItem } = useCart();
  const decodedSku = decodeURIComponent(sku ?? "");
  const { data: product, isLoading, error } = useProduct(decodedSku);
  const { data: relatedProducts } = useRelatedProducts(product);
  const { data: compatibleVehicles } = useCompatibleVehicles(product?.partslink_number);
  const { track } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      track(product.sku);
      document.title = `${product.description ?? product.sku} | ${BASE_TITLE}`;
      const price = product.net_price ?? product.list_price;
      const desc = [
        product.description ?? product.sku,
        `SKU: ${product.sku}`,
        product.product_line,
        `${product.year} ${product.make} ${product.model}`,
        price != null ? `$${price.toFixed(2)} CAD` : null,
        "Ships Canada, USA, Mexico.",
      ].filter(Boolean).join(" — ");
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = desc;

      // Canonical URL
      const canonicalId = "product-canonical";
      let canonical = document.getElementById(canonicalId) as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.id = canonicalId;
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `https://daneauto.ca/product/${encodeURIComponent(product.sku)}`;
    }
    return () => {
      document.title = BASE_TITLE;
      document.getElementById("product-canonical")?.remove();
    };
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.sku,
      name: product.description ?? product.sku,
      price: product.net_price ?? product.list_price ?? 0,
      image: product.image_url ?? "",
      category: product.product_line,
    });
    toast.success(`${product.sku} added to cart!`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <Skeleton className="h-4 w-64 mb-8" />
          <div className="grid lg:grid-cols-2 gap-10 mb-16">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-12 w-full mt-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Package className="w-20 h-20 text-muted-foreground/30" />
        <div>
          <h1 className="font-display text-2xl font-bold mb-2">Part Not Found</h1>
          <p className="text-muted-foreground max-w-sm">
            We couldn't find a part matching <span className="font-mono text-foreground">{decodedSku}</span>.
            It may have been discontinued or the SKU may be incorrect.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
          <Link to={`/shop?search=${encodeURIComponent(decodedSku)}`}>
            <Button variant="default">
              Search for "{decodedSku}"
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="ghost">Browse All Parts</Button>
          </Link>
        </div>
      </main>
    );
  }

  const displayPrice = product.net_price ?? product.list_price;
  const hasDiscount = product.list_price && product.net_price && product.net_price < product.list_price;
  const savings = hasDiscount ? (product.list_price! - product.net_price!).toFixed(2) : null;
  const discountPct = hasDiscount
    ? Math.round((1 - product.net_price! / product.list_price!) * 100)
    : 0;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.description ?? product.sku,
    sku: product.sku,
    ...(product.partslink_number ? { mpn: product.partslink_number } : {}),
    ...(product.image_url ? { image: product.image_url } : {}),
    brand: { "@type": "Brand", name: "OEM-Grade" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: displayPrice?.toFixed(2) ?? "0.00",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Dane Auto Parts Ltd" },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://daneauto.ca" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "https://daneauto.ca/shop" },
      {
        "@type": "ListItem", position: 3,
        name: `${product.year} ${product.make} ${product.model}`,
        item: `https://daneauto.ca/shop?year=${product.year}&make=${product.make}&model=${product.model}`,
      },
      {
        "@type": "ListItem", position: 4,
        name: product.product_line,
        item: `https://daneauto.ca/shop?year=${product.year}&make=${product.make}&model=${product.model}&line=${encodeURIComponent(product.product_line)}`,
      },
      { "@type": "ListItem", position: 5, name: product.description ?? product.sku },
    ],
  };

  return (
    <main className="min-h-screen py-6 md:py-10">
      <StructuredData data={productSchema} id={`product-${product.sku}`} />
      <StructuredData data={breadcrumbSchema} id={`breadcrumb-${product.sku}`} />
      <div className="container mx-auto px-4 max-w-7xl">
        <PageBreadcrumb
          segments={[
            { label: "Shop", href: "/shop" },
            {
              label: `${product.year} ${product.make} ${product.model}`,
              href: `/shop?year=${product.year}&make=${encodeURIComponent(product.make)}&model=${encodeURIComponent(product.model)}`,
            },
            {
              label: product.product_line,
              href: `/shop?year=${product.year}&make=${encodeURIComponent(product.make)}&model=${encodeURIComponent(product.model)}&line=${encodeURIComponent(product.product_line)}`,
            },
            { label: product.description ?? product.sku },
          ]}
          className="mb-6 md:mb-8"
        />

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Image */}
          <div className="space-y-4">
            <div className="bg-gradient-card rounded-2xl border border-border overflow-hidden aspect-square flex items-center justify-center p-6 md:p-10 relative">
              {discountPct > 0 && (
                <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1.5 rounded-lg z-10">
                  -{discountPct}% OFF
                </span>
              )}
              {product.certification && (
                <span className="absolute top-4 right-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-10">
                  <Shield className="w-3.5 h-3.5" />
                  {product.certification}
                </span>
              )}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.description ?? product.sku}
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageOff className="w-24 h-24 text-muted-foreground/20" />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-primary font-display uppercase tracking-wider text-sm font-semibold">
              {product.product_line}
            </span>
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-4 leading-tight">
              {product.description ?? product.sku}
            </h1>

            {/* Vehicle Fit Badge */}
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-6">
              <Car className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium">
                Fits: <span className="text-primary font-semibold">{product.year} {product.make} {product.model}</span>
              </span>
            </div>

            {/* Price Block */}
            <div className="mb-6">
              {displayPrice != null ? (
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-primary font-display">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-muted-foreground line-through mb-1">
                        ${product.list_price!.toFixed(2)}
                      </span>
                      <span className="text-sm bg-green-500/10 text-green-400 font-semibold px-2.5 py-1 rounded-md mb-1">
                        Save ${savings}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground text-lg mb-3">Call for price</p>
                  <Link to={`/contact?subject=${encodeURIComponent(`Price inquiry: ${product.sku}`)}`}>
                    <Button variant="outline" size="sm">Request a Quote</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex gap-3 mb-6">
              <Button
                size="xl"
                variant="hero"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={displayPrice == null}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <WishlistButton sku={product.sku} size="default" className="h-auto px-4 border border-border bg-gradient-card rounded-xl" />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-secondary/30 border border-border">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground leading-tight">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-secondary/30 border border-border">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground leading-tight">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-secondary/30 border border-border">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground leading-tight">OEM Quality</span>
              </div>
            </div>

            {/* Quick Part Numbers */}
            <div className="bg-gradient-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Part Numbers
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <PartDetail icon={Tag} label="SKU" value={product.sku} />
                {product.oem_number && <PartDetail icon={Wrench} label="OEM #" value={product.oem_number} />}
                {product.partslink_number && <PartDetail icon={Tag} label="Partslink #" value={product.partslink_number} muted />}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="self-start"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
              <Button
                variant="ghost"
                className="self-start"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2000);
                  });
                }}
                title="Copy link to this part"
              >
                {shareCopied
                  ? <><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Copied!</>
                  : <><Share2 className="w-4 h-4 mr-2" /> Share</>}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 md:mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-0">
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-display font-semibold text-sm"
              >
                <Info className="w-4 h-4 mr-2" />
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="compatibility"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-display font-semibold text-sm"
              >
                <Car className="w-4 h-4 mr-2" />
                Compatibility
                {compatibleVehicles && compatibleVehicles.length > 1 && (
                  <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                    {compatibleVehicles.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-display font-semibold text-sm"
              >
                <Package className="w-4 h-4 mr-2" />
                Related Parts
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-display font-semibold text-sm"
              >
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-secondary/20">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider">Product Details</h3>
                  </div>
                  <div className="divide-y divide-border">
                    <SpecRow label="SKU" value={product.sku} />
                    <SpecRow label="Description" value={product.description ?? "—"} />
                    <SpecRow label="Product Line" value={product.product_line} />
                    <SpecRow label="Certification" value={product.certification ?? "—"} highlight={!!product.certification} />
                  </div>
                </div>

                <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-secondary/20">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider">Reference Numbers</h3>
                  </div>
                  <div className="divide-y divide-border">
                    <SpecRow label="OEM Number" value={product.oem_number ?? "—"} mono />
                    <SpecRow label="Partslink Number" value={product.partslink_number ?? "—"} mono />
                    <SpecRow label="List Price" value={product.list_price ? `$${product.list_price.toFixed(2)}` : "—"} />
                    <SpecRow label="Net Price" value={product.net_price ? `$${product.net_price.toFixed(2)}` : "—"} highlight />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Compatibility Tab */}
            <TabsContent value="compatibility" className="mt-8">
              {!product.partslink_number ? (
                <div className="bg-gradient-card rounded-xl border border-border p-8 text-center">
                  <Car className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No cross-reference data available for this part.
                  </p>
                </div>
              ) : compatibleVehicles && compatibleVehicles.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    This part (Partslink: <span className="font-mono text-foreground">{product.partslink_number}</span>) fits the following vehicles:
                  </p>
                  <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
                    <div className="grid grid-cols-[auto_1fr_1fr] md:grid-cols-[auto_1fr_1fr_auto] px-5 py-3 border-b border-border bg-secondary/20 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <span className="w-16">Year</span>
                      <span>Make</span>
                      <span>Model</span>
                      <span className="hidden md:block w-20 text-right">Status</span>
                    </div>
                    <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                      {compatibleVehicles.map((v, i) => {
                        const isCurrent = v.year === product.year && v.make === product.make && v.model === product.model;
                        return (
                          <div
                            key={i}
                            className={`grid grid-cols-[auto_1fr_1fr] md:grid-cols-[auto_1fr_1fr_auto] px-5 py-3 text-sm ${
                              isCurrent ? "bg-primary/5" : "hover:bg-secondary/30"
                            } transition-colors`}
                          >
                            <span className="w-16 font-mono font-semibold">{v.year}</span>
                            <span>{v.make}</span>
                            <span>{v.model}</span>
                            <span className="hidden md:flex items-center justify-end w-20">
                              {isCurrent ? (
                                <span className="flex items-center gap-1 text-primary text-xs font-semibold">
                                  <CheckCircle className="w-3.5 h-3.5" /> Current
                                </span>
                              ) : (
                                <Link
                                  to={`/shop?year=${v.year}&make=${encodeURIComponent(v.make)}&model=${encodeURIComponent(v.model)}`}
                                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                  View →
                                </Link>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-card rounded-xl border border-border p-8 text-center">
                  <div className="animate-pulse text-muted-foreground">Loading compatibility data...</div>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-8">
              <ProductReviews sku={product.sku} />
            </TabsContent>

            {/* Related Parts Tab */}
            <TabsContent value="related" className="mt-8">
              {relatedProducts && relatedProducts.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground text-sm">
                      Other <span className="text-foreground font-medium">{product.product_line}</span> parts for the {product.year} {product.make} {product.model}:
                    </p>
                    <Link
                      to={`/shop?year=${product.year}&make=${encodeURIComponent(product.make)}&model=${encodeURIComponent(product.model)}&line=${encodeURIComponent(product.product_line)}`}
                      className="text-sm text-primary hover:underline shrink-0 ml-4"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedProducts.map((p) => (
                      <ProductCard key={p.sku} product={p} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-card rounded-xl border border-border p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No related parts found for this vehicle.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

/* Helper components */
function PartDetail({ icon: Icon, label, value, muted }: {
  icon: React.ElementType; label: string; value: string; muted?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      className="flex items-start gap-2.5 text-left group hover:bg-secondary/40 rounded-lg p-1 -m-1 transition-colors"
      title={`Copy ${label}`}
    >
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${muted ? "text-muted-foreground" : "text-primary"}`} />
      <div className="flex-1 min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1.5">
          <p className="font-mono text-sm truncate">{value}</p>
          {copied
            ? <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
            : <Copy className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/60 shrink-0 transition-colors" />}
        </div>
      </div>
    </button>
  );
}

function SpecRow({ label, value, mono, highlight }: {
  label: string; value: string; mono?: boolean; highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center px-5 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-right ${mono ? "font-mono" : ""} ${highlight ? "text-primary" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default ProductDetail;
