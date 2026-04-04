import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ImageOff, Tag, Wrench, Car, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: product, isLoading, error } = useProduct(decodeURIComponent(sku ?? ""));

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
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-display text-lg">Loading...</div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </main>
    );
  }

  const displayPrice = product.net_price ?? product.list_price;
  const hasDiscount = product.list_price && product.net_price && product.net_price < product.list_price;
  const savings = hasDiscount ? (product.list_price! - product.net_price!).toFixed(2) : null;

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link
            to={`/shop?year=${product.year}&make=${product.make}&model=${product.model}`}
            className="hover:text-primary transition-colors"
          >
            {product.year} {product.make} {product.model}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.sku}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="bg-gradient-card rounded-2xl border border-border overflow-hidden aspect-square flex items-center justify-center p-8">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.description ?? product.sku}
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageOff className="w-24 h-24 text-muted-foreground/20" />
            )}
          </div>

          {/* Details */}
          <div>
            <span className="text-primary font-display uppercase tracking-wider text-sm">
              {product.product_line}
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-4 leading-tight">
              {product.description ?? product.sku}
            </h1>

            {/* Vehicle Compatibility */}
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-6">
              <Car className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium">
                Fits: <span className="text-primary">{product.year} {product.make} {product.model}</span>
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {displayPrice != null ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.list_price!.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-400 font-semibold">
                        Save ${savings}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Contact us for pricing</p>
              )}
            </div>

            <Button
              size="xl"
              variant="hero"
              className="w-full mb-8"
              onClick={handleAddToCart}
              disabled={displayPrice == null}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            {/* Part Numbers */}
            <div className="bg-gradient-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Part Information
              </h3>
              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground">SKU</span>
                  <p className="font-mono text-sm">{product.sku}</p>
                </div>
              </div>
              {product.oem_number && (
                <div className="flex items-start gap-3">
                  <Wrench className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground">OEM Number</span>
                    <p className="font-mono text-sm">{product.oem_number}</p>
                  </div>
                </div>
              )}
              {product.partslink_number && (
                <div className="flex items-start gap-3">
                  <Tag className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground">Partslink #</span>
                    <p className="font-mono text-sm">{product.partslink_number}</p>
                  </div>
                </div>
              )}
              {product.certification && (
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground">Certification</span>
                    <p className="text-sm text-green-400">{product.certification}</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="mt-6"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
